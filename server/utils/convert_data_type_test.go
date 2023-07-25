package utils

import (
	"database/sql"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertNullString(t *testing.T) {
	// Case when sql.NullString is valid
	validNullString := sql.NullString{
		String: "test",
		Valid:  true,
	}
	result := ConvertNullString(validNullString)
	assert.Equal(t, "test", result, "Expected result to be 'test'")

	// Case when sql.NullString is not valid
	invalidNullString := sql.NullString{
		String: "test",
		Valid:  false,
	}
	result = ConvertNullString(invalidNullString)
	assert.Equal(t, "00:00:00", result, "Expected result to be '00:00:00'")
}
