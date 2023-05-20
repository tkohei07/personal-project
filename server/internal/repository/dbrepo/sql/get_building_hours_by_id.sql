SELECT
	id, building_id, day_of_week, start_date, end_date,
	open_time, close_time
FROM
    building_hours
WHERE
    building_id = $1
ORDER BY 
    start_date, day_of_week ASC