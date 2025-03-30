BEGIN;

-- 1. Create Units table
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('volume', 'weight', 'other'))
);

COMMENT ON TABLE units IS 'Measurement units for ingredients';
COMMENT ON COLUMN units.type IS 'Type of unit: volume, weight, or other';

-- 2. Pre-populate Units table with standard cooking units
INSERT INTO units (name, type) VALUES
    ('g', 'weight'),
    ('kg', 'weight'),
    ('oz', 'weight'),
    ('lb', 'weight'),
    ('mg', 'weight'),
    ('ml', 'volume'),
    ('l', 'volume'),
    ('tsp', 'volume'),
    ('tbsp', 'volume'),
    ('cup', 'volume'),
    ('quart', 'volume'),
    ('pint', 'volume'),
    ('fl oz', 'volume'),
    ('dash', 'volume'),
    ('pinch', 'volume'),
    ('piece', 'other'),
    ('slice', 'other'),
    ('can', 'other'),
    ('bottle', 'other'),
    ('unit', 'other');

-- 3. Insert distinct units found in the old RecipeIngredients.unit column
-- This assumes the column exists and contains raw string units (e.g. 'g', 'ml')
INSERT INTO units (name, type)
SELECT DISTINCT unit, 'other'  -- Temporary fallback type
FROM recipeingredients
WHERE unit IS NOT NULL
  AND TRIM(unit) <> ''
  AND unit NOT IN (SELECT name FROM units);

-- 4. Alter Ingredients table
ALTER TABLE ingredients
    ADD COLUMN standard_unit INTEGER,
    ADD COLUMN density NUMERIC(10, 4),
    ADD CONSTRAINT fk_ingredients_standard_unit FOREIGN KEY (standard_unit) REFERENCES units(id);

COMMENT ON COLUMN ingredients.standard_unit IS 'Default unit for this ingredient (e.g. grams)';
COMMENT ON COLUMN ingredients.density IS 'Used for converting between volume and weight';

-- 5. Alter RecipeIngredients table
ALTER TABLE recipeingredients
    ADD COLUMN unitID INTEGER,
    ADD CONSTRAINT fk_recipeingredients_unit FOREIGN KEY (unitID) REFERENCES units(id);

COMMENT ON COLUMN recipeingredients.unitID IS 'Unit of measurement for the quantity used in a recipe';

-- 6. Migrate data: map old unit (TEXT) → unitID (FK)
UPDATE recipeingredients ri
SET unitID = u.id
FROM units u
WHERE ri.unit = u.name;

-- 6.2 Drop the unit column from the 
ALTER TABLE recipeingredients DROP COLUMN unit;

-- 7. Create OwnedIngredients table
CREATE TABLE ownedingredients (
    IngredientID INTEGER PRIMARY KEY,
    quantity NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_owned_ingredient FOREIGN KEY (IngredientID) REFERENCES ingredients(id)
);

COMMENT ON TABLE ownedingredients IS 'Tracks what ingredients a user currently owns';
COMMENT ON COLUMN ownedingredients.quantity IS 'Amount of ingredient available';

-- 8. Update DatabaseVersion table
INSERT INTO DatabaseVersion (Version, DependsOn)
VALUES ('0.0.2', '0.0.1');

COMMIT;
