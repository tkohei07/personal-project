package main

import (
	"backend/internal/models"
	"backend/utils"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// //////////////////////////////////////
// Home Handler 									   ///
// //////////////////////////////////////
func (app *application) Home(c *gin.Context) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Find study space",
		Version: "1.0.0",
	}

	c.JSON(200, payload)
}

// ///////////////////////////////////////
// Building Handlers 								 ////
// ///////////////////////////////////////
func (app *application) GetAllBuildings(c *gin.Context) {
	log.Println("Receive AllBuildings request")
	buildings, err := app.DB.GetAllBuildings()
	if err != nil {
		c.AbortWithError(500, err)
		return
	}

	c.JSON(200, buildings)
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

// ///////////////////////////////////////
// Building Hours Handlers 					 ////
// ///////////////////////////////////////
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
	startDate, err := utils.ParseDate(jsonInput.StartDateStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}
	endDate, err := utils.ParseDate(jsonInput.EndDateStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}

	// Parse the OpenTime and CloseTime
	openTime, err := utils.ParseTimeWithoutSecond(jsonInput.OpenTimeStr)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}
	closeTime, err := utils.ParseTimeWithoutSecond(jsonInput.CloseTimeStr)
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

// ///////////////////////////////////////
// Reviews Handlers 								  ////
// ///////////////////////////////////////
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

// ///////////////////////////////////////
// Favorites Handlers 							  ////
// ///////////////////////////////////////
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

// ///////////////////////////////////////
// Users Handlers 									 ////
// ///////////////////////////////////////
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
