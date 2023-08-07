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
    ('AMP Library', '4220 Chamberlin Hall 1150 University Ave. Madison WI 53706', 'https://www.library.wisc.edu/amp/', false, false, false),
    ('AOSS Library', '1225 W. Dayton St. Madison WI 53706', 'https://library.ssec.wisc.edu/', false, false, true),
    ('Art Library', '1800 Engineering Dr. Madison WI 53706', 'https://www.library.wisc.edu/art/', false, false, true),
    ('Business Library', '975 University Ave. Madison WI 53706', 'https://www.library.wisc.edu/business', true, true, true),
    ('College Library', '600 N. Park St. Madison WI 53706', 'https://www.library.wisc.edu/college/', true, true, true),
    ('Ebling Library', 'Health Sciences Learning Center 750 Highland Ave. Madison WI 53705', 'https://ebling.library.wisc.edu/', true, false, true),
    ('Geology and Geophysics Library', '1215 W. Dayton St. Madison WI 53706', 'https://www.library.wisc.edu/geology', false, false, true),
    ('Law Library', '975 Bascom Mall Madison WI 53706', 'https://library.law.wisc.edu/', true, true, false),
    ('Memorial Library', '728 State St. Madison WI 53706', 'https://www.library.wisc.edu/memorial', true, true, true),
    ('MERIT Library', '225 N. Mills St. Madison WI 53706', 'https://merit.education.wisc.edu/', false, false, true),
    ('Social Work Library', '1350 University Ave. Madison WI 53706', 'https://www.library.wisc.edu/socialwork', false, false, true),
    ('Special Collections', '976 Memorial Library 728 State St. Madison WI 53706', 'https://www.library.wisc.edu/specialcollections/', false, false, false),
    ('Steenbock Library', '550 Babcock Dr. Madison WI 53706', 'https://www.library.wisc.edu/steenbock/', false, true, true),
    ('Wisconsin Water Library', '1975 Willow Dr. Madison WI 53706', 'https://waterlibrary.aqua.wisc.edu/', false, false, false);

-- AMP Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(1, 1, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Monday
(1, 2, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Tuesday
(1, 3, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Wednesday
(1, 4, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Thursday
(1, 5, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'); -- Friday

-- AOSS Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(2, 1, '2023-01-01', '2023-12-31', '11:00:00', '15:00:00'), -- Monday
(2, 2, '2023-01-01', '2023-12-31', '11:00:00', '15:00:00'), -- Tuesday
(2, 3, '2023-01-01', '2023-12-31', '11:00:00', '15:00:00'), -- Wednesday
(2, 4, '2023-01-01', '2023-12-31', '11:00:00', '15:00:00'), -- Thursday
(2, 5, '2023-01-01', '2023-12-31', '11:00:00', '15:00:00'); -- Friday

-- Art Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(3, 1, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Monday
(3, 2, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Tuesday
(3, 3, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Wednesday
(3, 4, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Thursday
(3, 5, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'); -- Friday

-- Business Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(4, 1, '2023-05-13', '2023-09-05', '09:00:00', '16:00:00'), -- Monday
(4, 2, '2023-05-13', '2023-09-05', '09:00:00', '16:00:00'), -- Tuesday
(4, 3, '2023-05-13', '2023-09-05', '09:00:00', '16:00:00'), -- Wednesday
(4, 4, '2023-05-13', '2023-09-05', '09:00:00', '16:00:00'), -- Thursday
(4, 5, '2023-05-13', '2023-09-05', '09:00:00', '16:00:00'); -- Friday

-- College library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(5, 0, '2023-05-22', '2023-08-13', '11:00:00', '21:00:00'), -- Sunday
(5, 1, '2023-05-22', '2023-08-13', '08:00:00', '21:00:00'), -- Monday
(5, 2, '2023-05-22', '2023-08-13', '08:00:00', '21:00:00'), -- Tuesday
(5, 3, '2023-05-22', '2023-08-13', '08:00:00', '21:00:00'), -- Wednesday
(5, 4, '2023-05-22', '2023-08-13', '08:00:00', '21:00:00'), -- Thursday
(5, 5, '2023-05-22', '2023-08-13', '08:00:00', '18:00:00'), -- Friday
(5, 6, '2023-05-22', '2023-08-13', '11:00:00', '18:00:00'); -- Saturday

-- Ebling Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(6, 1, '2023-01-01', '2023-12-31', '09:00:00', '17:00:00'), -- Monday
(6, 2, '2023-01-01', '2023-12-31', '09:00:00', '17:00:00'), -- Tuesday
(6, 3, '2023-01-01', '2023-12-31', '09:00:00', '17:00:00'), -- Wednesday
(6, 4, '2023-01-01', '2023-12-31', '09:00:00', '17:00:00'), -- Thursday
(6, 5, '2023-01-01', '2023-12-31', '09:00:00', '17:00:00'); -- Friday

-- Geology and Geophysics Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(7, 1, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Monday
(7, 2, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Tuesday
(7, 3, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Wednesday
(7, 4, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'), -- Thursday
(7, 5, '2023-05-13', '2023-09-05', '11:00:00', '16:00:00'); -- Friday

-- Law Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(8, 0, '2023-05-30', '2023-08-27', '10:00:00', '22:00:00'), -- Sunday
(8, 1, '2023-05-30', '2023-08-27', '08:30:00', '22:00:00'), -- Monday
(8, 2, '2023-05-30', '2023-08-27', '08:30:00', '22:00:00'), -- Tuesday
(8, 3, '2023-05-30', '2023-08-27', '08:30:00', '22:00:00'), -- Wednesday
(8, 4, '2023-05-30', '2023-08-27', '08:30:00', '22:00:00'), -- Thursday
(8, 5, '2023-05-30', '2023-08-27', '08:30:00', '18:00:00'), -- Friday
(8, 6, '2023-05-30', '2023-08-27', '10:00:00', '18:00:00'); -- Saturday

-- Memorial Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(9, 0, '2023-05-22', '2023-08-13', '10:00:00', '21:00:00'), -- Sunday
(9, 1, '2023-05-22', '2023-08-13', '08:30:00', '21:00:00'), -- Monday
(9, 2, '2023-05-22', '2023-08-13', '08:30:00', '21:00:00'), -- Tuesday
(9, 3, '2023-05-22', '2023-08-13', '08:30:00', '21:00:00'), -- Wednesday
(9, 4, '2023-05-22', '2023-08-13', '08:30:00', '21:00:00'), -- Thursday
(9, 5, '2023-05-22', '2023-08-13', '08:30:00', '21:00:00'), -- Friday
(9, 6, '2023-05-22', '2023-08-13', '10:00:00', '21:00:00'); -- Saturday

-- MERIT Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(10, 1, '2023-01-01', '2023-12-31', '08:00:00', '17:00:00'), -- Monday
(10, 2, '2023-01-01', '2023-12-31', '08:00:00', '17:00:00'), -- Tuesday
(10, 3, '2023-01-01', '2023-12-31', '08:00:00', '17:00:00'), -- Wednesday
(10, 4, '2023-01-01', '2023-12-31', '08:00:00', '17:00:00'), -- Thursday
(10, 5, '2023-01-01', '2023-12-31', '08:00:00', '17:00:00'); -- Friday

-- Social Work Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(11, 1, '2023-05-22', '2023-08-13', '10:00:00', '16:00:00'), -- Monday
(11, 2, '2023-05-22', '2023-08-13', '10:00:00', '16:00:00'), -- Tuesday
(11, 3, '2023-05-22', '2023-08-13', '10:00:00', '16:00:00'), -- Wednesday
(11, 4, '2023-05-22', '2023-08-13', '10:00:00', '16:00:00'), -- Thursday
(11, 5, '2023-05-22', '2023-08-13', '10:00:00', '16:00:00'); -- Friday

-- Special Collections
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(12, 1, '2023-01-23', '2023-09-05', '09:00:00', '17:00:00'), -- Monday
(12, 2, '2023-01-23', '2023-09-05', '09:00:00', '17:00:00'), -- Tuesday
(12, 3, '2023-01-23', '2023-09-05', '09:00:00', '17:00:00'), -- Wednesday
(12, 4, '2023-01-23', '2023-09-05', '09:00:00', '17:00:00'), -- Thursday
(12, 5, '2023-01-23', '2023-09-05', '09:00:00', '17:00:00'); -- Friday

-- Steenbock Library
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(12, 1, '2023-05-13', '2023-09-05', '09:00:00', '17:00:00'), -- Monday
(12, 2, '2023-05-13', '2023-09-05', '09:00:00', '17:00:00'), -- Tuesday
(12, 3, '2023-05-13', '2023-09-05', '09:00:00', '17:00:00'), -- Wednesday
(12, 4, '2023-05-13', '2023-09-05', '09:00:00', '17:00:00'), -- Thursday
(12, 5, '2023-05-13', '2023-09-05', '09:00:00', '17:00:00'); -- Friday

-- Wisconsin Water Library
-- Monday-Wednesday
INSERT INTO building_hours (building_id, day_of_week, start_date, end_date, open_time, close_time)
VALUES
(13, 1, '2023-01-01', '2023-12-31', '09:00:00', '16:30:00'), -- Monday
(13, 2, '2023-01-01', '2023-12-31', '09:00:00', '16:30:00'), -- Tuesday
(13, 3, '2023-01-01', '2023-12-31', '09:00:00', '16:30:00'); -- Wednesday
