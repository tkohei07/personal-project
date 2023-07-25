package main

import (
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

type MockDatabaseRepoWithRegister struct {
	FullMockDatabaseRepo
}

func (m *MockDatabaseRepoWithRegister) Register(user *models.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func TestRegisterHandler(t *testing.T) {
	mockDB := new(MockDatabaseRepoWithRegister)

	app := application{
		DB: mockDB,
	}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/api/register", app.Register)

	userToRegister := models.User{
		ID:       1,
		Username: "TestUser",
		Password: "TestPassword",
	}

	// Generate the hashed password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(userToRegister.Password), bcrypt.DefaultCost)
	userToRegister.Password = string(hashedPassword)

	userJSON, err := json.Marshal(userToRegister)
	if err != nil {
		t.Fatal(err)
	}

	mockDB.On("SaveUser", &userToRegister).Return(nil)

	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var returnedMessage map[string]string
	err = json.Unmarshal(resp.Body.Bytes(), &returnedMessage)
	assert.NoError(t, err)
	assert.Equal(t, "User registered successfully", returnedMessage["message"])
}
