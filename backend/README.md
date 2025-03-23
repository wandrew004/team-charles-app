# RecipeHub Backend

# Setup

1. Install PostgreSQL https://www.postgresql.org/download/
2. Create a PostgreSQL user https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04
3. `sh db_setup_scripts/init_db.sh -U username -d postgres`
    - username is a user that you set up for postgres, postgres is the default database for management
4. create and add details to `.env` based on `.env.example`
5. `npm install`
6. `npm run start` or `npm run dev`