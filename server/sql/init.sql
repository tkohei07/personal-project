CREATE TABLE IF NOT EXISTS buildings (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    address     VARCHAR(255) NOT NULL,
    link        VARCHAR(255) NOT NULL,
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

-- for testing
INSERT INTO buildings (name, address, link) 
VALUES 
    ('Ebling Library', '4220 Chamberlin Hall 1150 University Ave.', 'https://ebling.library.wisc.edu/'),
    ('Steenbock Library', '550 Babcock Dr.', 'https://www.library.wisc.edu/steenbock/');

-- Library 1
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(1, 0, '2023-01-01', '2023-12-31', '10:00:00', '18:00:00'), -- Sunday
(1, 1, '2023-01-01', '2023-12-31', '08:00:00', '20:00:00'), -- Monday
(1, 2, '2023-01-01', '2023-12-31', '08:00:00', '20:00:00'), -- Tuesday
(1, 3, '2023-01-01', '2023-12-31', '08:00:00', '20:00:00'), -- Wednesday
(1, 4, '2023-01-01', '2023-12-31', '08:00:00', '20:00:00'), -- Thursday
(1, 5, '2023-01-01', '2023-12-31', '08:00:00', '20:00:00'), -- Friday
(1, 6, '2023-01-01', '2023-12-31', '10:00:00', '18:00:00'); -- Saturday

-- Library 2
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(2, 0, '2023-01-01', '2023-12-31', '12:00:00', '18:00:00'), -- Sunday
(2, 1, '2023-01-01', '2023-12-31', '09:00:00', '21:00:00'), -- Monday
(2, 2, '2023-01-01', '2023-12-31', '09:00:00', '21:00:00'), -- Tuesday
(2, 3, '2023-01-01', '2023-12-31', '09:00:00', '21:00:00'), -- Wednesday
(2, 4, '2023-01-01', '2023-12-31', '09:00:00', '21:00:00'), -- Thursday
(2, 5, '2023-01-01', '2023-12-31', '09:00:00', '21:00:00'), -- Friday
(2, 6, '2023-01-01', '2023-12-31', '10:00:00', '18:00:00'); -- Saturday

-- insert users for test
INSERT INTO users (username, password)
VALUES
('test1', 'test1'),
('test2', 'test2');

-- Reviews
INSERT INTO reviews (building_id, user_id, rating, comment)
VALUES
(1, 1, 5, 'I love this library!'),
(1, 2, 2, 'I hate this library!'),
(2, 1, 5, 'I love this library!'),
(2, 2, 2, 'I hate this library!');
