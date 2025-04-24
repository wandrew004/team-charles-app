#!/bin/bash

# Default values
DATABASE="postgres"
USERNAME=""
HOST=""

# Parse options
while getopts "U:d:h:" opt; do
  case $opt in
    U) USERNAME=$OPTARG ;;  # Set the username
    d) DATABASE=$OPTARG ;;  # Set the database to connect to
    h) HOST=$OPTARG ;;
    *) echo "Usage: $0 -U <username> -d <database> -h <host>" ; exit 1 ;;
  esac
done

# Check if username was provided
if [[ -z "$USERNAME" || -z "$HOST" ]]; then
  echo "Usage: $0 -U <username> -d <database> -h <host>"
  exit 1
fi

# Step 1: Connect to the default database (postgres or other) to create recipehub
psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -c "DROP DATABASE IF EXISTS recipehub;"
psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -c "CREATE DATABASE recipehub;"

# Step 2: Apply updates
bash ./db_setup_scripts/update_db.sh -U "$USERNAME" -d recipehub -h "$HOST"
