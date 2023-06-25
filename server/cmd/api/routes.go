package main

import (
	"github.com/gin-gonic/gin"
)

func (app *application) registerRoutes(r *gin.Engine) {

	// Home
	r.GET("/api/", app.Home)

	// Building
	r.GET("/api/all-buildings", app.GetAllBuildings)
	r.GET("/api/buildings", app.GetBuildingsWithTodayHours)
	r.GET("/api/building/:id", app.GetBuildingByID)
	r.POST("/api/buildings", app.CreateBuilding)
	r.PUT("/api/building/:id", app.UpdateBuilding)
	r.DELETE("/api/buildings/:id", app.DeleteBuilding)

	// Building Hours
	r.GET("/api/hours/:id", app.GetBuildingHoursBuildingByID)
	r.POST("/api/add-hours", app.CreateBuildingHours)
	r.DELETE("/api/hours/:id", app.DeleteBuildingHours)

	// Review
	r.GET("/api/reviews/:id", app.GetReviewsByBuildingID)
	r.GET("/api/user/:id/reviews", app.GetReviewsByUserID)
	r.POST("/api/add-review/:id", app.CreateReview)
	r.DELETE("/api/review/:id", app.DeleteReview)

	// Favorite
	r.GET("/api/user/:id/favorites", app.GetFavoritesByUserID)
	r.POST("/api/user/:id/favorites", app.CreateFavorite)
	r.DELETE("/api/user/:id/favorites", app.DeleteFavorite)

	// User
	r.POST("/api/register", app.Register)
	r.POST("/api/authenticate", app.Authenticate)

}
