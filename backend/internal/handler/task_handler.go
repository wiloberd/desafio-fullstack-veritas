package handler

import (
	"encoding/json"
	"kanban-api/internal/model"
	"net/http"
	"strconv"
	"sync"
)

var (
	tasks  = []model.Task{}
	nextID = 1
	mu     sync.Mutex
)

func RespondWithJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func TasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		mu.Lock()
		defer mu.Unlock()
		RespondWithJSON(w, http.StatusOK, tasks)

	case http.MethodPost:
		var newTask model.Task
		if err := json.NewDecoder(r.Body).Decode(&newTask); err != nil {
			RespondWithJSON(w, http.StatusBadRequest, map[string]string{"error": "Payload inválido"})
			return
		}

		if newTask.Title == "" {
			RespondWithJSON(w, http.StatusBadRequest, map[string]string{"error": "O título é obrigatório"})
			return
		}

		if newTask.Status == "" {
			newTask.Status = model.StatusTodo
		}

		if !newTask.Status.IsValid() {
			RespondWithJSON(w, http.StatusBadRequest, map[string]string{"error": "Status inválido"})
			return
		}

		mu.Lock()
		newTask.ID = strconv.Itoa(nextID)
		nextID++
		tasks = append(tasks, newTask)
		mu.Unlock()

		RespondWithJSON(w, http.StatusCreated, newTask)

	default:
		RespondWithJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Método não permitido"})
	}
}