import { queryDatabase } from "../db/client";
import { RecipeIngredient } from "../models";

export const getRecipeIngredients = async (recipeid: number): Promise<RecipeIngredient[]> => {
    return queryDatabase<RecipeIngredient>(
        'SELECT * FROM RecipeIngredients WHERE RecipeID = $1',
        [recipeid]
    );
};

export const addIngredientToRecipe = async (recipeid: number, ingredientid: number, quantity: number, unit: string): Promise<RecipeIngredient> => {
    return queryDatabase<RecipeIngredient>(
        'INSERT INTO RecipeIngredients (RecipeID, IngredientID, Quantity, Unit) VALUES ($1, $2, $3, $4)',
        [recipeid, ingredientid, quantity, unit]
    ).then(results => results[0]);
};
