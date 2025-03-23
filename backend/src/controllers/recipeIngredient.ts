import { queryDatabase } from '../db/client';
import { RecipeIngredient } from '../models';

export const getRecipeIngredients = async (recipeid: number): Promise<RecipeIngredient[]> => {
    return queryDatabase<RecipeIngredient>(
        'SELECT * FROM RecipeIngredients WHERE RecipeID = $1',
        [recipeid]
    );
};

export const createRecipeIngredient = async (recipeid: number, ingredientid: number, quantity: number, unit: string): Promise<RecipeIngredient> => {
    return queryDatabase<RecipeIngredient>(
        'INSERT INTO RecipeIngredients (RecipeID, IngredientID, Quantity, Unit) VALUES ($1, $2, $3, $4)',
        [recipeid, ingredientid, quantity, unit]
    ).then(results => results[0]);
};
export const addIngredientToRecipe = createRecipeIngredient;

export const updateRecipeIngredient = async (
    recipeid: number, 
    ingredientid: number, 
    quantity: number, 
    unit: string
): Promise<RecipeIngredient> => {
    return queryDatabase<RecipeIngredient>(
        'UPDATE RecipeIngredients SET Quantity = $1, Unit = $2 WHERE RecipeID = $3 AND IngredientID = $4 RETURNING *',
        [quantity, unit, recipeid, ingredientid]
    ).then(results => results[0]);
};

export const deleteRecipeIngredient = async (
    recipeid: number, 
    ingredientid: number
): Promise<void> => {
    await queryDatabase<RecipeIngredient>(
        'DELETE FROM RecipeIngredients WHERE RecipeID = $1 AND IngredientID = $2',
        [recipeid, ingredientid]
    );
};
