package configs

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Host   string
	Port   string
	DBPath string
	Env    string
	CORSAllowedOrigins string
}

func LoadConfig() *Config {
	// Tenta carregar o .env (se existir)
	if err := godotenv.Load(); err != nil {
		log.Println("Nenhum arquivo .env encontrado, utilizando variáveis de ambiente nativas.")
	}

	return &Config{
		Host:	 os.Getenv("HOST"),
		Port:    strings.TrimPrefix(os.Getenv("PORT"), ":"),
		DBPath:  os.Getenv("DB_PATH"),
		Env:     os.Getenv("ENV"),
		CORSAllowedOrigins: os.Getenv("CORS_ALLOWED_ORIGINS"),
	}
}