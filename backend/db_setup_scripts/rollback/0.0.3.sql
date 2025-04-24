BEGIN;

-- 1. Remove foreign key and column from 'owned_ingredients'
ALTER TABLE owned_ingredients
DROP CONSTRAINT IF EXISTS fk_owned_ingredients_user,
DROP COLUMN IF EXISTS user_id;

-- 2. Remove foreign key and column from 'recipes'
ALTER TABLE recipes
DROP CONSTRAINT IF EXISTS fk_recipes_user,
DROP COLUMN IF EXISTS user_id;

-- 3. Drop 'users' table
DROP TABLE IF EXISTS users;

-- 4. Remove 0.0.3 from the DatabaseVersion Table, fails if something depends on it
DELETE FROM database_version
WHERE Version = '0.0.3';

COMMIT;