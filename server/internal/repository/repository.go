package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB

	// Building
	GetAllBuildings() ([]*models.Building, error)
	GetBuildingByID(id int) (*models.Building, error)
	CreateBuilding(building *models.Building) error
	UpdateBuilding(id int, building *models.Building) error
	DeleteBuilding(buildingID int) error

	// Building Hours
	GetBuildingHoursBuildingByID(id int) ([]*models.BuildingHour, error)
	CreateBuildingHours(building *models.BuildingHour) error
	DeleteBuildingHours(hourID int) error
	GetBuildingsWithTodayHours() ([]*models.BuildingWithHours, error)

	// Review
	GetReviewsByBuildingID(id int) ([]*models.Review, error)
	GetReviewsByUserID(id int) ([]*models.Review, error)
	CreateReview(review *models.Review) error
	DeleteReview(reviewID int) error

	// Favorite
	GetFavoritesByUserID(id int) ([]*models.Favorite, error)
	CreateFavorite(favorite *models.Favorite) error
	DeleteFavorite(favorite *models.Favorite) error

	// User
	SaveUser(user *models.User) error
	GetUserByUsername(username string) (*models.User, error)
}
