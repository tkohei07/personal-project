package dbrepo

import (
	"backend/internal/models"
	"errors"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetBuildingHoursBuildingByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `SELECT id, building_id, day_of_week, start_date, end_date, open_time, close_time FROM building_hours WHERE building_id = \$1 ORDER BY start_date, day_of_week ASC`

	rows := sqlmock.NewRows([]string{"id", "building_id", "day_of_week", "start_date", "end_date", "open_time", "close_time"}).
		AddRow(1, 1, 1, time.Now(), time.Now(), "08:00:00", "18:00:00").
		AddRow(2, 1, 2, time.Now(), time.Now(), "08:00:00", "18:00:00")

	mock.ExpectQuery(query).WithArgs(buildingID).WillReturnRows(rows)

	buildingHours, err := repo.GetBuildingHoursBuildingByID(buildingID)

	assert.NoError(t, err)
	assert.NotNil(t, buildingHours)
	assert.Len(t, buildingHours, 2)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetBuildingHoursBuildingByIDDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	id := 1
	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id, building_id, day_of_week, start_date, end_date, open_time, close_time FROM building_hours WHERE building_id = $1 ORDER BY start_date, day_of_week ASC`)).
		WithArgs(id).
		WillReturnError(errors.New("DB Error"))

	repo := PostgresDBRepo{
		DB: db,
	}

	_, err = repo.GetBuildingHoursBuildingByID(id)
	assert.Error(t, err)
	assert.Equal(t, "DB Error", err.Error())
}

func TestGetBuildingHoursBuildingByIDScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `SELECT id, building_id, day_of_week, start_date, end_date, open_time, close_time FROM building_hours WHERE building_id = \$1 ORDER BY start_date, day_of_week ASC`

	rows := sqlmock.NewRows([]string{"id", "building_id", "day_of_week", "start_date", "end_date", "open_time", "close_time"}).
		AddRow(1, 1, "Monday", "invalid", "invalid", "08:00:00", "18:00:00")

	mock.ExpectQuery(query).WithArgs(buildingID).WillReturnRows(rows)

	_, err = repo.GetBuildingHoursBuildingByID(buildingID)

	assert.Error(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCreateBuildingHours(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  5,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		OpenTime:   time.Now(),
		CloseTime:  time.Now().Add(time.Hour),
	}

	// Mock for CheckOverlap
	mock.ExpectPrepare("SELECT 1 FROM building_hours WHERE building_id = \\$1 AND day_of_week = \\$2 AND \\(start_date <= \\$3 AND end_date >= \\$4\\)")
	mock.ExpectQuery("SELECT 1 FROM building_hours WHERE building_id = \\$1 AND day_of_week = \\$2 AND \\(start_date <= \\$3 AND end_date >= \\$4\\)").
		WithArgs(
			buildingHour.BuildingID,
			buildingHour.DayOfWeek,
			buildingHour.EndDate,
			buildingHour.StartDate,
		).
		WillReturnRows(sqlmock.NewRows([]string{}))

	// Mock for CreateBuildingHours
	mock.ExpectPrepare("^INSERT INTO building_hours \\(building_id, day_of_week, start_date, end_date, open_time, close_time\\) VALUES \\(\\$1, \\$2, \\$3, \\$4, \\$5, \\$6\\) RETURNING id$")
	mock.ExpectQuery("^INSERT INTO building_hours \\(building_id, day_of_week, start_date, end_date, open_time, close_time\\) VALUES \\(\\$1, \\$2, \\$3, \\$4, \\$5, \\$6\\) RETURNING id$").
		WithArgs(
			buildingHour.BuildingID,
			buildingHour.DayOfWeek,
			buildingHour.StartDate,
			buildingHour.EndDate,
			buildingHour.OpenTime,
			buildingHour.CloseTime,
		).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	repo := &PostgresDBRepo{
		DB: db,
	}

	err = repo.CreateBuildingHours(buildingHour)
	assert.NoError(t, err)
	assert.Equal(t, 1, buildingHour.ID)
}

func TestCreateBuildingHoursDBError(t *testing.T) {
	// Mock the database.
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to fail with an error.
	mock.ExpectPrepare("^INSERT INTO building_hours").WillReturnError(errors.New("database error"))

	// Run the function and check that it returns an error.
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		OpenTime:   time.Now(),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CreateBuildingHours(buildingHour)
	assert.Error(t, err)
}

func TestCreateBuildingHoursScanError(t *testing.T) {
	// Mock the database.
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^INSERT INTO building_hours")

	// Expect Query to be called and return a row that will cause a scan error.
	mock.ExpectQuery("^INSERT INTO building_hours").
		WithArgs(
			sqlmock.AnyArg(),
			sqlmock.AnyArg(),
			sqlmock.AnyArg(),
			sqlmock.AnyArg(),
			sqlmock.AnyArg(),
			sqlmock.AnyArg(),
		).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("not an integer"))

	// Run the function and check that it returns a scan error.
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		OpenTime:   time.Now(),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CreateBuildingHours(buildingHour)
	assert.Error(t, err)
}

func TestCheckOverlap(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^SELECT 1 FROM building_hours WHERE building_id")

	// Expect Query to be called and return no rows (i.e., no overlap).
	mock.ExpectQuery("^SELECT 1 FROM building_hours WHERE building_id").
		WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"1"}))

	// Run the function and check that it returns nil (i.e., no overlap).
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		OpenTime:   time.Now(),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CheckOverlap(buildingHour)
	assert.NoError(t, err)
}

func TestCheckOverlap_Duplication(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^SELECT 1 FROM building_hours WHERE building_id")

	// Expect Query to be called and return a row (i.e., an overlap).
	mock.ExpectQuery("^SELECT 1 FROM building_hours WHERE building_id").
		WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"1"}).AddRow(1))

	// Run the function and check that it returns an error (i.e., an overlap).
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CheckOverlap(buildingHour)
	assert.Error(t, err)
}

func TestCheckOverlapDBError(t *testing.T) {
	// Mock the database.
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to fail with an error.
	mock.ExpectPrepare("^SELECT 1 FROM building_hours WHERE building_id").WillReturnError(errors.New("database error"))

	// Run the function and check that it returns an error.
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CheckOverlap(buildingHour)
	assert.Error(t, err)
}

func TestCheckOverlapScanError(t *testing.T) {
	// Mock the database.
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^SELECT 1 FROM building_hours WHERE building_id")

	// Expect Query to be called and return a row that will cause a scan error.
	mock.ExpectQuery("^SELECT 1 FROM building_hours WHERE building_id").
		WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"1"}).AddRow("not an integer"))

	// Run the function and check that it returns a scan error.
	buildingHour := &models.BuildingHour{
		BuildingID: 1,
		DayOfWeek:  1,
		StartDate:  time.Now(),
		EndDate:    time.Now().AddDate(0, 0, 1),
		CloseTime:  time.Now().Add(time.Hour),
	}
	err = dbRepo.CheckOverlap(buildingHour)
	assert.Error(t, err)
}

func TestDeleteBuildingHours(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Define the id to be deleted.
	hourID := 1

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^DELETE FROM building_hours WHERE id")

	// Expect Exec to be called and return Result indicating 1 row was affected.
	mock.ExpectExec("^DELETE FROM building_hours WHERE id").
		WithArgs(hourID).
		WillReturnResult(sqlmock.NewResult(0, 1))

	// Run the function and check that it returns nil (i.e., successful delete).
	err = dbRepo.DeleteBuildingHours(hourID)
	assert.NoError(t, err)
}

func TestDeleteBuildingHours_DBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// Initialize the mock repository.
	dbRepo := PostgresDBRepo{
		DB: db,
	}

	// Define the id to be deleted.
	hourID := 1

	// Expect Prepare to be called with the correct SQL.
	mock.ExpectPrepare("^DELETE FROM building_hours WHERE id")

	// Expect Exec to be called and return a DB error.
	mock.ExpectExec("^DELETE FROM building_hours WHERE id").
		WithArgs(hourID).
		WillReturnError(errors.New("some db error"))

	// Run the function and check that it returns the DB error.
	err = dbRepo.DeleteBuildingHours(hourID)
	assert.EqualError(t, err, "some db error")
}
