package main

import (
	"backend/internal/models"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type MockDatabaseRepoWithGetReviewsByBuildingID struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithGetReviewsByUserID struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithCreateReview struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithDeleteReview struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepoWithGetReviewsByBuildingID) GetReviewsByBuildingID(id int) ([]*models.Review, error) {
	args := m.Called(id)
	return args.Get(0).([]*models.Review), args.Error(1)
}

func (m *MockDatabaseRepoWithGetReviewsByUserID) GetReviewsByUserID(id int) ([]*models.Review, error) {
	args := m.Called(id)
	return args.Get(0).([]*models.Review), args.Error(1)
}

func (m *MockDatabaseRepoWithCreateReview) CreateReview(review *models.Review) error {
	args := m.Called(review)
	return args.Error(0)
}

func (m *MockDatabaseRepoWithDeleteReview) DeleteReview(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestGetReviewsByBuildingIDHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetReviewsByBuildingID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/reviews/:id", app.GetReviewsByBuildingID)

	now := time.Now().Truncate(time.Second)

	expectedReviews := []*models.Review{
		{
			ID:           1,
			BuildingID:   "101",
			BuildingName: "Building 101",
			UserID:       1,
			Username:     "Test User",
			Rating:       5,
			Comment:      "Great building!",
			CreatedAt:    now,
			UpdatedAt:    now,
		},
	}

	mockDB.On("GetReviewsByBuildingID", 1).Return(expectedReviews, nil)

	req, _ := http.NewRequest("GET", "/api/reviews/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var returnedReviews []*models.Review
	err := json.Unmarshal(resp.Body.Bytes(), &returnedReviews)
	assert.NoError(t, err)
	assert.Equal(t, expectedReviews, returnedReviews)
}

func TestGetReviewsByBuildingIDHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetReviewsByBuildingID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/reviews/:id", app.GetReviewsByBuildingID)

	// Test the handler when the database returns an error
	mockDB.On("GetReviewsByBuildingID", 1).Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/reviews/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetReviewsByBuildingIDHandler_InvalidID(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetReviewsByBuildingID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/reviews/:id", app.GetReviewsByBuildingID)

	req, _ := http.NewRequest("GET", "/api/reviews/invalid_id", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code because of the invalid ID
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestGetReviewsByUserIDHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetReviewsByUserID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/users/:id/reviews", app.GetReviewsByUserID)

	now := time.Now().Truncate(time.Second)

	expectedReviews := []*models.Review{
		{
			ID:           1,
			BuildingID:   "101",
			BuildingName: "Building 101",
			UserID:       1,
			Username:     "Test User",
			Rating:       5,
			Comment:      "Great building!",
			CreatedAt:    now,
			UpdatedAt:    now,
		},
	}

	mockDB.On("GetReviewsByUserID", 1).Return(expectedReviews, nil)

	req, _ := http.NewRequest("GET", "/api/users/1/reviews", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var returnedReviews []*models.Review
	if err := json.Unmarshal(resp.Body.Bytes(), &returnedReviews); err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, expectedReviews, returnedReviews)
}

func TestGetReviewsByUserIDHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetReviewsByUserID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/users/:id/reviews", app.GetReviewsByUserID)

	// Set up mock DB to return error
	mockDB.On("GetReviewsByUserID", 1).Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/users/1/reviews", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code because of the DB error
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetReviewsByUserIDHandler_InvalidUserID(t *testing.T) {
	app := application{
		DB: new(MockDatabaseRepoWithGetReviewsByUserID),
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/users/:id/reviews", app.GetReviewsByUserID)

	// Sending a request with a non-integer user ID
	req, _ := http.NewRequest("GET", "/api/users/invalid/reviews", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code due to the invalid user ID
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestCreateReviewHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateReview)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/add-review/:id", app.CreateReview)

	reviewJSON := `{
		"buildingID": "101",
		"buildingName": "Building 101",
		"userID": 1,
		"username": "Test User",
		"rating": 5,
		"comment": "Great building!"
	}`

	req, _ := http.NewRequest("POST", "/api/add-review/:id", strings.NewReader(reviewJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	expectedReview := &models.Review{
		BuildingID:   "101",
		BuildingName: "Building 101",
		UserID:       1,
		Username:     "Test User",
		Rating:       5,
		Comment:      "Great building!",
	}

	mockDB.On("CreateReview", expectedReview).Return(nil)

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusCreated, resp.Code)

	var returnedReview models.Review
	if err := json.Unmarshal(resp.Body.Bytes(), &returnedReview); err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, *expectedReview, returnedReview)
}

func TestCreateReviewHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateReview)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/reviews", app.CreateReview)

	reviewJSON := `{
		"buildingID": "101",
		"buildingName": "Building 101",
		"userID": 1,
		"username": "Test User",
		"rating": 5,
		"comment": "Great building!"
	}`

	req, _ := http.NewRequest("POST", "/api/reviews", strings.NewReader(reviewJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	review := &models.Review{
		BuildingID:   "101",
		BuildingName: "Building 101",
		UserID:       1,
		Username:     "Test User",
		Rating:       5,
		Comment:      "Great building!",
	}

	mockDB.On("CreateReview", review).Return(errors.New("mock error"))

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestCreateReviewHandler_BindError(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/reviews", app.CreateReview)

	invalidJSON := `{
		"rating": "five",  // invalid value for rating
		"comment": "Great building!"
	}`

	req, _ := http.NewRequest("POST", "/api/reviews", strings.NewReader(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestDeleteReviewHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteReview)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/review/:id", app.DeleteReview)

	mockDB.On("DeleteReview", 1).Return(nil)

	req, _ := http.NewRequest("DELETE", "/api/review/1", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var response gin.H
	if err := json.Unmarshal(resp.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, gin.H{"message": "Review deleted successfully"}, response)
}

func TestDeleteReviewHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteReview)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/reviews/:id", app.DeleteReview)

	mockDB.On("DeleteReview", 1).Return(errors.New("mock error"))

	req, _ := http.NewRequest("DELETE", "/api/reviews/1", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestDeleteReviewHandler_BadID(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/reviews/:id", app.DeleteReview)

	req, _ := http.NewRequest("DELETE", "/api/reviews/bad_id", nil) // bad id
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}
