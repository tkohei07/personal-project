SELECT 
    1 
FROM
    building_hours 
WHERE
    building_id = $1 AND day_of_week = $2 
	AND (start_date <= $3 AND end_date >= $4)