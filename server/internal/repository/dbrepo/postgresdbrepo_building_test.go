package dbrepo

import (
	"backend/internal/models"
	"database/sql"

	"fmt"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetAllBuildings(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "name", "address", "link", "is_computer_room", "is_reservable_study_room", "is_vending_area", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow(1, "Building 1", "Address 1", "Link 1", true, false, true, time.Now(), time.Now()).
		AddRow(2, "Building 2", "Address 2", "Link 2", false, true, false, time.Now(), time.Now())

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings ORDER BY name"

	mock.ExpectQuery(query).WillReturnRows(mockRows)

	buildings, err := repo.GetAllBuildings()

	assert.NoError(t, err)
	assert.Len(t, buildings, 2)

	for _, building := range buildings {
		assert.IsType(t, &models.Building{}, building)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		fmt.Println(err)
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetAllBuildingsEmptyDB(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings ORDER BY name"

	mock.ExpectQuery(query).WillReturnRows(sqlmock.NewRows(nil))

	buildings, err := repo.GetAllBuildings()

	assert.NoError(t, err)
	assert.Empty(t, buildings)
}

func TestGetAllBuildingsDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings ORDER BY name"

	mock.ExpectQuery(query).WillReturnError(sql.ErrConnDone)

	_, err = repo.GetAllBuildings()

	assert.Error(t, err)
}

func TestGetAllBuildingsScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "name", "address", "link", "is_computer_room", "is_reservable_study_room", "is_vending_area", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow("wrong", "Building 1", "Address 1", "Link 1", true, false, true, time.Now(), time.Now()) // "wrong" can't be scanned into ID which should be an integer

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings ORDER BY name"

	mock.ExpectQuery(query).WillReturnRows(mockRows)

	_, err = repo.GetAllBuildings()

	assert.Error(t, err)
}
