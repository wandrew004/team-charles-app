BEGIN;

CREATE TABLE IF NOT EXISTS Recipes (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

CREATE TABLE IF NOT EXISTS Ingredients (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

CREATE TABLE IF NOT EXISTS Steps (
    ID SERIAL PRIMARY KEY,
    StepNumber INT NOT NULL,
    StepText TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS RecipeIngredients (
    RecipeID INT,
    IngredientID INT,
    Quantity DECIMAL(10,2),
    Unit VARCHAR(50),
    PRIMARY KEY (RecipeID, IngredientID),
    FOREIGN KEY (RecipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (IngredientID) REFERENCES Ingredients(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipeSteps (
    RecipeID INT,
    StepID INT,
    PRIMARY KEY (RecipeID, StepID),
    FOREIGN KEY (RecipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (StepID) REFERENCES Steps(ID) ON DELETE CASCADE
);

-- Optional: create database_version table if it might not exist
CREATE TABLE IF NOT EXISTS database_version (
    version VARCHAR(50) PRIMARY KEY,
    depends_on VARCHAR(50)
);

INSERT INTO database_version (version, depends_on)
VALUES ('0.0.1', NULL);

COMMIT;
