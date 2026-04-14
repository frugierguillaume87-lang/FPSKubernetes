
DROP IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    created_at DATE NOT NULL
);

DROP IF EXISTS scores;
CREATE TABLE scores(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    score int not null,
    wave_reached int not null,
    created_at date not null,
    Foreign Key (user_id) REFERENCES users(id)
);

DROP IF EXISTS saves;
CREATE TABLE saves(
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    json_data TEXT NOT NULL,
    Foreign Key (user_id) REFERENCES users(id)
);

DROP IF EXISTS token_users;
CREATE TABLE token_users(
    id SERIAL PRIMARY KEY,
    user_token TEXT NOT NULL,
    expired bool NOT NULL,
    user_id int UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);