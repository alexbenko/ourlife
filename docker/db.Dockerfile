FROM postgres:14.2-bullseye
COPY ./docker/init.sql /docker-entrypoint-initdb.d/