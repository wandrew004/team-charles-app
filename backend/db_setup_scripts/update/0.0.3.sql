BEGIN;

-- 1. Create 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. Add 'user_id' to 'recipes'
ALTER TABLE recipes
ADD COLUMN user_id INTEGER,
ADD CONSTRAINT fk_recipes_user
    FOREIGN KEY (user_id) REFERENCES users(id);

-- 3. Add 'user_id' to 'owned_ingredients'
ALTER TABLE owned_ingredients
ADD COLUMN user_id INTEGER,
ADD CONSTRAINT fk_owned_ingredients_user
    FOREIGN KEY (user_id) REFERENCES users(id);

-- 4. Update database_version table
INSERT INTO database_version (version, depends_on)
VALUES ('0.0.3', '0.0.2');

COMMIT;