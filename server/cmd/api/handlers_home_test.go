package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHomeHandler(t *testing.T) {
	app := application{}

	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/", app.Home)

	req, _ := http.NewRequest("GET", "/", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}
	if err := json.Unmarshal(resp.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}

	expectedResponse := struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Find study space",
		Version: "1.0.0",
	}

	assert.Equal(t, expectedResponse, response)
}
