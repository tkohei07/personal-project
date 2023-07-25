package main

import (
	"backend/internal/models"
	"bytes"
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

type MockDatabaseRepoWithGetBuildingHoursBuildingByID struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithCreateBuildingHours struct {
	FullMockDatabaseRepo
}

type MockDatabaseRepoWithDeleteBuildingHours struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepoWithGetBuildingHoursBuildingByID) GetBuildingHoursBuildingByID(id int) ([]*models.BuildingHour, error) {
	args := m.Called(id)
	return args.Get(0).([]*models.BuildingHour), args.Error(1)
}

func (m *MockDatabaseRepoWithCreateBuildingHours) CreateBuildingHours(buildingHours *models.BuildingHour) error {
	args := m.Called(buildingHours)
	return args.Error(0)
}

func (m *MockDatabaseRepoWithDeleteBuildingHours) DeleteBuildingHours(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestGetBuildingHoursBuildingByIDHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingHoursBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building-hours/:id", app.GetBuildingHoursBuildingByID)

	now := time.Now().Truncate(time.Second)
	openTime := time.Date(now.Year(), now.Month(), now.Day(), 9, 0, 0, 0, time.UTC)
	closeTime := time.Date(now.Year(), now.Month(), now.Day(), 17, 0, 0, 0, time.UTC)

	expectedBuildingHours := []*models.BuildingHour{
		{
			ID:           1,
			BuildingID:   101,
			DayOfWeek:    int(time.Monday),
			StartDate:    now,
			EndDate:      now.AddDate(0, 1, 0),
			OpenTime:     openTime,
			CloseTime:    closeTime,
			OpenTimeStr:  openTime.Format("15:04"),
			CloseTimeStr: closeTime.Format("15:04"),
		},
	}
	mockDB.On("GetBuildingHoursBuildingByID", 1).Return(expectedBuildingHours, nil)

	req, _ := http.NewRequest("GET", "/api/building-hours/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	// Check the response body
	var returnedBuildingHours []*models.BuildingHour
	err := json.Unmarshal(resp.Body.Bytes(), &returnedBuildingHours)
	assert.NoError(t, err)

	// Custom comparison function for BuildingHour
	compareBuildingHours := func(expected, actual *models.BuildingHour) {
		assert.Equal(t, expected.ID, actual.ID)
		assert.Equal(t, expected.BuildingID, actual.BuildingID)
		assert.Equal(t, expected.DayOfWeek, actual.DayOfWeek)
		assert.True(t, expected.StartDate.Equal(actual.StartDate))
		assert.True(t, expected.EndDate.Equal(actual.EndDate))
		assert.True(t, expected.OpenTime.Equal(actual.OpenTime))
		assert.True(t, expected.CloseTime.Equal(actual.CloseTime))
		assert.Equal(t, expected.OpenTimeStr, actual.OpenTimeStr)
		assert.Equal(t, expected.CloseTimeStr, actual.CloseTimeStr)
	}

	// Ensure lengths are the same
	assert.Equal(t, len(expectedBuildingHours), len(returnedBuildingHours))

	// Compare each BuildingHour individually
	for i := range expectedBuildingHours {
		compareBuildingHours(expectedBuildingHours[i], returnedBuildingHours[i])
	}
}

func TestGetBuildingHoursBuildingByIDHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingHoursBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building-hours/:id", app.GetBuildingHoursBuildingByID)

	// Test the handler when the database returns an error
	mockDB.On("GetBuildingHoursBuildingByID", 1).Return(nil, errors.New("mock error"))

	req, _ := http.NewRequest("GET", "/api/building-hours/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestGetBuildingHoursBuildingByIDHandler_InvalidID(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithGetBuildingHoursBuildingByID)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/api/building-hours/:id", app.GetBuildingHoursBuildingByID)

	req, _ := http.NewRequest("GET", "/api/building-hours/invalid_id", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code because of the invalid ID
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestCreateBuildingHoursHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/building-hours", app.CreateBuildingHours)

	startDate := time.Now().UTC().Truncate(24 * time.Hour)
	endDate := startDate
	openTime := time.Date(0, time.January, 1, 9, 0, 0, 0, time.UTC)
	closeTime := time.Date(0, time.January, 1, 18, 0, 0, 0, time.UTC)

	newBuildingHour := &models.BuildingHour{
		ID:           1,
		BuildingID:   1,
		DayOfWeek:    1,
		StartDate:    startDate,
		EndDate:      endDate,
		OpenTime:     openTime,
		CloseTime:    closeTime,
		OpenTimeStr:  "09:00",
		CloseTimeStr: "18:00",
	}

	jsonInput := struct {
		models.BuildingHour
		StartDateStr string `json:"startDate"`
		EndDateStr   string `json:"endDate"`
		OpenTimeStr  string `json:"openTime"`
		CloseTimeStr string `json:"closeTime"`
	}{
		BuildingHour: *newBuildingHour,
		StartDateStr: newBuildingHour.StartDate.Format("2006-01-02"),
		EndDateStr:   newBuildingHour.EndDate.Format("2006-01-02"),
		OpenTimeStr:  newBuildingHour.OpenTimeStr,
		CloseTimeStr: newBuildingHour.CloseTimeStr,
	}

	mockDB.On("CreateBuildingHours", newBuildingHour).Return(nil)

	jsonBody, _ := json.Marshal(jsonInput)
	req, _ := http.NewRequest("POST", "/api/building-hours", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusCreated, resp.Code)

	// Check the response body
	var returnedBuildingHour models.BuildingHour
	err := json.Unmarshal(resp.Body.Bytes(), &returnedBuildingHour)
	assert.NoError(t, err)
	assert.Equal(t, newBuildingHour, &returnedBuildingHour)
}

func TestCreateBuildingHoursHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/building-hours", app.CreateBuildingHours)

	startDate := time.Now().UTC().Truncate(24 * time.Hour)
	endDate := startDate
	openTime := time.Date(0, time.January, 1, 9, 0, 0, 0, time.UTC)
	closeTime := time.Date(0, time.January, 1, 18, 0, 0, 0, time.UTC)

	newBuildingHour := &models.BuildingHour{
		ID:           1,
		BuildingID:   1,
		DayOfWeek:    1,
		StartDate:    startDate,
		EndDate:      endDate,
		OpenTime:     openTime,
		CloseTime:    closeTime,
		OpenTimeStr:  "09:00",
		CloseTimeStr: "18:00",
	}

	jsonInput := struct {
		models.BuildingHour
		StartDateStr string `json:"startDate"`
		EndDateStr   string `json:"endDate"`
		OpenTimeStr  string `json:"openTime"`
		CloseTimeStr string `json:"closeTime"`
	}{
		BuildingHour: *newBuildingHour,
		StartDateStr: newBuildingHour.StartDate.Format("2006-01-02"),
		EndDateStr:   newBuildingHour.EndDate.Format("2006-01-02"),
		OpenTimeStr:  newBuildingHour.OpenTimeStr,
		CloseTimeStr: newBuildingHour.CloseTimeStr,
	}

	mockDB.On("CreateBuildingHours", newBuildingHour).Return(errors.New("some error"))

	jsonBody, _ := json.Marshal(jsonInput)
	req, _ := http.NewRequest("POST", "/api/building-hours", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestCreateBuildingHoursHandler_MalformedJSON(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/building-hours", app.CreateBuildingHours)

	malformedBuildingHourJSON := `{
		"buildingID": 1,
		"dayOfWeek": 1,
		"startDate": "2023-07-13",
		"endDate": "2023-07-14",
		"openTime": "09:00",
		"closeTime": "18:00"
	` // Missing closing bracket

	req, _ := http.NewRequest("POST", "/api/building-hours", strings.NewReader(malformedBuildingHourJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code because of the malformed JSON
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestCreateBuildingHoursHandler_MissingFields(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithCreateBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/building-hours", app.CreateBuildingHours)

	missingFieldsBuildingHourJSON := `{
		"buildingID": 1,
		"dayOfWeek": 1,
		"startDate": "2023-07-13",
		"openTime": "09:00",
		"closeTime": "18:00"
	}` // Missing "endDate"

	req, _ := http.NewRequest("POST", "/api/building-hours", strings.NewReader(missingFieldsBuildingHourJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code because of the missing fields in the JSON
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestDeleteBuildingHoursHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/building-hours/:id", app.DeleteBuildingHours)

	// Set up mock DB to return nil (no error)
	mockDB.On("DeleteBuildingHours", 1).Return(nil)

	req, _ := http.NewRequest("DELETE", "/api/building-hours/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 200 status code
	assert.Equal(t, http.StatusOK, resp.Code)
}

func TestDeleteBuildingHoursHandler_DBError(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/building-hours/:id", app.DeleteBuildingHours)

	// Set up mock DB to return an error
	mockDB.On("DeleteBuildingHours", 1).Return(errors.New("some error"))

	req, _ := http.NewRequest("DELETE", "/api/building-hours/1", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 500 status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
}

func TestDeleteBuildingHoursHandler_InvalidID(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithDeleteBuildingHours)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.DELETE("/api/building-hours/:id", app.DeleteBuildingHours)

	req, _ := http.NewRequest("DELETE", "/api/building-hours/invalid_id", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// The handler should respond with a 400 status code
	assert.Equal(t, http.StatusBadRequest, resp.Code)
}
