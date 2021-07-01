#!/bin/bash
# start up script to set postgres password when setting up with docker
if [ -f .env ]; then
  export $(cat .env)
  sudo psql -U photo -d photobooth -c "ALTER USER photo WITH PASSWORD '$PG_PASSWORD';"
fi