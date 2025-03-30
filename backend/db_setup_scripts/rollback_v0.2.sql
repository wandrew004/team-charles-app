BEGIN;

-- 1. Drop OwnedIngredients table
DROP TABLE IF EXISTS ownedingredients;

-- 2. Remove unit_id column from RecipeIngredients
ALTER TABLE recipeingredients
    DROP CONSTRAINT IF EXISTS fk_recipeingredients_unit,
    DROP COLUMN IF EXISTS unitID;

-- 3. Remove standard_unit and density from Ingredients
ALTER TABLE ingredients
    DROP CONSTRAINT IF EXISTS fk_ingredients_standard_unit,
    DROP COLUMN IF EXISTS standard_unit,
    DROP COLUMN IF EXISTS density;

-- 4. Drop Units table
DROP TABLE IF EXISTS units;

COMMIT;
