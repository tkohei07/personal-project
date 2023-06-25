package utils

import (
	"time"
)

func ParseDate(d string) (time.Time, error) {
	layout := "2006-01-02"
	return time.Parse(layout, d)
}

func ParseTimeWithSecond(t string) (time.Time, error) {
	layout := "15:04:00"
	return time.Parse(layout, t)
}

func ParseTimeWithoutSecond(t string) (time.Time, error) {
	layout := "15:04"
	return time.Parse(layout, t)
}
