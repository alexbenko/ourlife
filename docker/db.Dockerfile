FROM arm64v8/postgres:10.4
COPY ./docker/init.sql /docker-entrypoint-initdb.d/