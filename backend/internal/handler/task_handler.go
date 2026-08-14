package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"kanban-api/internal/dto"
	"kanban-api/internal/model"
	"kanban-api/internal/repository"
	"net/http"
	"strconv"
	"strings"
)

type TaskHandler struct {
	repo *repository.SQLiteTaskRepository
}

func NewTaskHandler(repo *repository.SQLiteTaskRepository) *TaskHandler {
	return &TaskHandler{
		repo: repo,
	}
}

func RespondWithJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		return
	}
}


func (h *TaskHandler) TaskByIDHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extrai o ID do final da URL
	idStr := strings.TrimPrefix(r.URL.Path, "/api/tasks/")

	if idStr == "" {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{"error": "ID da tarefa é obrigatório"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		h.getTaskByID(w, idStr)
	case http.MethodPut:
		h.updateTask(w, r, idStr)
	case http.MethodDelete:
		h.deleteTask(w, idStr)
	default:
		RespondWithJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Método não permitido"})
	}
}

func (h *TaskHandler) TasksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodPost:
		h.createTask(w, r)

	case http.MethodGet:
		h.getTasks(w)

	default:
		RespondWithJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"error": "Método não permitido",
		})
	}
}

func (h *TaskHandler) getTasks(w http.ResponseWriter) {
	tasks, err := h.repo.GetAll()
	if err != nil {
		RespondWithJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "Erro ao buscar tarefas",
		})
		return
	}

	RespondWithJSON(w, http.StatusOK, tasks)
}

func (h *TaskHandler) getTaskByID(w http.ResponseWriter, idStr string) {
	id, err := strconv.Atoi(idStr)
	if err != nil {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	task, err := h.repo.GetByID(id)
	if err != nil {
		RespondWithJSON(w, http.StatusInternalServerError, map[string]string{"error": "Erro ao buscar tarefa"})
		return
	}

	// Se não encontrou o registro no banco
	if task == nil {
		RespondWithJSON(w, http.StatusNotFound, map[string]string{"error": "Tarefa não encontrada"})
		return
	}

	RespondWithJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateTaskInput

	// 1. Cria o decoder
	decoder := json.NewDecoder(r.Body)

	// 2. 🔒 Ativa a rejeição estrita de campos que não pertencem ao DTO
	decoder.DisallowUnknownFields()

	// 3. Tenta decodificar
	if err := decoder.Decode(&input); err != nil {
		if strings.Contains(err.Error(), "unknown field") {
			RespondWithJSON(w, http.StatusBadRequest, map[string]any{
				"error":           "O payload contém campos não permitidos",
				"expectedFields": []string{"title", "description"},
			})
			return
		}

		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Formato JSON inválido",
		})
		return
	}

	if strings.TrimSpace(input.Title) == "" {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "O título é obrigatório",
		})
		return
	}

	task := model.Task{
			Title:       input.Title,
			Description: input.Description,
			Status:      model.StatusTodo,
		}

	if err := h.repo.Create(&task); err != nil {
		RespondWithJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "Erro ao criar tarefa",
		})
		return
	}

	RespondWithJSON(w, http.StatusCreated, task)
}


func (h *TaskHandler) updateTask(w http.ResponseWriter, r *http.Request, idStr string) {
	var input dto.UpdateTaskInput

	// 1. Decoder com rejeição estrita de campos desconhecidos (ex: "id", "created_at", etc.)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		if strings.Contains(err.Error(), "unknown field") {
			RespondWithJSON(w, http.StatusBadRequest, map[string]any{
				"error":           "O payload contém campos não permitidos",
				"expectedFields": []string{"title", "description", "status"},
			})
			return
		}

		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Formato JSON inválido",
		})
		return
	}

	if strings.TrimSpace(input.Title) == "" {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "O campo 'title' é obrigatório",
		})
		return
	}

	if !input.Status.IsValid() {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Status inválido. Valores permitidos: 'todo', 'in_progress', 'done'",
		})
		return
	}

	task := model.Task{
		ID:          idStr,
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
	}
	
	if err := h.repo.Update(task); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			RespondWithJSON(w, http.StatusNotFound, map[string]string{
				"error": "Tarefa não encontrada",
			})
			return
		}
		RespondWithJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "Erro ao atualizar tarefa",
		})
		return
	}

	RespondWithJSON(w, http.StatusOK, task)
}


func (h *TaskHandler) deleteTask(w http.ResponseWriter, idStr string) {
	id, err := strconv.Atoi(idStr)
	if err != nil {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "ID inválido, deve ser um número inteiro",
		})
		return
	}

	if err := h.repo.Delete(id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			RespondWithJSON(w, http.StatusNotFound, map[string]string{
				"error": "Tarefa não encontrada",
			})
			return
		}
		RespondWithJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "Erro ao excluir tarefa",
		})
		return
	}

	RespondWithJSON(w, http.StatusOK, map[string]string {
		"message": "Tarefa excluída com sucesso",
	})
}