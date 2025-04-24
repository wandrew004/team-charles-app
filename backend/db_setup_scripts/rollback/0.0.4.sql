BEGIN;

-- 1. Drop the composite primary key
ALTER TABLE owned_ingredients
DROP CONSTRAINT owned_ingredients_pkey;

-- 2. Restore the original primary key
ALTER TABLE owned_ingredients
ADD PRIMARY KEY (ingredient_id);

-- 3. Remove the default user
DELETE FROM users
WHERE id = -1;

UPDATE owned_ingredients
SET user_id = NULL
WHERE user_id = -1;

UPDATE recipes
SET user_id = NULL
WHERE user_id = -1;

-- 4. Remove the version entry
DELETE FROM database_version
WHERE version = '0.0.4';

COMMIT; 