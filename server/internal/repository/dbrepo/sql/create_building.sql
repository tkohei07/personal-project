INSERT INTO buildings
    (name, address, link, is_computer_room, is_reservable_study_room, is_vending_area, created_at, updated_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id
