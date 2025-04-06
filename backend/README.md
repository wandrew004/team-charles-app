# RecipeHub Backend

# Setup

1. Install PostgreSQL https://www.postgresql.org/
2. `sh db_setup_scripts/init_db.sh -U username -d postgres`
    - username is a user that you set up for postgres, postgres is the default database for management
    - if updating your database, use `sh db_setup_scripts/update_db.sh -U username -d recipehub` instead
3. create and add details to `.env` based on `.env.example`
4. `npm install`
5. `npm run start` or `npm run dev`

# Tests
Tests created using Jest and Supertest
1. `npm run test`
2. `npm run lint`
3. `npx eslint . --fix`
    - fixing any style issues

# Making database updates
1. Add a new update/rollback scripts formatted as x.y.z.sql (x.y.z being the version number)
2. Format the update/rollback scripts based on the previous ones, making sure to add a dependency to the previous version
3. If starting from scratch, run `sh db_setup_scripts/init_db.sh -U username -d postgres`
4. If updating from a previous version, run `sh db_setup_scripts/update_db.sh -U username -d recipehub`
    - if you did not previous have the `database_version` table, please run the following commands in the psql shell beforehand
```
CREATE TABLE IF NOT EXISTS database_version (
    version TEXT PRIMARY KEY,
    depends_on TEXT,
    applied_at TIMESTAMPTZ DEFAULT now()
);
```
```
-- fill x.y.z with your current version and xx.yy.zz with the version preceding it (or NULL)
INSERT INTO database_version (version, depends_on)
VALUES ('x.y.z', 'xx.yy.zz');
```
5. Update .env if necessary and run sequelize (`npm run sequelize`) to generate the models
6. Create controllers/tests for the models
    - Note: using ChatGPT is very good for this, just enter the model code and ask it to generate a controller, then enter the controller code and ask it to generate tests.
