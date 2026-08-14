package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
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

// setCORS configura os headers padronizados para todas as requisições
func setCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func (h *TaskHandler) TaskByIDHandler(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
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
	setCORS(w)
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
	var task model.Task

	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Payload inválido",
		})
		return
	}

	if task.Title == "" {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "O título é obrigatório",
		})
		return
	}

	if task.Status == "" {
		task.Status = model.StatusTodo
	}

	if !task.Status.IsValid() {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Status inválido",
		})
		return
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
	var task model.Task

	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Payload inválido",
		})
		return
	}

	// Garante que o ID da URL sobrescreve qualquer ID vindo no corpo da requisição
	task.ID = idStr

	if task.Title == "" {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "O título é obrigatório",
		})
		return
	}

	if !task.Status.IsValid() {
		RespondWithJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Status inválido",
		})
		return
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

	RespondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Tarefa excluída com sucesso",
	})
}