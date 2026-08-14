package repository

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

func InitDB(dbPath string) (*sql.DB, *SQLiteTaskRepository, error) {
	dir := filepath.Dir(dbPath)

	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, nil, err
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, nil, err
	}

	repo, err := NewSQLiteTaskRepository(db)
	if err != nil {
		db.Close()
		return nil, nil, err
	}

	return db, repo, nil
}