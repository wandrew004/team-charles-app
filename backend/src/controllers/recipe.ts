import { queryDatabase } from "../db/client";
import { Recipe } from "../models";

export const getRecipes = async (): Promise<Recipe[]> => {
    return queryDatabase<Recipe>('SELECT * FROM Recipes');
};

export const getRecipeById = async (id: number): Promise<Recipe | null> => {
    return queryDatabase<Recipe>(
        'SELECT * FROM Recipes WHERE ID = $1',
        [id]
    ).then(results => results[0] || null);
};

export const createRecipe = async (name: string, description: string): Promise<Recipe> => {
    return queryDatabase<Recipe>(
        'INSERT INTO Recipes (Name, Description) VALUES ($1, $2) RETURNING *',
        [name, description]
    ).then(results => results[0]);
};

export const deleteRecipe = async (id: number): Promise<void> => {
    await queryDatabase<Recipe>(
        'DELETE FROM Recipes WHERE ID = $1',
        [id]
    );
};
