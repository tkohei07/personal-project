package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path"
	"runtime"
	"time"

	"github.com/lib/pq"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func readSQLFile(filename string) (string, error) {
	_, currentFilePath, _, ok := runtime.Caller(1)
	if !ok {
		return "", fmt.Errorf("could not get the current file path")
	}

	currentDir := path.Dir(currentFilePath)

	sqlDir := path.Join(currentDir, "sql")
	filePath := path.Join(sqlDir, filename)

	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func (m *PostgresDBRepo) GetBuildingsWithTodayHours() ([]*models.BuildingWithHours, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	dayOfWeek := int(time.Now().Weekday())

	query, err := readSQLFile("get_buildings_with_today_hours.sql")
	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query, dayOfWeek)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var buildingsWithHours []*models.BuildingWithHours

	for rows.Next() {
		var buildingWithHours models.BuildingWithHours
		err := rows.Scan(
			&buildingWithHours.ID,
			&buildingWithHours.Name,
			&buildingWithHours.Address,
			&buildingWithHours.Link,
			&buildingWithHours.CreatedAt,
			&buildingWithHours.UpdatedAt,
			&buildingWithHours.OpenTime,
			&buildingWithHours.CloseTime,
			&buildingWithHours.AveRating,
		)
		if err != nil {
			return nil, err
		}

		buildingsWithHours = append(buildingsWithHours, &buildingWithHours)
	}

	return buildingsWithHours, nil
}

func (m *PostgresDBRepo) GetAllBuildings() ([]*models.Building, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_all_buildings.sql")
	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var buildings []*models.Building

	for rows.Next() {
		var building models.Building
		err := rows.Scan(
			&building.ID,
			&building.Name,
			&building.Address,
			&building.Link,
			&building.CreatedAt,
			&building.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		buildings = append(buildings, &building)
	}
	return buildings, nil
}

func (m *PostgresDBRepo) GetBuildingByID(id int) (*models.Building, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_building_by_id.sql")

	if err != nil {
		return nil, err
	}

	row := m.DB.QueryRowContext(ctx, query, id)

	var building models.Building
	err = row.Scan(
		&building.ID,
		&building.Name,
		&building.Address,
		&building.Link,
		&building.CreatedAt,
		&building.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &building, nil
}

func (m *PostgresDBRepo) GetBuildingHoursBuildingByID(id int) ([]*models.BuildingHour, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_building_hours_by_id.sql")
	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var buildingHours []*models.BuildingHour

	for rows.Next() {
		var buildingHour models.BuildingHour
		err := rows.Scan(
			&buildingHour.ID,
			&buildingHour.BuildingID,
			&buildingHour.DayOfWeek,
			&buildingHour.StartDate,
			&buildingHour.EndDate,
			&buildingHour.OpenTimeStr,
			&buildingHour.CloseTimeStr,
		)
		if err != nil {
			return nil, err
		}

		openTime, err := ParseTime(buildingHour.OpenTimeStr)
		if err != nil {
			return nil, err
		}
		buildingHour.OpenTime = openTime

		closeTime, err := ParseTime(buildingHour.CloseTimeStr)
		if err != nil {
			return nil, err
		}
		buildingHour.CloseTime = closeTime

		buildingHours = append(buildingHours, &buildingHour)
	}

	return buildingHours, nil
}

func ParseTime(t string) (time.Time, error) {
	layout := "15:04:00" // This is a layout that matches the "HH:MM" format
	return time.Parse(layout, t)
}

func (m *PostgresDBRepo) GetReviewsByBuildingID(id int) ([]*models.Review, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_reviews_by_building_id.sql")

	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review

	for rows.Next() {
		var review models.Review
		err := rows.Scan(
			&review.ID,
			&review.BuildingID,
			&review.UserID,
			&review.Username,
			&review.Rating,
			&review.Comment,
			&review.CreatedAt,
			&review.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		reviews = append(reviews, &review)
	}

	return reviews, nil
}

func (m *PostgresDBRepo) GetFavoritesByUserID(id int) ([]*models.Favorite, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_favorites_by_user_id.sql")
	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var favorites []*models.Favorite

	for rows.Next() {
		var favorite models.Favorite
		err := rows.Scan(
			&favorite.ID,
			&favorite.UserID,
			&favorite.BuildingID,
			&favorite.BuildingName,
			&favorite.CreatedAt,
			&favorite.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		favorites = append(favorites, &favorite)
	}

	return favorites, nil
}

func (m *PostgresDBRepo) GetReviewsByUserID(id int) ([]*models.Review, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_reviews_by_user_id.sql")

	if err != nil {
		return nil, err
	}

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []*models.Review

	for rows.Next() {
		var review models.Review
		err := rows.Scan(
			&review.ID,
			&review.BuildingID,
			&review.BuildingName,
			&review.UserID,
			&review.Username,
			&review.Rating,
			&review.Comment,
			&review.CreatedAt,
			&review.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		reviews = append(reviews, &review)
	}

	return reviews, nil
}

func (m *PostgresDBRepo) CreateBuilding(building *models.Building) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("create_building.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int

	err = stmt.QueryRowContext(ctx,
		building.Name,
		building.Address,
		building.Link,
		time.Now(),
		time.Now(),
	).Scan(&id)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				return fmt.Errorf("a building with the name '%s' already exists", building.Name)
			}
		}
		return err
	}

	building.ID = id

	return nil
}

// Check if the building date and day overlaps with any existing building hours
func (m *PostgresDBRepo) CheckOverlap(building_hour *models.BuildingHour) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_building_hours.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.QueryContext(ctx,
		building_hour.BuildingID,
		building_hour.DayOfWeek,
		building_hour.EndDate,
		building_hour.StartDate,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	// If any rows are returned, there is an overlap
	if rows.Next() {
		return fmt.Errorf("the entered day overlap with existing days")
	}

	return nil
}

func (m *PostgresDBRepo) CreateFavorite(favorite *models.Favorite) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("create_favorite.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int

	err = stmt.QueryRowContext(ctx,
		favorite.UserID,
		favorite.BuildingID,
	).Scan(&id)
	if err != nil {
		return err
	}

	favorite.ID = id

	return nil
}

func (m *PostgresDBRepo) CreateBuildingHours(building_hour *models.BuildingHour) error {
	// Check for overlapping days before creating a new BuildingHour
	err := m.CheckOverlap(building_hour)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("create_building_hours.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int

	err = stmt.QueryRowContext(ctx,
		building_hour.BuildingID,
		building_hour.DayOfWeek,
		building_hour.StartDate,
		building_hour.EndDate,
		building_hour.OpenTime,
		building_hour.CloseTime,
	).Scan(&id)
	if err != nil {
		return err
	}

	building_hour.ID = id

	return nil
}

func (m *PostgresDBRepo) CreateReview(review *models.Review) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("create_review.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int

	err = stmt.QueryRowContext(ctx,
		review.BuildingID,
		review.UserID,
		review.Rating,
		review.Comment,
		time.Now(),
		time.Now(),
	).Scan(&id)
	if err != nil {
		return err
	}

	review.ID = id

	return nil
}

func (m *PostgresDBRepo) UpdateBuilding(id int, building *models.Building) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("update_building.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx,
		building.Name,
		building.Address,
		building.Link,
		time.Now(),
		id,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteBuilding(buildingID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("delete_building.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, buildingID)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteBuildingHours(hourID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("delete_building_hours.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, hourID)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteFavorite(favorite *models.Favorite) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("delete_favorite.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, favorite.UserID, favorite.BuildingID)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteReview(reviewID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("delete_review.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.ExecContext(ctx, reviewID)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) SaveUser(user *models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("create_user.sql")
	if err != nil {
		return err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var id int

	err = stmt.QueryRowContext(ctx,
		user.Username,
		user.Password,
		time.Now(),
		time.Now(),
	).Scan(&id)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				return fmt.Errorf("a user with the username '%s' already exists", user.Username)
			}
		}
		return err
	}

	user.ID = id

	return nil
}

func (m *PostgresDBRepo) GetUserByUsername(username string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query, err := readSQLFile("get_user_by_username.sql")
	if err != nil {
		return nil, err
	}

	stmt, err := m.DB.PrepareContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	user := &models.User{}

	err = stmt.QueryRowContext(ctx, username).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}
