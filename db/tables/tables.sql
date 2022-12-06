CREATE TABLE restaurants (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address_line_1 VARCHAR(50) NOT NULL,
    address_line_2 VARCHAR(50),
    building_name VARCHAR(80),
    country VARCHAR(50) DEFAULT 'Singapore',
    postal_code VARCHAR(6) NOT NULL,
    website VARCHAR(100),
    tel VARCHAR(11),
    description TEXT,
    in_operation BOOLEAN DEFAULT 'true'
);

-- not in use yet
CREATE TABLE restaurant_operating_hours (
    restaurant_id INT NOT NULL PRIMARY KEY REFERENCES restaurants(id),
    mon_day_off BOOLEAN DEFAULT false,
    mon_opening_time TIME,
    mon_closing_time TIME,
    mon_opening_time_2 TIME,
    mon_closing_time_2 TIME,
    tues_day_off BOOLEAN DEFAULT false,
    tues_opening_time TIME,
    tues_closing_time TIME,
    tues_opening_time_2 TIME,
    tues_closing_time_2 TIME,
    wed_day_off BOOLEAN DEFAULT false,
    wed_opening_time TIME,
    wed_closing_time TIME,
    wed_opening_time_2 TIME,
    wed_closing_time_2 TIME,
    thurs_day_off BOOLEAN DEFAULT false,
    thurs_opening_time TIME,
    thurs_closing_time TIME,
    thurs_opening_time_2 TIME,
    thurs_closing_time_2 TIME,
    fri_day_off BOOLEAN DEFAULT false,
    fri_opening_time TIME,
    fri_closing_time TIME,
    fri_opening_time_2 TIME,
    fri_closing_time_2 TIME,
    sat_day_off BOOLEAN DEFAULT false,
    sat_opening_time TIME,
    sat_closing_time TIME,
    sat_opening_time_2 TIME,
    sat_closing_time_2 TIME,
    sun_day_off BOOLEAN DEFAULT false,
    sun_opening_time TIME,
    sun_closing_time TIME,
    sun_opening_time_2 TIME,
    sun_closing_time_2 TIME
);

CREATE TABLE locations (
    location VARCHAR(50) NOT NULL PRIMARY KEY
);

CREATE TABLE restaurant_locations (
    location_id VARCHAR(50) NOT NULL REFERENCES locations(location),
    restaurant_id INT NOT NULL PRIMARY KEY REFERENCES restaurants(id)
);


CREATE TABLE cuisines (
    cuisine VARCHAR(20) NOT NULL PRIMARY KEY
);


CREATE TABLE restaurant_cuisines (
    restaurant_id INT NOT NULL PRIMARY KEY REFERENCES restaurants(id),
    cuisine_1 VARCHAR(20) NOT NULL REFERENCES cuisines(cuisine),
    cuisine_2 VARCHAR(20) NOT NULL REFERENCES cuisines(cuisine),
    cuisine_3 VARCHAR(20) NOT NULL REFERENCES cuisines(cuisine)
);

-- not in use yet
CREATE TABLE tags (
    tag VARCHAR(50) NOT NULL PRIMARY KEY
);

CREATE TABLE restaurant_tags (
    restaurant_id INT NOT NULL PRIMARY KEY REFERENCES restaurants(id),
    tag_1 VARCHAR(50) NOT NULL REFERENCES tags(tag),
    tag_2 VARCHAR(50) NOT NULL REFERENCES tags(tag),
    tag_3 VARCHAR(50) NOT NULL REFERENCES tags(tag),
    tag_4 VARCHAR(50) NOT NULL REFERENCES tags(tag),
    tag_5 VARCHAR(50) NOT NULL REFERENCES tags(tag),
    tag_6 VARCHAR(50) NOT NULL REFERENCES tags(tag)
);


CREATE TABLE restaurant_staff (
    id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'staff',
    resigned BOOLEAN DEFAULT 'false',
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);


-- table not created yet
CREATE TABLE restaurant_media (
    id SERIAL NOT NULL PRIMARY KEY,
    logo VARCHAR(100) NOT NULL,
    image_ambience_1 VARCHAR(100) NOT NULL,
    image_ambience_2 VARCHAR(100),
    image_food_1 VARCHAR(100),
    image_food_2 VARCHAR(100),
    image_food_3 VARCHAR(100),
    image_food_4 VARCHAR(100),
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);


CREATE TABLE restaurant_seats_capacity (
    id SERIAL NOT NULL PRIMARY KEY,
    table_num VARCHAR(2) NOT NULL,
    table_capacity VARCHAR(2) NOT NULL,
    table_occupied BOOLEAN DEFAULT false,
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);

-- not in use yet
CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    account_active BOOLEAN DEFAULT 'true'
);

-- not in use yet
CREATE TABLE reviews (
    id SERIAL NOT NULL PRIMARY KEY,
    rating INT NOT NULL check(rating >= 1 and rating <= 5),
    title VARCHAR(50) NOT NULL,
    review TEXT,
    date TIMESTAMP,
    restaurant_id INT NOT NULL REFERENCES restaurants(id),
    user_id INT NOT NULL REFERENCES users(id)
);