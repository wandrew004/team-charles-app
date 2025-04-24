#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $PG_HOST -p $PG_PORT -U $PG_USER; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

# Initialize the database
if [ "$REINIT_DB" = "true" ] || ! PGPASSWORD="$PG_PASSWORD" psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname='recipehub'" | grep -q 1; then
    # Initialize the database
    echo "Initializing database..."
    echo "db_setup_scripts/init_db.sh -U $PG_USER -d $PG_DB -h $PG_HOST -p $PG_PORT -P $PG_PASSWORD"
    sh db_setup_scripts/init_db.sh -U $PG_USER -d $PG_DB -h $PG_HOST -p $PG_PORT -P $PG_PASSWORD

    echo "Seeding database..."
    if npm run seed; then
      echo "Seeding completed successfully."
    else
      echo "Seeding failed. Continuing to start the application."
  fi
fi

# Start the application
echo "Starting the application..."
exec npm run dev