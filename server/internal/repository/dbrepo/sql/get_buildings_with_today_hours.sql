SELECT
    b.id, b.name, b.address, b.link, b.created_at, b.updated_at,
    bh.open_time, bh.close_time
FROM
    buildings b
LEFT JOIN
    building_hours bh ON b.id = bh.building_id
WHERE
    bh.day_of_week = $1
    AND NOW()::date BETWEEN bh.start_date AND bh.end_date
ORDER BY
    b.name