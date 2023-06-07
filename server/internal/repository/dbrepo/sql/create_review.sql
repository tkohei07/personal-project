INSERT INTO reviews (building_id, user_id, rating, comment, created_at, updated_at)
VALUES 
    ($1, $2, $3, $4, $5, $6)
RETURNING
    id
