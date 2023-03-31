package main

import (
    "app/internal/models"

    "github.com/gin-gonic/gin"
)

func (app *application) registerRoutes(r *gin.Engine) {
    // enable CORS
    // may be better to do this in another file
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    r.GET("/", app.Home)

    r.GET("/movies", app.AllMovies)

    r.POST("/movies", app.CreateMovie)
}

// may be better to do these things in another file 
// (handlers.go)
func (app *application) Home(c *gin.Context) {
    var payload = struct {
        Status  string `json:"status"`
        Message string `json:"message"`
        Version string `json:"version"`
    }{
        Status:  "active",
        Message: "Go Movies up and running",
        Version: "1.0.0",
    }

    c.JSON(200, payload)
}

func (app *application) AllMovies(c *gin.Context) {
    movies, err := app.DB.AllMovies()
    if err != nil {
        c.AbortWithError(500, err)
        return
    }

    c.JSON(200, movies)
}

func (app *application) CreateMovie(c *gin.Context) {
    var movie models.Movie
    if err := c.BindJSON(&movie); err != nil {
        c.AbortWithError(400, err)
        return
    }

    if err := app.DB.CreateMovie(&movie); err != nil {
        c.AbortWithError(500, err)
        return
    }

    c.JSON(201, movie)
}

