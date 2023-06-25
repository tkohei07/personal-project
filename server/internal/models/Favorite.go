package models

import "time"

type Favorite struct {
	ID           int       `json:"id"`
	UserID       int       `json:"userId"`
	BuildingID   int       `json:"buildingId"`
	BuildingName string    `json:"buildingName"`
	CreatedAt    time.Time `json:"-"`
	UpdatedAt    time.Time `json:"-"`
}
