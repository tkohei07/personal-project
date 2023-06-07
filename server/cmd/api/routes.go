package main

import (
	"backend/internal/models"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (app *application) registerRoutes(r *gin.Engine) {
	// enable CORS
	// may be better to do this in another file
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE, POST, PUT")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/", app.Home)
	r.GET("/api/all-buildings", app.GetAllBuildings)
	r.GET("/api/buildings", app.GetBuildingsWithTodayHours)
	r.GET("/api/building/:id", app.GetBuildingByID)
	r.GET("/api/hours/:id", app.GetBuildingHoursBuildingByID)
	r.GET("/api/reviews/:id", app.GetReviewsByBuildingID)
	r.GET("/api/user/:id/favorites", app.GetFavoritesByUserID)
	r.GET("/api/user/:id/reviews", app.GetReviewsByUserID)
	r.POST("/api/add-hours", app.CreateBuildingHours)
	r.POST("/api/add-review/:id", app.CreateReview)
	r.POST("/api/buildings", app.CreateBuilding)
	r.POST("/api/user/:id/favorites", app.CreateFavorite)
	r.PUT("/api/building/:id", app.UpdateBuilding)
	r.DELETE("/api/buildings/:id", app.DeleteBuilding)
	r.DELETE("/api/hours/:id", app.DeleteBuildingHours)
	r.DELETE("/api/user/:id/favorites", app.DeleteFavorite)
	r.DELETE("/api/review/:id", app.DeleteReview)

	r.POST("/api/register", app.Register)
	r.POST("/api/authenticate", app.Authenticate)

}

// may be better to do these things in another file (handlers.go)
func (app *application) Home(c *gin.Context) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go Movies up and running",
		Version: "1.0.0",
	}

	c.JSON(200, payload)
}

func (app *application) GetBuildingsWithTodayHours(c *gin.Context) {
	log.Println("Receive GetBuildingsWithTodayHours request")
	buildingsWithHours, err := app.DB.GetBuildingsWithTodayHours()
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, buildingsWithHours)
}

func (app *application) GetAllBuildings(c *gin.Context) {
	log.Println("Receive AllBuildings request")
	buildings, err := app.DB.GetAllBuildings()
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, buildings)
}

func (app *application) GetBuildingByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	building, err := app.DB.GetBuildingByID(id)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, building)
}

func (app *application) GetBuildingHoursBuildingByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	buildingHours, err := app.DB.GetBuildingHoursBuildingByID(id)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, buildingHours)
}

func (app *application) GetReviewsByBuildingID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	reviews, err := app.DB.GetReviewsByBuildingID(id)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, reviews)
}

func (app *application) GetFavoritesByUserID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	favorites, err := app.DB.GetFavoritesByUserID(id)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, favorites)
}

func (app *application) GetReviewsByUserID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	reviews, err := app.DB.GetReviewsByUserID(id)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, reviews)
}

func (app *application) UpdateBuilding(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	var building models.Building
	if err := c.BindJSON(&building); err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.UpdateBuilding(id, &building); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, building)
}

func (app *application) CreateBuilding(c *gin.Context) {
	var building models.Building
	if err := c.BindJSON(&building); err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.CreateBuilding(&building); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(201, building)
}

func (app *application) CreateFavorite(c *gin.Context) {
	var favorite models.Favorite
	if err := c.BindJSON(&favorite); err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.CreateFavorite(&favorite); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(201, favorite)
}

func (app *application) CreateBuildingHours(c *gin.Context) {
	// The format of the JSON input is different from the BuildingHour struct
	var jsonInput struct {
		models.BuildingHour
		StartDateStr string `json:"startDate"`
		EndDateStr   string `json:"endDate"`
		OpenTimeStr  string `json:"openTime"`
		CloseTimeStr string `json:"closeTime"`
	}

	if err := c.BindJSON(&jsonInput); err != nil {
		c.AbortWithError(400, err)
		return
	}

	// Parse the StartDate and EndDate
	startDate, err := ParseDate(jsonInput.StartDateStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}
	endDate, err := ParseDate(jsonInput.EndDateStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	// Parse the OpenTime and CloseTime
	openTime, err := ParseTime(jsonInput.OpenTimeStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}
	closeTime, err := ParseTime(jsonInput.CloseTimeStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	var building_hour models.BuildingHour = jsonInput.BuildingHour
	building_hour.StartDate = startDate
	building_hour.EndDate = endDate
	building_hour.OpenTime = openTime
	building_hour.CloseTime = closeTime

	if err := app.DB.CreateBuildingHours(&building_hour); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(201, building_hour)
}

func (app *application) CreateReview(c *gin.Context) {
	var review models.Review
	if err := c.BindJSON(&review); err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.CreateReview(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(201, review)
}

func (app *application) DeleteBuilding(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.DeleteBuilding(id); err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Building deleted successfully",
	})
}

func (app *application) DeleteBuildingHours(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.DeleteBuildingHours(id); err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Building hours deleted successfully",
	})
}

func (app *application) DeleteFavorite(c *gin.Context) {
	var favorite models.Favorite
	if err := c.BindJSON(&favorite); err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.DeleteFavorite(&favorite); err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Favorite deleted successfully",
	})
}

func (app *application) DeleteReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	if err := app.DB.DeleteReview(id); err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Review deleted successfully",
	})
}

func ParseDate(d string) (time.Time, error) {
	layout := "2006-01-02" // This is a layout that matches the "YYYY-MM-DD" format
	return time.Parse(layout, d)
}

func ParseTime(t string) (time.Time, error) {
	layout := "15:04" // This is a layout that matches the "HH:MM" format
	return time.Parse(layout, t)
}

func (app *application) Register(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.AbortWithError(400, err)
		return
	}

	// Hash the password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	user.Password = string(hashedPassword)

	if err := app.DB.SaveUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "User registered successfully",
	})
}

func (app *application) Authenticate(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.AbortWithError(400, err)
		return
	}

	storedUser, err := app.DB.GetUserByUsername(user.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Incorrect username or password",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Incorrect username or password",
		})
		return
	}

	// create a JWT and send it back to the user.
	token, err := GenerateJWT(storedUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to generate token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"id":      storedUser.ID,
	})
}
