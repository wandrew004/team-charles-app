BEGIN;

-- 1. Create default user for existing records
INSERT INTO users (id, username, password)
VALUES (-1, 'default_user', 'default_password');

-- 2. Update existing records to use the default user
UPDATE owned_ingredients
SET user_id = -1
WHERE user_id IS NULL;

UPDATE recipes
SET user_id = -1
WHERE user_id IS NULL;

-- 3. Drop existing primary key constraint from owned_ingredients
ALTER TABLE owned_ingredients
DROP CONSTRAINT owned_ingredients_pkey;

-- 4. Create new composite primary key including user_id
ALTER TABLE owned_ingredients
ADD PRIMARY KEY (ingredient_id, user_id);

-- 5. Update database_version table
INSERT INTO database_version (version, depends_on)
VALUES ('0.0.4', '0.0.3');

COMMIT; 