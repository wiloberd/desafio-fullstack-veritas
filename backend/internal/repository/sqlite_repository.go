package repository

import (
	"database/sql"
	"strconv"

	"kanban-api/internal/model"
)

type SQLiteTaskRepository struct {
	db *sql.DB
}

// Creates a new repository instance and ensures the tasks table exists
func NewSQLiteTaskRepository(db *sql.DB) (*SQLiteTaskRepository, error) {
	repo := &SQLiteTaskRepository{db: db}

	query := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		status TEXT NOT NULL
	);`
	_, err := db.Exec(query)
	if err != nil {
		return nil, err
	}

	return repo, nil
}

// Create a new task into the database
func (r *SQLiteTaskRepository) Create(task *model.Task) error {
	stmt, err := r.db.Prepare("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(task.Title, task.Description, task.Status)
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err == nil {
		task.ID = strconv.Itoa(int(id))
	}
	return nil
}

// Read all tasks from the database
func (r *SQLiteTaskRepository) GetAll() ([]model.Task, error) {
	rows, err := r.db.Query("SELECT id, title, description, status FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var t model.Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}

	// Check for errors during row iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

// Update an existing task by its ID
func (r *SQLiteTaskRepository) Update(task model.Task) error {
	query := `
		UPDATE tasks 
		SET title = ?, description = ?, status = ? 
		WHERE id = ?
	`

	result, err := r.db.Exec(query, task.Title, task.Description, task.Status, task.ID)
	if err != nil {
		return err
	}

	// Ensure at least one row was affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows // Return error if task ID was not found
	}

	return nil
}

// Delete removes a task from the database by its ID
func (r *SQLiteTaskRepository) Delete(id int) error {
	query := `DELETE FROM tasks WHERE id = ?`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	// Ensure at least one row was affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows // Return error if task ID was not found
	}

	return nil
}