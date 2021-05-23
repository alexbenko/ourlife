DROP TABLE IF EXISTS albums;

CREATE TABLE albums(
  album_id SERIAL primary key,
  album_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)

CREATE TABLE images(
  img_id SERIAL primary key,
  album_id INT
  img_name VARCHAR(255) DEFAULT NULL,
  img_desc VARCHAR(560) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_album
    FOREIGN KEY(album_id)
      REFERENCES albums(album_id)
)