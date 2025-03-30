BEGIN;

-- 1. Create units table
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('volume', 'weight', 'other'))
);

COMMENT ON TABLE units IS 'Measurement units for ingredients';
COMMENT ON COLUMN units.type IS 'Type of unit: volume, weight, or other';

-- 2. Pre-populate units table with standard cooking units
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

-- 3. Insert distinct units found in the old recipe_ingredients.unit column
INSERT INTO units (name, type)
SELECT DISTINCT unit, 'other'  -- Temporary fallback type
FROM recipe_ingredients
WHERE unit IS NOT NULL
  AND TRIM(unit) <> ''
  AND unit NOT IN (SELECT name FROM units);

-- 4. Alter ingredients table
ALTER TABLE ingredients
    ADD COLUMN standard_unit INTEGER,
    ADD COLUMN density NUMERIC(10, 4),
    ADD CONSTRAINT fk_ingredients_standard_unit FOREIGN KEY (standard_unit) REFERENCES units(id);

COMMENT ON COLUMN ingredients.standard_unit IS 'Default unit for this ingredient (e.g. grams)';
COMMENT ON COLUMN ingredients.density IS 'Used for converting between volume and weight';

-- 5. Alter recipe_ingredients table
ALTER TABLE recipe_ingredients
    ADD COLUMN unit_id INTEGER,
    ADD CONSTRAINT fk_recipe_ingredients_unit FOREIGN KEY (unit_id) REFERENCES units(id);

COMMENT ON COLUMN recipe_ingredients.unit_id IS 'Unit of measurement for the quantity used in a recipe';

-- 6. Migrate data: map old unit (TEXT) → unit_id (FK)
UPDATE recipe_ingredients ri
SET unit_id = u.id
FROM units u
WHERE ri.unit = u.name;

-- 6.2 Drop the unit column
ALTER TABLE recipe_ingredients DROP COLUMN unit;

-- 7. Create owned_ingredients table
CREATE TABLE owned_ingredients (
    ingredient_id INTEGER PRIMARY KEY,
    quantity NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_owned_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

COMMENT ON TABLE owned_ingredients IS 'Tracks what ingredients a user currently owns';
COMMENT ON COLUMN owned_ingredients.quantity IS 'Amount of ingredient available';

-- 8. Update database_version table
INSERT INTO database_version (version, depends_on)
VALUES ('0.0.2', '0.0.1');

COMMIT;
