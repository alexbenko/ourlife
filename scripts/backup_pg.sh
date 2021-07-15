#!/bin/bash
sudo docker-compose exec postgres bash
if [ -f .env ]; then
  # load environment variables into bash script
  export $(cat .env)
  pg_dump $PG_DB -U PG_USER > /backups/db_backup.bak
else
  echo "No .env file."
fi