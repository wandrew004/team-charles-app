BEGIN;

-- 1. Create Units table
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('volume', 'weight'))
);

COMMENT ON TABLE units IS 'Measurement units for ingredients';
COMMENT ON COLUMN units.type IS 'Type of unit: volume or weight';

-- 2. Alter Ingredients table
ALTER TABLE ingredients
    ADD COLUMN standard_unit INTEGER,
    ADD COLUMN density NUMERIC(10, 4),
    ADD CONSTRAINT fk_ingredients_standard_unit FOREIGN KEY (standard_unit) REFERENCES units(id);

COMMENT ON COLUMN ingredients.standard_unit IS 'Default unit for this ingredient (e.g. grams)';
COMMENT ON COLUMN ingredients.density IS 'Used for converting between volume and weight';

-- 3. Alter RecipeIngredients table
ALTER TABLE recipeingredients
    ADD COLUMN unitID INTEGER,
    ADD CONSTRAINT fk_recipeingredients_unit FOREIGN KEY (unitID) REFERENCES units(id);

COMMENT ON COLUMN recipeingredients.unitID IS 'Unit of measurement for the quantity used in a recipe';

-- 4. Create OwnedIngredients table
CREATE TABLE ownedingredients (
    IngredientID INTEGER PRIMARY KEY,
    quantity NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_owned_ingredient FOREIGN KEY (IngredientID) REFERENCES ingredients(id)
);

COMMENT ON TABLE ownedingredients IS 'Tracks what ingredients a user currently owns';
COMMENT ON COLUMN ownedingredients.quantity IS 'Amount of ingredient available';

COMMIT;
