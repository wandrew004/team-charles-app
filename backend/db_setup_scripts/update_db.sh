#!/bin/bash

# Default values
DATABASE="recipehub"
USERNAME=""
HOST=""
PORT="5432"
PASSWORD=""

# Parse options
while getopts "U:d:h:p:P:" opt; do
  case $opt in
    U) USERNAME=$OPTARG ;;
    d) DATABASE=$OPTARG ;;
    h) HOST=$OPTARG ;;
    p) PORT=$OPTARG ;;
    P) PASSWORD=$OPTARG ;;
    *) echo "Usage: $0 -U <username> -d <database> -h <host> -p <port> -P <pg_password>" ; exit 1 ;;
  esac
done

# Check if username was provided
if [ -z "$USERNAME" ] || [ -z "$HOST" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 -U <username> -d <database> -h <host> -p <port> -P <pg_password>"
  exit 1
fi

# Create database_version table if it doesn't exist
PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -p "$PORT" -c '
CREATE TABLE IF NOT EXISTS database_version (
  version TEXT PRIMARY KEY,
  depends_on TEXT,
  applied_at TIMESTAMPTZ DEFAULT now()
);'

# Step 3: Get current version from the database_version table
CURRENT_VERSION=$(PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -p "$PORT" -d "$DATABASE" -Atc "SELECT version FROM database_version ORDER BY applied_at DESC LIMIT 1;")
echo "Current database version: ${CURRENT_VERSION:-none}"

# Step 4: Apply newer updates
apply_version() {
  local version="$1"

  # Check if already applied
  local is_applied
  is_applied=$(PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -p "$PORT" -d "$DATABASE" -Atc \
    "SELECT 1 FROM database_version WHERE version = '$version' AND applied_at IS NOT NULL LIMIT 1;")

  if [[ "$is_applied" == "1" ]]; then
    echo "✔ $version already applied."
    return
  fi

  # Get dependency
  local depends_on
  depends_on=$(PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -p "$PORT" -d "$DATABASE" -Atc \
    "SELECT depends_on FROM database_version WHERE version = '$version' LIMIT 1;")

  # Recursively apply dependency first
  if [[ -n "$depends_on" ]]; then
    apply_version "$depends_on"
  fi

  # Find and apply the actual SQL file
  local filepath
  filepath=$(find db_setup_scripts/update -type f -name "$version.sql" | head -n 1)

  if [[ -z "$filepath" ]]; then
    echo "❌ SQL file for version $version not found!"
    return 1
  fi

  echo "⚙️ Applying version $version..."
  PGPASSWORD="$PASSWORD" psql -U "$USERNAME" -h "$HOST" -p "$PORT" -d "$DATABASE" -f "$filepath"
}

# Loop through all version files and apply them if needed
for file in $(ls db_setup_scripts/update/*.sql | sort -V); do
  version=$(basename "$file" .sql)
  apply_version "$version"
done
