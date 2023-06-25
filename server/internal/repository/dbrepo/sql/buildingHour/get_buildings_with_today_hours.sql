SELECT
    b.id, b.name, b.address, b.link, b.is_computer_room, b.is_reservable_study_room, b.is_vending_area, b.created_at, b.updated_at,
    bh.open_time, bh.close_time,
    COALESCE(AVG(r.rating), 0) AS average_rating
FROM
    buildings b
LEFT JOIN
    building_hours bh ON b.id = bh.building_id 
    AND bh.day_of_week = $1 
    AND NOW()::date BETWEEN bh.start_date AND bh.end_date
LEFT JOIN
    reviews r ON b.id = r.building_id
GROUP BY
    b.id, bh.open_time, bh.close_time
ORDER BY
    b.name;
