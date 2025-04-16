-- Rollback version 0.0.1

-- Step 1: Remove the version entry first (to avoid FK issues)
DELETE FROM database_version WHERE Version = '0.0.1';

-- Step 2: Drop dependent tables first (child → parent order)
DROP TABLE IF EXISTS RecipeSteps;
DROP TABLE IF EXISTS RecipeIngredients;
DROP TABLE IF EXISTS Steps;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Recipes;
