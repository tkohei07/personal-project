package dbrepo

import (
	"database/sql"

	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetUserByUsernameNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := &PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, username, password FROM users WHERE username = $1"

	mock.ExpectQuery(query).WithArgs("User1").WillReturnError(sql.ErrNoRows)

	_, err = repo.GetUserByUsername("User1")

	assert.Error(t, err)
}

func TestGetUserByUsernameDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := &PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, username, password FROM users WHERE username = $1"

	mock.ExpectQuery(query).WithArgs("User1").WillReturnError(sql.ErrConnDone)

	_, err = repo.GetUserByUsername("User1")

	assert.Error(t, err)
}

func TestGetUserByUsernameScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := &PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "username", "password"}

	// "wrong" can't be scanned into ID which should be an integer
	mockRows := sqlmock.NewRows(columns).AddRow("wrong", "User1", "Password1")

	query := "SELECT id, username, password FROM users WHERE username = $1"

	mock.ExpectQuery(query).WithArgs("User1").WillReturnRows(mockRows)

	_, err = repo.GetUserByUsername("User1")

	assert.Error(t, err)
}
