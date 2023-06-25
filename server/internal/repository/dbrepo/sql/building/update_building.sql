UPDATE
    buildings
SET
    name = $1, address = $2, link = $3, is_computer_room = $4, is_reservable_study_room = $5, is_vending_area = $6, updated_at = $7
WHERE
    id = $8
RETURNING
    id
    