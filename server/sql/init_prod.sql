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
