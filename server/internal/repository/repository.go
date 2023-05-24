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
	GetBuildingHoursByID(id int) ([]*models.BuildingHour, error)
	CreateBuilding(building *models.Building) error
	CreateBuildingHours(building *models.BuildingHour) error
	UpdateBuilding(id int, building *models.Building) error
	DeleteBuilding(buildingID int) error
	DeleteBuildingHours(hourID int) error

	SaveUser(user *models.User) error
	GetUserByUsername(username string) (*models.User, error)
}
