package repository

import "kanban-api/internal/model"

// Allowed operation for the TaskRepository
type TaskRepository interface {
	GetAll() ([]model.Task, error)
	Create(task *model.Task) error
	Update(task model.Task) error
	Delete(id int) error
}