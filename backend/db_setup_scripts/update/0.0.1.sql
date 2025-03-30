BEGIN;

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    step_number INT NOT NULL,
    step_text TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE recipe_steps (
    recipe_id INT,
    step_id INT,
    PRIMARY KEY (recipe_id, step_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

INSERT INTO database_version (version, depends_on)
VALUES ('0.0.1', NULL);

COMMIT;
