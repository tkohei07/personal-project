INSERT INTO buildings
    (name, address, link, created_at, updated_at)
VALUES
    ($1, $2, $3, $4, $5)
RETURNING id
