package models

import (
	"database/sql"
	"time"
)

type Building struct {
	ID                    int       `json:"id"`
	Name                  string    `json:"name"`
	Address               string    `json:"address"`
	Link                  string    `json:"link"`
	IsComputerRoom        bool      `json:"isComputerRoom"`
	IsReservableStudyRoom bool      `json:"isReservableStudyRoom"`
	IsVendingArea         bool      `json:"isVendingArea"`
	CreatedAt             time.Time `json:"-"`
	UpdatedAt             time.Time `json:"-"`
}

type BuildingHour struct {
	ID           int       `json:"id"`
	BuildingID   int       `json:"buildingId"`
	DayOfWeek    int       `json:"dayOfWeek"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
	OpenTime     time.Time `json:"openTime"`
	CloseTime    time.Time `json:"closeTime"`
	OpenTimeStr  string    `json:"openTimeStr"`
	CloseTimeStr string    `json:"closeTimeStr"`
}

type BuildingWithHours struct {
	Building
	// OpenTime  string  `json:"open_time"`
	// CloseTime string  `json:"close_time"`
	OpenTime  sql.NullString `json:"open_time"`
	CloseTime sql.NullString `json:"close_time"`
	AveRating float64        `json:"ave_rating"`
}

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Review struct {
	ID           int       `json:"id"`
	BuildingID   string    `json:"buildingId"`
	BuildingName string    `json:"buildingName"`
	UserID       int       `json:"userId"`
	Username     string    `json:"username"`
	Rating       int       `json:"rating"`
	Comment      string    `json:"comment"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Favorite struct {
	ID           int       `json:"id"`
	UserID       int       `json:"userId"`
	BuildingID   int       `json:"buildingId"`
	BuildingName string    `json:"buildingName"`
	CreatedAt    time.Time `json:"-"`
	UpdatedAt    time.Time `json:"-"`
}
