CREATE TABLE IF NOT EXISTS buildings (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    address     VARCHAR(255) NOT NULL,
    link        VARCHAR(255) NOT NULL,
    is_computer_room BOOLEAN NOT NULL DEFAULT FALSE,
    is_reservable_study_room BOOLEAN NOT NULL DEFAULT FALSE,
    is_vending_area BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS building_hours (
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    open_time   TIME NOT NULL,
    close_time  TIME NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_favorites (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    building_id INTEGER NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE,
    UNIQUE (user_id, building_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO buildings (name, address, link, is_computer_room, is_reservable_study_room, is_vending_area) 
VALUES 
    ('Ebling Library', 'Health Sciences Learning Center 750 Highland Ave. Madison WI 53705', 'https://ebling.library.wisc.edu/', true, false, true),
    ('Steenbock Library', '550 Babcock Dr. Madison WI 53706', 'https://www.library.wisc.edu/steenbock/', false, true, true);