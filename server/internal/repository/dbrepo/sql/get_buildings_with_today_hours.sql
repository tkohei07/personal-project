SELECT
    b.id, b.name, b.address, b.link, b.created_at, b.updated_at,
    bh.open_time, bh.close_time,
    COALESCE(AVG(r.rating), 0) AS average_rating
FROM
    buildings b
LEFT JOIN
    building_hours bh ON b.id = bh.building_id
LEFT JOIN
    reviews r ON b.id = r.building_id
WHERE
    bh.day_of_week = $1
    AND NOW()::date BETWEEN bh.start_date AND bh.end_date
GROUP BY
    b.id, bh.open_time, bh.close_time
ORDER BY
    b.name;
