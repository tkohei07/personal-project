package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	GetAllBuildings() ([]*models.Building, error)
	GetBuildingsWithTodayHours() ([]*models.BuildingWithHours, error)
	GetBuildingByID(id int) (*models.Building, error)
	GetBuildingHoursBuildingByID(id int) ([]*models.BuildingHour, error)
	GetReviewsByBuildingID(id int) ([]*models.Review, error)
	GetFavoritesByUserID(id int) ([]*models.Favorite, error)
	GetReviewsByUserID(id int) ([]*models.Review, error)
	CreateBuilding(building *models.Building) error
	CreateFavorite(favorite *models.Favorite) error
	CreateReview(review *models.Review) error
	CreateBuildingHours(building *models.BuildingHour) error
	UpdateBuilding(id int, building *models.Building) error
	DeleteBuilding(buildingID int) error
	DeleteBuildingHours(hourID int) error
	DeleteFavorite(favorite *models.Favorite) error
	DeleteReview(reviewID int) error

	SaveUser(user *models.User) error
	GetUserByUsername(username string) (*models.User, error)
}
