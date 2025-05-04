#!/bin/bash

# Default values
DATABASE="postgres"
USERNAME=""
HOST="localhost"
PORT="5432"
PASSWORD=""

# Parse options
while getopts "U:d:h:p:P:" opt; do
  case $opt in
    U) USERNAME=$OPTARG ;;  # Set the username
    d) DATABASE=$OPTARG ;;  # Set the database to connect to
    h) HOST=$OPTARG ;;
    p) PORT=$OPTARG ;;
    P) PASSWORD=$OPTARG ;;
    *) echo "Usage: $0 -U <username> -d <database> -h <host> -p <pg_port> -P <pg_password>" ; exit 1 ;;
  esac
done

# Check if username was provided
if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 -U <username> -d <database> -h <host> -p <pg_port> -P <pg_password>"
  exit 1
fi

# Step 1: Connect to the default database (postgres or other) to create recipehub
PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -p "$PORT" -c "DROP DATABASE IF EXISTS recipehub;"
PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -p "$PORT" -c "CREATE DATABASE recipehub;"

# Step 2: Apply updates
bash ./db_setup_scripts/update_db.sh -U "$USERNAME" -d recipehub -h "$HOST" -p "$PORT" -P "$PASSWORD"
