SELECT
    f.id, f.user_id, f.building_id, b.name, f.created_at, f.updated_at
FROM
    user_favorites f 
JOIN
    buildings b 
ON 
    f.building_id = b.id 
WHERE
    f.user_id = $1;
