#!/bin/sh

# Default values
DATABASE="recipehub"
USERNAME=""
HOST=""

# Parse options
while getopts "U:d:h:" opt; do
  case "$opt" in
    U) USERNAME=$OPTARG ;;
    d) DATABASE=$OPTARG ;;
    h) HOST=$OPTARG ;;
    *) echo "Usage: $0 -U <username> -d <database> -h <host>" ; exit 1 ;;
  esac
done

# Check if username was provided
if [ -z "$USERNAME" ] || [ -z "$HOST" ]; then
  echo "Usage: $0 -U <username> -d <database> -h <host>"
  exit 1
fi

# Create database_version table if it doesn't exist
psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -c '
CREATE TABLE IF NOT EXISTS database_version (
  version TEXT PRIMARY KEY,
  depends_on TEXT,
  applied_at TIMESTAMPTZ DEFAULT now()
);'

# Step 3: Get current version from the database_version table
CURRENT_VERSION=$(psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -Atc "SELECT version FROM database_version ORDER BY applied_at DESC LIMIT 1;")
echo "Current database version: ${CURRENT_VERSION:-none}"

# Apply version function (POSIX-compliant version)
apply_version() {
  version="$1"

  # Check if already applied
  is_applied=$(psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -Atc \
    "SELECT 1 FROM database_version WHERE version = '$version' AND applied_at IS NOT NULL LIMIT 1;")

  if [ "$is_applied" = "1" ]; then
    echo "✔ $version already applied."
    return
  fi

  # Get dependency
  local depends_on
  depends_on=$(psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -Atc \
    "SELECT depends_on FROM database_version WHERE version = '$version' LIMIT 1;")

  # Recursively apply dependency first
  if [ -n "$depends_on" ]; then
    apply_version "$depends_on"
  fi

  # Find and apply the actual SQL file
  filepath=$(find db_setup_scripts/update -type f -name "$version.sql" | head -n 1)

  if [ -z "$filepath" ]; then
    echo "❌ SQL file for version $version not found!"
    return 1
  fi

  echo "⚙️ Applying version $version..."
  psql -U "$USERNAME" -h "$HOST" -d "$DATABASE" -f "$filepath"
}

# Loop through all version files and apply them if needed
for file in $(ls db_setup_scripts/update/*.sql | sort); do
  version=$(basename "$file" .sql)
  apply_version "$version"
done