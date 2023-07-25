package main

import (
	"backend/internal/models"
	"bytes"
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

type MockDatabaseRepoWithGetBuildingByID struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithCRUD struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepo) GetAllBuildings() ([]*models.Building, error) {
	args := m.Called()
	return args.Get(0).([]*models.Building), args.Error(1)
}

func (m *MockDatabaseRepo) GetBuildingsWithTodayHours() ([]*models.BuildingWithHours, error) {
	args := m.Called()
	return args.Get(0).([]*models.BuildingWithHours), args.Error(1)
}

func (m *MockDatabaseRepoWithGetBuildingByID) GetBuildingByID(id int) (*models.Building, error) {
	args := m.Called(id)
	return args.Get(0).(*models.Building), args.Error(1)
}

func (m *MockDatabaseRepoWithCRUD) CreateBuilding(building *models.Building) error {
	args := m.Called(building)
	return args.Error(0)
}

func (m *MockDatabaseRepoWithCRUD) UpdateBuilding(id int, building *models.Building) error {
	args := m.Called(id, building)
	return args.Error(0)
}

func (m *MockDatabaseRepoWithCRUD) DeleteBuilding(buildingID int) error {
	args := m.Called(buildingID)
	return args.Error(0)
}

func TestGetAllBuildingsHandler(t *testing.T) {
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

func TestGetBuildingsWithTodayHoursHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepo)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/buildings", app.GetBuildingsWithTodayHours)

	buildingsWithHours := []*models.BuildingWithHours{
		{
			Building: models.Building{
				ID:   1,
				Name: "Building 1",
			},
			OpenTime:  sql.NullString{String: "08:00", Valid: true},
			CloseTime: sql.NullString{String: "18:00", Valid: true},
			AveRating: 4.5,
		},
	}
	mockDB.On("GetBuildingsWithTodayHours").Return(buildingsWithHours, nil)

	req, _ := http.NewRequest("GET", "/api/buildings", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	// Check the response body
	var returnedBuildingsWithHours []*models.BuildingWithHours
	err := json.Unmarshal(resp.Body.Bytes(), &returnedBuildingsWithHours)
	assert.NoError(t, err)
	assert.Equal(t, buildingsWithHours, returnedBuildingsWithHours)
}

func TestGetBuildingsWithTodayHoursHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepo)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/buildings", app.GetBuildingsWithTodayHours)

	// Test the handler when the database returns an error
	mockDB.On("GetBuildingsWithTodayHours").Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/buildings", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetBuildingByIDHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building/:id", app.GetBuildingByID)

	expectedBuilding := &models.Building{ID: 1, Name: "Building 1"}
	mockDB.On("GetBuildingByID", 1).Return(expectedBuilding, nil)

	req, _ := http.NewRequest("GET", "/api/building/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	// Check the response body
	var returnedBuilding *models.Building
	err := json.Unmarshal(resp.Body.Bytes(), &returnedBuilding)
	assert.NoError(t, err)
	assert.Equal(t, expectedBuilding, returnedBuilding)
}

func TestGetBuildingByIDHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building/:id", app.GetBuildingByID)

	// Test the handler when the database returns an error
	mockDB.On("GetBuildingByID", 1).Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/building/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetBuildingByIDHandler_InvalidID(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building/:id", app.GetBuildingByID)

	req, _ := http.NewRequest("GET", "/api/building/invalid_id", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code because of the invalid ID
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestCreateBuildingHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/buildings", app.CreateBuilding)

	newBuilding := models.Building{Name: "New Building"}
	mockDB.On("CreateBuilding", mock.Anything).Return(nil)

	reqBody, _ := json.Marshal(newBuilding)
	req, _ := http.NewRequest("POST", "/api/buildings", bytes.NewBuffer(reqBody))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusCreated, resp.Code)
}

func TestCreateBuildingHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/buildings", app.CreateBuilding)

	newBuilding := models.Building{Name: "New Building"}
	mockDB.On("CreateBuilding", mock.Anything).Return(errors.New("mock error"))

	reqBody, _ := json.Marshal(newBuilding)
	req, _ := http.NewRequest("POST", "/api/buildings", bytes.NewBuffer(reqBody))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestCreateBuildingHandler_InvalidJSON(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/buildings", app.CreateBuilding)

	req, _ := http.NewRequest("POST", "/api/buildings", bytes.NewBufferString("invalid json"))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestUpdateBuildingHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.PUT("/api/building/:id", app.UpdateBuilding)

	updBuilding := models.Building{Name: "Updated Building"}
	mockDB.On("UpdateBuilding", 1, mock.Anything).Return(nil)

	reqBody, _ := json.Marshal(updBuilding)
	req, _ := http.NewRequest("PUT", "/api/building/1", bytes.NewBuffer(reqBody))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestUpdateBuildingHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.PUT("/api/building/:id", app.UpdateBuilding)

	updBuilding := models.Building{Name: "Updated Building"}
	mockDB.On("UpdateBuilding", 1, mock.Anything).Return(errors.New("mock error"))

	reqBody, _ := json.Marshal(updBuilding)
	req, _ := http.NewRequest("PUT", "/api/building/1", bytes.NewBuffer(reqBody))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestUpdateBuildingHandler_InvalidJSON(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.PUT("/api/building/:id", app.UpdateBuilding)

	req, _ := http.NewRequest("PUT", "/api/building/1", bytes.NewBufferString("invalid json"))
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestDeleteBuildingHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/buildings/:id", app.DeleteBuilding)

	mockDB.On("DeleteBuilding", 1).Return(nil)

	req, _ := http.NewRequest("DELETE", "/api/buildings/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestDeleteBuildingHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/buildings/:id", app.DeleteBuilding)

	mockDB.On("DeleteBuilding", 1).Return(errors.New("mock error"))

	req, _ := http.NewRequest("DELETE", "/api/buildings/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestDeleteBuildingHandler_InvalidID(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCRUD)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/buildings/:id", app.DeleteBuilding)

	req, _ := http.NewRequest("DELETE", "/api/buildings/invalid_id", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}
