SELECT
    r.id, r.building_id, b.name, r.user_id,
    u.username, r.rating, r.comment,
    r.created_at, r.updated_at
FROM
    reviews r
INNER JOIN
    buildings b
ON
    r.building_id = b.id
INNER JOIN
    users u
ON
    r.user_id = u.id
WHERE
    r.user_id = $1
ORDER BY
    r.created_at DESC