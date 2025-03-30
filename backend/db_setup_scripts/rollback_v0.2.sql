BEGIN;

-- 1. Recreate unit column in RecipeIngredients (before dropping the Units table)
ALTER TABLE recipeingredients
    ADD COLUMN unit TEXT;

-- 2. Restore unit text values from Units table via unitID
UPDATE recipeingredients ri
SET unit = u.name
FROM units u
WHERE ri.unitID = u.id;

-- 3. Remove unitID column from RecipeIngredients
ALTER TABLE recipeingredients
    DROP CONSTRAINT IF EXISTS fk_recipeingredients_unit,
    DROP COLUMN IF EXISTS unitID;

-- 4. Remove standard_unit and density from Ingredients
ALTER TABLE ingredients
    DROP CONSTRAINT IF EXISTS fk_ingredients_standard_unit,
    DROP COLUMN IF EXISTS standard_unit,
    DROP COLUMN IF EXISTS density;

-- 5. Drop OwnedIngredients table
DROP TABLE IF EXISTS ownedingredients;

-- 6. Drop Units table
DROP TABLE IF EXISTS units;

COMMIT;
