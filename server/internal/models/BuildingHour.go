package models

import (
	"database/sql"
	"time"
)

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
	OpenTime  sql.NullString `json:"open_time"`
	CloseTime sql.NullString `json:"close_time"`
	AveRating float64        `json:"ave_rating"`
}
