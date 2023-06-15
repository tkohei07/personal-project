SELECT
    id, name, address, link, is_computer_room, is_reservable_study_room, is_vending_area,
    created_at, updated_at
FROM
    buildings
ORDER BY
    name
