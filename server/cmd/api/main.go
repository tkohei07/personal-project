package main

import (
    "app/internal/repository"
    "app/internal/repository/dbrepo"
    "flag"
    "fmt"
    "log"
    
    "github.com/gin-gonic/gin"
)

const port = 8080

type application struct {
    DSN    string
    Domain string
    DB     repository.DatabaseRepo
}

func main() {
    // set application config
    var app application

    // read from command line
    flag.StringVar(&app.DSN, "dsn", "host=db port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "Postgres connection string")
    flag.Parse()

    // connect to the database
    conn, err := app.connectToDB()
    if err != nil {
        log.Fatal(err)
    }
    app.DB = &dbrepo.PostgresDBRepo{DB: conn}
    defer app.DB.Connection().Close()

    app.Domain = "example.com"

    log.Println("Starting application on port", port)

    // create a Gin router instance
    router := gin.Default()

    // register routes
    app.registerRoutes(router)

    // start a web server
    err = router.Run(fmt.Sprintf(":%d", port))
    if err != nil {
        log.Fatal(err)
    }
}
