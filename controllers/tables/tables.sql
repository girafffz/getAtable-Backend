CREATE TABLE restaurants (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address_line_1 VARCHAR(50) NOT NULL,
    address_line_2 VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Singapore',
    postal_code VARCHAR(6) NOT NULL,
    website VARCHAR(50),
    tel VARCHAR(11),
    in_operation BOOLEAN DEFAULT 'true'
);

-- not in use yet
CREATE TABLE restaurant_operating_hours (
    id SERIAL NOT NULL PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    day_off BOOLEAN DEFAULT false,
    opening_time TIME,
    closing_time TIME,
    opening_time_2 TIME,
    closing_time_2 TIME,
    last_order_time TIME,
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);

-- not in use yet
CREATE TABLE locations (
    location VARCHAR(50) NOT NULL PRIMARY KEY
);

-- not in use yet
CREATE TABLE restaurant_locations (
    id SERIAL NOT NULL PRIMARY KEY,
    location_id VARCHAR(50) NOT NULL REFERENCES locations(location),
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);


CREATE TABLE cuisines (
    cuisine VARCHAR(20) NOT NULL PRIMARY KEY
);


CREATE TABLE restaurant_cuisines (
    id SERIAL NOT NULL PRIMARY KEY,
    cuisine_id VARCHAR(20) NOT NULL REFERENCES cuisines(cuisine),
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
);

-- not in use yet
CREATE TABLE tags (
    tag VARCHAR(50) NOT NULL PRIMARY KEY
);

-- not in use yet
CREATE TABLE restaurant_tags (
    id SERIAL NOT NULL PRIMARY KEY,
    tag_id VARCHAR(50) NOT NULL REFERENCES tags(tag),
    restaurant_id INT NOT NULL REFERENCES restaurants(id)
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
    table_num VARCHAR(2) NOT NULL PRIMARY KEY,
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