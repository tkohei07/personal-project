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

func TestGetBuildingByID(t *testing.T) {
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
		AddRow(1, "Building 1", "Address 1", "Link 1", true, false, true, time.Now(), time.Now())

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings WHERE id = ?"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	building, err := repo.GetBuildingByID(1)

	assert.NoError(t, err)
	assert.IsType(t, &models.Building{}, building)
}

func TestGetBuildingByIDNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings WHERE id = ?"

	mock.ExpectQuery(query).WithArgs(1).WillReturnError(sql.ErrNoRows)

	_, err = repo.GetBuildingByID(1)

	assert.Error(t, err)
}

func TestGetBuildingByIDDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings WHERE id = ?"

	mock.ExpectQuery(query).WithArgs(1).WillReturnError(sql.ErrConnDone)

	_, err = repo.GetBuildingByID(1)

	assert.Error(t, err)
}

func TestGetBuildingByIDScanError(t *testing.T) {
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

	query := "SELECT id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at FROM buildings WHERE id = ?"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	_, err = repo.GetBuildingByID(1)

	assert.Error(t, err)
}

func TestCreateBuilding(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newBuilding := &models.Building{
		Name:                  "New Building",
		Address:               "Address New",
		Link:                  "Link New",
		IsComputerRoom:        true,
		IsReservableStudyRoom: false,
		IsVendingArea:         true,
	}

	query := `INSERT INTO buildings \(name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newBuilding.Name,
		newBuilding.Address,
		newBuilding.Link,
		newBuilding.IsComputerRoom,
		newBuilding.IsReservableStudyRoom,
		newBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	err = repo.CreateBuilding(newBuilding)

	assert.NoError(t, err)
	assert.Equal(t, 1, newBuilding.ID)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCreateBuildingDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newBuilding := &models.Building{
		Name:                  "New Building",
		Address:               "Address New",
		Link:                  "Link New",
		IsComputerRoom:        true,
		IsReservableStudyRoom: false,
		IsVendingArea:         true,
	}

	query := `INSERT INTO buildings \(name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newBuilding.Name,
		newBuilding.Address,
		newBuilding.Link,
		newBuilding.IsComputerRoom,
		newBuilding.IsReservableStudyRoom,
		newBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnError(sql.ErrConnDone)

	err = repo.CreateBuilding(newBuilding)

	assert.Error(t, err)
	assert.Equal(t, 0, newBuilding.ID)
}

func TestCreateBuildingScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newBuilding := &models.Building{
		Name:                  "New Building",
		Address:               "Address New",
		Link:                  "Link New",
		IsComputerRoom:        true,
		IsReservableStudyRoom: false,
		IsVendingArea:         true,
	}

	query := `INSERT INTO buildings \(name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newBuilding.Name,
		newBuilding.Address,
		newBuilding.Link,
		newBuilding.IsComputerRoom,
		newBuilding.IsReservableStudyRoom,
		newBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("wrong"))

	err = repo.CreateBuilding(newBuilding)

	assert.Error(t, err)
	assert.Equal(t, 0, newBuilding.ID)
}

func TestUpdateBuilding(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	updateBuilding := &models.Building{
		Name:                  "Updated Building",
		Address:               "Updated Address",
		Link:                  "Updated Link",
		IsComputerRoom:        false,
		IsReservableStudyRoom: true,
		IsVendingArea:         false,
	}

	idToUpdate := 1

	query := `UPDATE buildings SET name = \$1, address = \$2, link = \$3, is_computer_room = \$4, is_reservable_study_room = \$5, is_vending_area = \$6, updated_at = \$7 WHERE id = \$8 RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		updateBuilding.Name,
		updateBuilding.Address,
		updateBuilding.Link,
		updateBuilding.IsComputerRoom,
		updateBuilding.IsReservableStudyRoom,
		updateBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		idToUpdate,
	).WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.UpdateBuilding(idToUpdate, updateBuilding)

	assert.NoError(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestUpdateBuildingIDNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	updateBuilding := &models.Building{
		Name:                  "Updated Building",
		Address:               "Updated Address",
		Link:                  "Updated Link",
		IsComputerRoom:        false,
		IsReservableStudyRoom: true,
		IsVendingArea:         false,
	}

	idToUpdate := 1

	query := `UPDATE buildings SET name = \$1, address = \$2, link = \$3, is_computer_room = \$4, is_reservable_study_room = \$5, is_vending_area = \$6, updated_at = \$7 WHERE id = \$8 RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		updateBuilding.Name,
		updateBuilding.Address,
		updateBuilding.Link,
		updateBuilding.IsComputerRoom,
		updateBuilding.IsReservableStudyRoom,
		updateBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		idToUpdate,
	).WillReturnError(sql.ErrNoRows)

	err = repo.UpdateBuilding(idToUpdate, updateBuilding)

	assert.Error(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestUpdateBuildingDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	updateBuilding := &models.Building{
		Name:                  "Updated Building",
		Address:               "Updated Address",
		Link:                  "Updated Link",
		IsComputerRoom:        false,
		IsReservableStudyRoom: true,
		IsVendingArea:         false,
	}

	idToUpdate := 1

	query := `UPDATE buildings SET name = \$1, address = \$2, link = \$3, is_computer_room = \$4, is_reservable_study_room = \$5, is_vending_area = \$6, updated_at = \$7 WHERE id = \$8 RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		updateBuilding.Name,
		updateBuilding.Address,
		updateBuilding.Link,
		updateBuilding.IsComputerRoom,
		updateBuilding.IsReservableStudyRoom,
		updateBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		idToUpdate,
	).WillReturnError(sql.ErrConnDone)

	err = repo.UpdateBuilding(idToUpdate, updateBuilding)

	assert.Error(t, err)
}

func TestUpdateBuildingExecError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	updateBuilding := &models.Building{
		Name:                  "Updated Building",
		Address:               "Updated Address",
		Link:                  "Updated Link",
		IsComputerRoom:        false,
		IsReservableStudyRoom: true,
		IsVendingArea:         false,
	}

	idToUpdate := 1

	query := `UPDATE buildings SET name = \$1, address = \$2, link = \$3, is_computer_room = \$4, is_reservable_study_room = \$5, is_vending_area = \$6, updated_at = \$7 WHERE id = \$8 RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		updateBuilding.Name,
		updateBuilding.Address,
		updateBuilding.Link,
		updateBuilding.IsComputerRoom,
		updateBuilding.IsReservableStudyRoom,
		updateBuilding.IsVendingArea,
		sqlmock.AnyArg(),
		idToUpdate,
	).WillReturnError(fmt.Errorf("update query failed"))

	err = repo.UpdateBuilding(idToUpdate, updateBuilding)

	assert.Error(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDeleteBuilding(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `DELETE FROM buildings WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		buildingID,
	).WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteBuilding(buildingID)

	assert.NoError(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDeleteBuildingIDNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `DELETE FROM buildings WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		buildingID,
	).WillReturnError(sql.ErrNoRows)

	err = repo.DeleteBuilding(buildingID)

	assert.Error(t, err)
}

func TestDeleteBuildingDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `DELETE FROM buildings WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		buildingID,
	).WillReturnError(sql.ErrConnDone)

	err = repo.DeleteBuilding(buildingID)

	assert.Error(t, err)
}

func TestDeleteBuildingExecError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	buildingID := 1

	query := `DELETE FROM buildings WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		buildingID,
	).WillReturnError(fmt.Errorf("delete query failed"))

	err = repo.DeleteBuilding(buildingID)

	assert.Error(t, err)
}
