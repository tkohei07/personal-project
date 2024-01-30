package config

import (
	"log"
	"os"
)

type Config struct {
	DSN     string
	InitSQL string
}

func LoadConfig(env string) Config {
	var cfg Config
	switch env {
	case "production":
		cfg.DSN = os.Getenv("PROD_DSN")
		cfg.InitSQL = "init_prod.sql"
	case "development":
		cfg.DSN = os.Getenv("DEV_DSN")
		cfg.InitSQL = "init_dev.sql"
	default:
		log.Fatalf("Invalid environment: %s", env)
	}
	return cfg
}
