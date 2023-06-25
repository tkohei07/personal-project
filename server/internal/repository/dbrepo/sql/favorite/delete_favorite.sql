DELETE FROM 
    user_favorites
WHERE 
    user_id = $1 AND building_id = $2
