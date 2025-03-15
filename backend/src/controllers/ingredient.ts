import { queryDatabase } from "../db/client";
import { Ingredient } from "../models";

export const getIngredients = async (): Promise<Ingredient[]> => {
    return queryDatabase<Ingredient>('SELECT * FROM Ingredients');
};

export const createIngredient = async (name: string, description: string): Promise<Ingredient> => {
    return queryDatabase<Ingredient>(
        'INSERT INTO Ingredients (Name, Description) VALUES ($1, $2) RETURNING *',
        [name, description]
    ).then(results => results[0]);
};

export const updateIngredient = async (id: number, name: string, description: string): Promise<Ingredient> => {
    return queryDatabase<Ingredient>(
        'UPDATE Ingredients SET Name = $1, Description = $2 WHERE ID = $3 RETURNING *',
        [name, description, id]
    ).then(results => results[0]);
};

export const deleteIngredient = async (id: number): Promise<void> => {
    await queryDatabase<Ingredient>(
        'DELETE FROM Ingredients WHERE ID = $1',
        [id]
    );
};