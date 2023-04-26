package repository

import (
	"app/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
	CreateMovie(movie *models.Movie) error
}
