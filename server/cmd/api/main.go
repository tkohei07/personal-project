package main

import (
	"backend/config"

	"backend/internal/repository"
	"backend/internal/repository/dbrepo"

	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

const port = 8080

type application struct {
	DSN    string
	Config config.Config
	DB     repository.DatabaseRepo
}

func main() {

	var app application

	env := os.Getenv("APP_ENV")
	app.Config = config.LoadConfig(env)

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()
	log.Println("Starting application on port", port)

	// create and register a Gin router instance
	router := gin.Default()
	router.Use(CORS())
	app.registerRoutes(router)

	// start a web server
	err = router.Run(fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatal(err)
	}
}
