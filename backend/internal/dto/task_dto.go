package dto

import "kanban-api/internal/model"

type CreateTaskInput struct {
	Title       string       `json:"title"`
	Description string       `json:"description"`
}

type UpdateTaskInput struct {
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Status      model.TaskStatus `json:"status"`
}