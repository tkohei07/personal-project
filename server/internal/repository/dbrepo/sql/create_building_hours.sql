INSERT INTO building_hours
    (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
    ($1, $2, $3, $4, $5, $6)
RETURNING id
