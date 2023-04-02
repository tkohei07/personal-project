package dbrepo

import (
	"app/internal/models"
	"context"
	"database/sql"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	// query := `
	// 	select
	// 		id, title, release_date, runtime,
	// 		mpaa_rating, description, coalesce(image, ''),
	// 		created_at, updated_at
	// 	from
	// 		movies
	// 	order by
	// 		title
	// `
	query := `
		select
			id, title, release_date, runtime,
			mpaa_rating, description, created_at, updated_at
		from
			movies
		order by
			title
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			// &movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) CreateMovie(movie *models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	// query := `
	// 	insert into movies
	// 		(title, release_date, runtime, mpaa_rating, description, image, created_at, updated_at)
	// 	values
	// 		($1, $2, $3, $4, $5, $6, $7, $8)
	// 	returning id
	// `
	query := `
		insert into movies
			(title, release_date, runtime, mpaa_rating, description, created_at, updated_at)
		values
			($1, $2, $3, $4, $5, $6, $7)
		returning id
	`

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int
	
	err = stmt.QueryRowContext(ctx,
		movie.Title,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Description,
		// movie.Image,
		time.Now(),
		time.Now(),
	).Scan(&id)
	if err != nil {
		return err
	}

	movie.ID = id

	return nil
}

