DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS users;

CREATE TABLE albums(
  id SERIAL primary key,
  dirname VARCHAR(255) NOT NULL,
  displayname VARCHAR(255) NOT NULL,
  albumdesc VARCHAR(560) DEFAULT NULL,
  createdat TIMESTAMP DEFAULT now(),
  updatedat TIMESTAMP DEFAULT now()
);

CREATE TABLE images(
  imgid SERIAL primary key,
  albumid INT,
  imgname VARCHAR(255) DEFAULT NULL,
  imgdesc VARCHAR(560) DEFAULT NULL,
  imgurl VARCHAR(255) NOT NULL,
  createdat TIMESTAMP DEFAULT now(),
  updatedat TIMESTAMP DEFAULT now(),
  FOREIGN KEY(albumid)
    REFERENCES albums(id)
      ON DELETE SET NULL
);

CREATE TABLE users(
  userid SERIAL primary key,
  fname VARCHAR(60) DEFAULT NULL,
  lname VARCHAR(60) DEFAULT NUll,
  email VARCHAR(100) UNIQUE NOT NULL,
  passwordhash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL
);