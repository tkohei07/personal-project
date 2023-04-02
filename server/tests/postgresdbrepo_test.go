package tests

import (
    "app/internal/models"
    "app/internal/repository/dbrepo"
    // "context"
    // "database/sql"
    "fmt"
    "testing"
    "time"

    "github.com/DATA-DOG/go-sqlmock"
    "github.com/stretchr/testify/assert"
)

func TestAllMovies(t *testing.T) {
    db, mock, err := sqlmock.New()
    if err != nil {
        t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
    }
    defer db.Close()

    repo := &dbrepo.PostgresDBRepo{
        DB: db,
    }

    columns := []string{"id", "title", "release_date", "runtime", "mpaa_rating", "description", "created_at", "updated_at"}

    mockRows := sqlmock.NewRows(columns).
        AddRow(1, "Movie 1", time.Now(), 120, "PG", "A great movie", time.Now(), time.Now()).
        AddRow(2, "Movie 2", time.Now(), 90, "PG-13", "An even better movie", time.Now(), time.Now())

    query := "select id, title, release_date, runtime, mpaa_rating, description, created_at, updated_at from movies order by title"

    mock.ExpectQuery(query).WillReturnRows(mockRows)

    // timeout := time.Second * 3

    movies, err := repo.AllMovies()

    assert.NoError(t, err)
    assert.Len(t, movies, 2)

    for _, movie := range movies {
        assert.IsType(t, &models.Movie{}, movie)
    }

    if err := mock.ExpectationsWereMet(); err != nil {
        fmt.Println(err)
        t.Errorf("there were unfulfilled expectations: %s", err)
    }
}
