package dbrepo

import (
	"backend/internal/models"
	"database/sql"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetReviewsByBuildingID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "building_id", "user_id", "username", "rating", "comment", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow(1, 1, 1, "User1", 4, "Great building", time.Now(), time.Now()).
		AddRow(2, 1, 2, "User2", 3, "Good building", time.Now(), time.Now())

	query := "SELECT r.id, r.building_id, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN users u ON r.user_id = u.id WHERE r.building_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	reviews, err := repo.GetReviewsByBuildingID(1)

	assert.NoError(t, err)
	assert.Len(t, reviews, 2)

	for _, review := range reviews {
		assert.IsType(t, &models.Review{}, review)
	}
}

func TestGetReviewsByBuildingIDNoReviews(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT r.id, r.building_id, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN users u ON r.user_id = u.id WHERE r.building_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(sqlmock.NewRows(nil))

	reviews, err := repo.GetReviewsByBuildingID(1)

	assert.NoError(t, err)
	assert.Empty(t, reviews)
}

func TestGetReviewsByBuildingIDDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT r.id, r.building_id, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN users u ON r.user_id = u.id WHERE r.building_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnError(sql.ErrConnDone)

	_, err = repo.GetReviewsByBuildingID(1)

	assert.Error(t, err)
}

func TestGetReviewsByBuildingIDScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "building_id", "user_id", "username", "rating", "comment", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow("wrong", 1, 1, "User1", 4, "Great building", time.Now(), time.Now()) // "wrong" can't be scanned into ID which should be an integer

	query := "SELECT r.id, r.building_id, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN users u ON r.user_id = u.id WHERE r.building_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	_, err = repo.GetReviewsByBuildingID(1)

	assert.Error(t, err)
}

func TestGetReviewsByUserID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "building_id", "name", "user_id", "username", "rating", "comment", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow(1, 1, "Building 1", 1, "User 1", 5, "Great!", time.Now(), time.Now()).
		AddRow(2, 2, "Building 2", 1, "User 1", 4, "Good", time.Now(), time.Now())

	query := "SELECT r.id, r.building_id, b.name, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN buildings b ON r.building_id = b.id INNER JOIN users u ON r.user_id = u.id WHERE r.user_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	reviews, err := repo.GetReviewsByUserID(1)

	assert.NoError(t, err)
	assert.Len(t, reviews, 2)

	for _, review := range reviews {
		assert.IsType(t, &models.Review{}, review)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetReviewsByUserIDDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	query := "SELECT r.id, r.building_id, b.name, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN buildings b ON r.building_id = b.id INNER JOIN users u ON r.user_id = u.id WHERE r.user_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnError(sql.ErrConnDone)

	_, err = repo.GetReviewsByUserID(1)

	assert.Error(t, err)
}

func TestGetReviewsByUserIDScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	columns := []string{"id", "building_id", "name", "user_id", "username", "rating", "comment", "created_at", "updated_at"}

	mockRows := sqlmock.NewRows(columns).
		AddRow("wrong", 1, "Building 1", 1, "User 1", 5, "Great!", time.Now(), time.Now()) // "wrong" can't be scanned into ID which should be an integer

	query := "SELECT r.id, r.building_id, b.name, r.user_id, u.username, r.rating, r.comment, r.created_at, r.updated_at FROM reviews r INNER JOIN buildings b ON r.building_id = b.id INNER JOIN users u ON r.user_id = u.id WHERE r.user_id = \\$1 ORDER BY r.created_at DESC"

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(mockRows)

	_, err = repo.GetReviewsByUserID(1)

	assert.Error(t, err)
}

func TestCreateReview(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newReview := &models.Review{
		BuildingID: "1",
		UserID:     1,
		Rating:     5,
		Comment:    "Great building!",
	}

	query := `INSERT INTO reviews \(building_id, user_id, rating, comment, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newReview.BuildingID,
		newReview.UserID,
		newReview.Rating,
		newReview.Comment,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	err = repo.CreateReview(newReview)

	assert.NoError(t, err)
	assert.Equal(t, 1, newReview.ID)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCreateReviewDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newReview := &models.Review{
		BuildingID: "1",
		UserID:     1,
		Rating:     5,
		Comment:    "Great building!",
	}

	query := `INSERT INTO reviews \(building_id, user_id, rating, comment, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newReview.BuildingID,
		newReview.UserID,
		newReview.Rating,
		newReview.Comment,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnError(sql.ErrConnDone)

	err = repo.CreateReview(newReview)

	assert.Error(t, err)
	assert.Equal(t, 0, newReview.ID)
}

func TestCreateReviewScanError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	newReview := &models.Review{
		BuildingID: "1",
		UserID:     1,
		Rating:     5,
		Comment:    "Great building!",
	}

	query := `INSERT INTO reviews \(building_id, user_id, rating, comment, created_at, updated_at\) VALUES \(\$1, \$2, \$3, \$4, \$5, \$6\) RETURNING id`

	prep := mock.ExpectPrepare(query)
	prep.ExpectQuery().WithArgs(
		newReview.BuildingID,
		newReview.UserID,
		newReview.Rating,
		newReview.Comment,
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("wrong"))

	err = repo.CreateReview(newReview)

	assert.Error(t, err)
	assert.Equal(t, 0, newReview.ID)
}

func TestDeleteReview(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	reviewID := 1

	query := `DELETE FROM reviews WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(reviewID).WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteReview(reviewID)

	assert.NoError(t, err)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDeleteReviewDBError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	reviewID := 1

	query := `DELETE FROM reviews WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(reviewID).WillReturnError(sql.ErrConnDone)

	err = repo.DeleteReview(reviewID)

	assert.Error(t, err)
}

func TestDeleteReviewNoRowsAffected(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	repo := PostgresDBRepo{
		DB: db,
	}

	reviewID := 1

	query := `DELETE FROM reviews WHERE id = \$1`

	prep := mock.ExpectPrepare(query)
	prep.ExpectExec().WithArgs(reviewID).WillReturnResult(sqlmock.NewResult(1, 0))

	err = repo.DeleteReview(reviewID)

	// Depends on your implementation. If not finding a row to delete is an error, assert Error here. Otherwise, assert NoError.
	assert.NoError(t, err)
}
