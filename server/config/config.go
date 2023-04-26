package config

import (
	"log"
	"os"
)

type Config struct {
	DSN string
}

func LoadConfig(env string) Config {
	var cfg Config
	switch env {
	case "production":
		cfg.DSN = os.Getenv("PROD_DSN")
	case "development":
		cfg.DSN = os.Getenv("DEV_DSN")
	default:
		log.Fatalf("Invalid environment: %s", env)
	}
	return cfg
}
