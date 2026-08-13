package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port   string
	DBPath string
	Env    string
}

func LoadConfig() *Config {
	// Tenta carregar o .env (se existir)
	if err := godotenv.Load(); err != nil {
		log.Println("Nenhum arquivo .env encontrado, utilizando variáveis de ambiente nativas.")
	}

	return &Config{
		Port:    os.Getenv("PORT"),
		DBPath:  os.Getenv("DB_PATH"),
		Env:     os.Getenv("ENV"),
	}
}