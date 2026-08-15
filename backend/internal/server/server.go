package server

import (
	"fmt"
	"kanban-api/internal/handler"
	"kanban-api/internal/middleware"
	"net"
	"net/http"
	"time"
)

type Server struct {
	host           string
	port 		   string
	allowedOrigins string
}

func NewServer(host string, port string, allowedOrigins string) *Server {
	return &Server{
		host:           host,
		port: port,
		allowedOrigins: allowedOrigins,
	}
}

func (s *Server) setupRoutes(taskHandler *handler.TaskHandler) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/tasks", taskHandler.TasksHandler)

	mux.HandleFunc("/api/tasks/", taskHandler.TaskByIDHandler)

	// Aplica os cabeçalhos globais ao roteador
	return middleware.DefaultHeaders(s.allowedOrigins)(mux)
}

func (s *Server) Start(taskHandler *handler.TaskHandler) error {
	addr := net.JoinHostPort(s.host, s.port)
	
	srv := &http.Server{
		Addr:         addr,
		Handler:      s.setupRoutes(taskHandler),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Printf("Servidor Go rodando em http://%s\n", addr)

	return srv.ListenAndServe()
}