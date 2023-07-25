package dbrepo

import (
	"backend/internal/models"
	"database/sql"

	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetFavoritesByUserID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	userID := 1
	now := time.Now()

	query := `SELECT f.id, f.user_id, f.building_id, b.name, f.created_at, f.updated_at FROM user_favorites f JOIN buildings b ON f.building_id = b.id WHERE f.user_id = \$1`

	rows := sqlmock.
		NewRows([]string{"id", "user_id", "building_id", "name", "created_at", "updated_at"}).
		AddRow(1, userID, 1, "Building 1", now, now).
		AddRow(2, userID, 2, "Building 2", now, now)

	mock.ExpectQuery(query).WithArgs(userID).WillReturnRows(rows)

	favorites, err := repo.GetFavoritesByUserID(userID)

	assert.NoError(t, err)
	assert.NotNil(t, favorites)
	assert.Equal(t, 2, len(favorites))
}

func TestGetFavoritesByUserIDDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	userID := 1

	query := `SELECT f.id, f.user_id, f.building_id, b.name, f.created_at, f.updated_at FROM user_favorites f JOIN buildings b ON f.building_id = b.id WHERE f.user_id = \$1`

	mock.ExpectQuery(query).WithArgs(userID).WillReturnError(sql.ErrConnDone)

	favorites, err := repo.GetFavoritesByUserID(userID)

	assert.Error(t, err)
	assert.Nil(t, favorites)
}

func TestGetFavoritesByUserIDNoRows(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	userID := 1

	query := `SELECT f.id, f.user_id, f.building_id, b.name, f.created_at, f.updated_at FROM user_favorites f JOIN buildings b ON f.building_id = b.id WHERE f.user_id = \$1`

	mock.ExpectQuery(query).WithArgs(userID).WillReturnRows(sqlmock.NewRows([]string{"id", "user_id", "building_id", "name", "created_at", "updated_at"}))

	favorites, err := repo.GetFavoritesByUserID(userID)

	assert.NoError(t, err)
	assert.Nil(t, favorites)
	assert.Equal(t, 0, len(favorites))
}

func TestCreateFavorite(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newFavorite := &models.Favorite{
		UserID:     1,
		BuildingID: 2,
	}

	query := `INSERT INTO user_favorites \(user_id, building_id\) VALUES \(\$1, \$2\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newFavorite.UserID,
		newFavorite.BuildingID,
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	err = repo.CreateFavorite(newFavorite)

	assert.NoError(t, err)
	assert.Equal(t, 1, newFavorite.ID)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCreateFavoriteDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newFavorite := &models.Favorite{
		UserID:     1,
		BuildingID: 2,
	}

	query := `INSERT INTO user_favorites \(user_id, building_id\) VALUES \(\$1, \$2\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newFavorite.UserID,
		newFavorite.BuildingID,
	).WillReturnError(sql.ErrConnDone)

	err = repo.CreateFavorite(newFavorite)

	assert.Error(t, err)
	assert.Equal(t, 0, newFavorite.ID)
}

func TestCreateFavoriteScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newFavorite := &models.Favorite{
		UserID:     1,
		BuildingID: 2,
	}

	query := `INSERT INTO user_favorites \(user_id, building_id\) VALUES \(\$1, \$2\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newFavorite.UserID,
		newFavorite.BuildingID,
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("wrong"))

	err = repo.CreateFavorite(newFavorite)

	assert.Error(t, err)
	assert.Equal(t, 0, newFavorite.ID)
}

func TestDeleteFavorite(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	favorite := &models.Favorite{
		UserID:     1,
		BuildingID: 2,
	}

	query := `DELETE FROM user_favorites WHERE user_id = \$1 AND building_id = \$2`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		favorite.UserID,
		favorite.BuildingID,
	).WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteFavorite(favorite)

	assert.NoError(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDeleteFavoriteDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	favorite := &models.Favorite{
		UserID:     1,
		BuildingID: 2,
	}

	query := `DELETE FROM user_favorites WHERE user_id = \$1 AND building_id = \$2`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(
		favorite.UserID,
		favorite.BuildingID,
	).WillReturnError(sql.ErrConnDone)

	err = repo.DeleteFavorite(favorite)

	assert.Error(t, err)
}
