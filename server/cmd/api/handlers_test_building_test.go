package main

import (
	"backend/internal/models"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// FullMockDatabaseRepo is a mocked object that implements the DatabaseRepo interface with no-op implementations
type FullMockDatabaseRepo struct {
	mock.Mock
}

func (m *FullMockDatabaseRepo) Connection() *sql.DB {
	return nil
}

func (m *FullMockDatabaseRepo) GetAllBuildings() ([]*models.Building, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) GetBuildingByID(id int) (*models.Building, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) CreateBuilding(building *models.Building) error {
	return nil
}

func (m *FullMockDatabaseRepo) UpdateBuilding(id int, building *models.Building) error {
	return nil
}

func (m *FullMockDatabaseRepo) DeleteBuilding(buildingID int) error {
	return nil
}

func (m *FullMockDatabaseRepo) GetBuildingHoursBuildingByID(id int) ([]*models.BuildingHour, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) CreateBuildingHours(building *models.BuildingHour) error {
	return nil
}

func (m *FullMockDatabaseRepo) DeleteBuildingHours(hourID int) error {
	return nil
}

func (m *FullMockDatabaseRepo) GetBuildingsWithTodayHours() ([]*models.BuildingWithHours, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) GetReviewsByBuildingID(id int) ([]*models.Review, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) GetReviewsByUserID(id int) ([]*models.Review, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) CreateReview(review *models.Review) error {
	return nil
}

func (m *FullMockDatabaseRepo) DeleteReview(reviewID int) error {
	return nil
}

func (m *FullMockDatabaseRepo) GetFavoritesByUserID(id int) ([]*models.Favorite, error) {
	return nil, nil
}

func (m *FullMockDatabaseRepo) CreateFavorite(favorite *models.Favorite) error {
	return nil
}

func (m *FullMockDatabaseRepo) DeleteFavorite(favorite *models.Favorite) error {
	return nil
}

func (m *FullMockDatabaseRepo) SaveUser(user *models.User) error {
	return nil
}

func (m *FullMockDatabaseRepo) GetUserByUsername(username string) (*models.User, error) {
	return nil, nil
}

type MockDatabaseRepo struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepo) GetAllBuildings() ([]*models.Building, error) {
	args := m.Called()
	return args.Get(0).([]*models.Building), args.Error(1)
}

func TestGetAllBuildingsHandler(t *testing.T) {
	// Create a mock DatabaseRepo
	mockDB := new(MockDatabaseRepo)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/all-buildings", app.GetAllBuildings)

	buildings := []*models.Building{{ID: 1, Name: "Building 1"}, {ID: 2, Name: "Building 2"}}
	mockDB.On("GetAllBuildings").Return(buildings, nil)

	req, _ := http.NewRequest("GET", "/api/all-buildings", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	// Check the response body
	var returnedBuildings []*models.Building
	err := json.Unmarshal(resp.Body.Bytes(), &returnedBuildings)
	assert.NoError(t, err)
	assert.Equal(t, buildings, returnedBuildings)
}

func TestGetAllBuildingsHandler_DBError(t *testing.T) {
	// Create a mock DatabaseRepo
	mockDB := new(MockDatabaseRepo)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/all-buildings", app.GetAllBuildings)

	// Test the handler when the database returns an error
	mockDB.On("GetAllBuildings").Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/all-buildings", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}
