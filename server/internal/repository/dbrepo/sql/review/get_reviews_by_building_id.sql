SELECT
    r.id, r.building_id, r.user_id, u.username, r.rating, r.comment,
    r.created_at, r.updated_at
FROM
    reviews r
INNER JOIN 
    users u ON r.user_id = u.id
WHERE
    r.building_id = $1
ORDER BY
    r.created_at DESC