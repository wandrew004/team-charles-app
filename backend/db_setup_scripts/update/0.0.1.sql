CREATE TABLE Recipes (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

CREATE TABLE Ingredients (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

CREATE TABLE Steps (
    ID SERIAL PRIMARY KEY,
    StepNumber INT NOT NULL,
    StepText TEXT NOT NULL
);

CREATE TABLE RecipeIngredients (
    RecipeID INT,
    IngredientID INT,
    Quantity DECIMAL(10,2),
    Unit VARCHAR(50),
    PRIMARY KEY (RecipeID, IngredientID),
    FOREIGN KEY (RecipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (IngredientID) REFERENCES Ingredients(ID) ON DELETE CASCADE
);

CREATE TABLE RecipeSteps (
    RecipeID INT,
    StepID INT,
    PRIMARY KEY (RecipeID, StepID),
    FOREIGN KEY (RecipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (StepID) REFERENCES Steps(ID) ON DELETE CASCADE
);

INSERT INTO DatabaseVersion (Version, DependsOn)
VALUES ('0.0.1', NULL);
