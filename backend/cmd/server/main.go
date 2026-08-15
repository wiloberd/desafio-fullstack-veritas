package main

import (
	"kanban-api/configs"
	"kanban-api/internal/handler"
	"kanban-api/internal/repository"
	"kanban-api/internal/server"
	"log"
)

func main() {
	cfg := configs.LoadConfig()

	db, repo, err := repository.InitDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("Erro na infraestrutura: %v", err)
	}
	defer db.Close()

	taskHandler := handler.NewTaskHandler(repo)

	srv := server.NewServer(cfg.Host, cfg.Port, cfg.CORSAllowedOrigins)

	if err := srv.Start(taskHandler); err != nil {
		log.Fatalf("Erro ao rodar servidor: %v", err)
	}
}