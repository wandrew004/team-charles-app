#!/bin/bash

# Default values
DATABASE="postgres"
USERNAME=""
EXPORT_FILE="recipehub_export.sql"

# Parse options
while getopts "U:d:" opt; do
  case $opt in
    U) USERNAME=$OPTARG ;;  # Set the username
    d) DATABASE=$OPTARG ;;  # Set the database to connect to
    *) echo "Usage: $0 -U <username> -d <database>" ; exit 1 ;;
  esac
done

# Check if username was provided
if [ -z "$USERNAME" ]; then
  echo "Usage: $0 -U <username> -d <database>"
  exit 1
fi

# Step 1: Export existing data from recipehub (if it exists)
echo "Exporting data from existing recipehub database..."
pg_dump -U "$USERNAME" -d recipehub --data-only --inserts -T 'DatabaseVersion' -f "$EXPORT_FILE"

# Step 1.5: Add ON CONFLICT DO NOTHING to each INSERT statement
echo "Patching INSERT statements to avoid duplicate key errors..."
awk '
  BEGIN { insert_stmt = "" }
  {
    insert_stmt = insert_stmt $0 "\n"
    if ($0 ~ /\);$/) {
      gsub(/\);$/, ") ON CONFLICT DO NOTHING;")
      printf "%s", insert_stmt
      insert_stmt = ""
    }
  }
' "$EXPORT_FILE" > "${EXPORT_FILE}.patched" && mv "${EXPORT_FILE}.patched" "$EXPORT_FILE"


# Step 2: Drop and recreate the recipehub database
echo "Dropping and recreating the recipehub database..."
psql -U "$USERNAME" -d "$DATABASE" -c "DROP DATABASE IF EXISTS recipehub;"
psql -U "$USERNAME" -d "$DATABASE" -c "CREATE DATABASE recipehub;"

# Step 3: Run database initialization or update scripts
echo "Running database setup..."
bash ./db_setup_scripts/update_db.sh -U "$USERNAME" -d recipehub

# Step 4: Re-import the data
echo "Re-importing data into the new recipehub database..."
psql -U "$USERNAME" -d recipehub -f "$EXPORT_FILE"

# Step 5: Cleanup export file
echo "Cleaning up export file..."
rm -f "$EXPORT_FILE"

echo "✅"
