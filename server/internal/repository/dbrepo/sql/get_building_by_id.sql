SELECT
	id, name, address, link, 
	created_at, updated_at
FROM 
	buildings
WHERE
	id = $1
