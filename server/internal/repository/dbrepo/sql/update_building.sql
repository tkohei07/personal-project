UPDATE
    buildings
SET
    name = $1, address = $2, link = $3, updated_at = $4
WHERE
    id = $5
RETURNING
    id
    