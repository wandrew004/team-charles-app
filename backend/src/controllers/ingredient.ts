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

export const deleteIngredient = async (id: number): Promise<void> => {
    await queryDatabase<Ingredient>(
        'DELETE FROM Ingredients WHERE ID = $1',
        [id]
    );
};