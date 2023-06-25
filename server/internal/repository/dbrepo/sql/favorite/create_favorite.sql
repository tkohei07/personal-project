INSERT INTO 
    user_favorites (user_id, building_id) 
VALUES
    ($1, $2)
RETURNING
    id