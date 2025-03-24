# RecipeHub Backend

# Setup

1. Install PostgreSQL https://www.postgresql.org/
2. `sh db_setup_scripts/init_db.sh -U username -d postgres`
    - username is a user that you set up for postgres, postgres is the default database for management
3. create and add details to `.env` based on `.env.example`
4. `npm install`
5. `npm run start` or `npm run dev`

# Tests
Tests created using Jest and Supertest
1. `npm run test`
2. `npm run lint`
3. `npx eslint . --fix`
    - fixing any style issues