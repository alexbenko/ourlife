#!/bin/bash
if [ -f .env ]; then
  # load environment variables into bash script
  export $(cat .env)
  pg_dump $PG_DB > db_backup.bak
else
  echo "No .env file."
fi