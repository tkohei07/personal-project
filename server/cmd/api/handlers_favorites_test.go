package main

import (
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type MockDatabaseRepoWithGetFavoritesByUserID struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithCreateFavorite struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithDeleteFavorite struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepoWithGetFavoritesByUserID) GetFavoritesByUserID(id int) ([]*models.Favorite, error) {
	args := m.Called(id)
	return args.Get(0).([]*models.Favorite), args.Error(1)
}

func (m *MockDatabaseRepoWithCreateFavorite) CreateFavorite(favorite *models.Favorite) error {
	args := m.Called(favorite)
	return args.Error(0)
}

func (m *MockDatabaseRepoWithDeleteFavorite) DeleteFavorite(favorite *models.Favorite) error {
	args := m.Called(favorite)
	return args.Error(0)
}

func TestGetFavoritesByUserIDHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetFavoritesByUserID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/user/:id/favorites", app.GetFavoritesByUserID)

	now := time.Now().Truncate(time.Second)

	expectedFavorites := []*models.Favorite{
		{
			ID:           1,
			UserID:       1,
			BuildingID:   101,
			BuildingName: "Building 101",
			CreatedAt:    now,
			UpdatedAt:    now,
		},
		{
			ID:           2,
			UserID:       1,
			BuildingID:   102,
			BuildingName: "Building 102",
			CreatedAt:    now,
			UpdatedAt:    now,
		},
	}

	mockDB.On("GetFavoritesByUserID", 1).Return(expectedFavorites, nil)

	req, _ := http.NewRequest("GET", "/api/user/1/favorites", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var returnedFavorites []*models.Favorite
	err := json.Unmarshal(resp.Body.Bytes(), &returnedFavorites)
	assert.NoError(t, err)
	assert.Equal(t, expectedFavorites, returnedFavorites)
}

func TestGetFavoritesByUserIDHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetFavoritesByUserID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/user/:id/favorites", app.GetFavoritesByUserID)

	mockDB.On("GetFavoritesByUserID", 1).Return(nil, errors.New("some error"))

	req, _ := http.NewRequest("GET", "/api/user/1/favorites", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetFavoritesByUserIDHandler_InvalidUserID(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/user/:id/favorites", app.GetFavoritesByUserID)

	req, _ := http.NewRequest("GET", "/api/user/bad_id/favorites", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestCreateFavoriteHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateFavorite)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/favorites", app.CreateFavorite)

	now := time.Now().Truncate(time.Second)

	newFavorite := models.Favorite{
		ID:           1,
		UserID:       1,
		BuildingID:   101,
		BuildingName: "Building 101",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	newFavoriteJSON, err := json.Marshal(newFavorite)
	if err != nil {
		t.Fatal(err)
	}

	mockDB.On("CreateFavorite", &newFavorite).Return(nil)

	req, _ := http.NewRequest("POST", "/api/favorites", bytes.NewBuffer(newFavoriteJSON))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusCreated, resp.Code)

	var returnedFavorite models.Favorite
	err = json.Unmarshal(resp.Body.Bytes(), &returnedFavorite)
	assert.NoError(t, err)
	assert.Equal(t, newFavorite, returnedFavorite)
}

func TestCreateFavoriteHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateFavorite)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/favorites", app.CreateFavorite)

	now := time.Now().Truncate(time.Second)

	newFavorite := models.Favorite{
		ID:           1,
		UserID:       1,
		BuildingID:   101,
		BuildingName: "Building 101",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	newFavoriteJSON, err := json.Marshal(newFavorite)
	if err != nil {
		t.Fatal(err)
	}

	mockDB.On("CreateFavorite", &newFavorite).Return(errors.New("some error"))

	req, _ := http.NewRequest("POST", "/api/favorites", bytes.NewBuffer(newFavoriteJSON))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestCreateFavoriteHandler_InvalidJSON(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/favorites", app.CreateFavorite)

	req, _ := http.NewRequest("POST", "/api/favorites", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestDeleteFavoriteHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteFavorite)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/favorites", app.DeleteFavorite)

	favoriteToDelete := models.Favorite{
		ID:           1,
		UserID:       1,
		BuildingID:   101,
		BuildingName: "Building 101",
	}

	favoriteJSON, err := json.Marshal(favoriteToDelete)
	if err != nil {
		t.Fatal(err)
	}

	mockDB.On("DeleteFavorite", &favoriteToDelete).Return(nil)

	req, _ := http.NewRequest("DELETE", "/api/favorites", bytes.NewBuffer(favoriteJSON))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var returnedMessage map[string]string
	err = json.Unmarshal(resp.Body.Bytes(), &returnedMessage)
	assert.NoError(t, err)
	assert.Equal(t, "Favorite deleted successfully", returnedMessage["message"])
}

func TestDeleteFavoriteHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteFavorite)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/favorites", app.DeleteFavorite)

	favoriteToDelete := models.Favorite{
		ID:           1,
		UserID:       1,
		BuildingID:   101,
		BuildingName: "Building 101",
	}

	favoriteJSON, err := json.Marshal(favoriteToDelete)
	if err != nil {
		t.Fatal(err)
	}

	mockDB.On("DeleteFavorite", &favoriteToDelete).Return(errors.New("some error"))

	req, _ := http.NewRequest("DELETE", "/api/favorites", bytes.NewBuffer(favoriteJSON))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestDeleteFavoriteHandler_InvalidJSON(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/favorites", app.DeleteFavorite)

	req, _ := http.NewRequest("DELETE", "/api/favorites", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}
