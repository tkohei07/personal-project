package models

import "time"

type Building struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	Link      string    `json:"link"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
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
	OpenTime  string `json:"open_time"`
	CloseTime string `json:"close_time"`
}
