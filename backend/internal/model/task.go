package model

// Custom status enum type
type TaskStatus string

// TaskStatus enum choices
const (
	StatusTodo       TaskStatus = "todo"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

// IsValid verifies the received status
func (s TaskStatus) IsValid() bool {
	switch s {
	case StatusTodo, StatusInProgress, StatusDone:
		return true
	}
	return false
}

// Task model structure
type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
}