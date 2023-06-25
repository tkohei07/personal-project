package utils

import "database/sql"

func ConvertNullString(nullString sql.NullString) string {
	if nullString.Valid {
		return nullString.String
	} else {
		return "00:00:00"
	}
}
