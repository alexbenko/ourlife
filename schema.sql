DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS images;

CREATE TABLE albums(
  id SERIAL primary key,
  album_name VARCHAR(255) NOT NULL,
  album_desc VARCHAR(560) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE images(
  img_id SERIAL primary key,
  album_id INT,
  img_name VARCHAR(255) DEFAULT NULL,
  img_desc VARCHAR(560) DEFAULT NULL,
  img_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY(album_id)
    REFERENCES albums(id)
      ON DELETE SET NULL
);

CREATE TABLE users(
  userid SERIAL primary key,
  fname VARCHAR(60) NOT NULL,
  lname VARCHAR(60) NOT NUll,
  email VARCHAR(100) UNIQUE NOT NULL,
  pass VARCHAR(255) NOT NULL
);