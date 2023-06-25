package models

import (
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
