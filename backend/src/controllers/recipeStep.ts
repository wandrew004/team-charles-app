import { queryDatabase } from '../db/client';
import { RecipeStep } from '../models';

export const getRecipeSteps = async (recipeid: number): Promise<RecipeStep[]> => {
    return queryDatabase<RecipeStep>(
        'SELECT * FROM RecipeSteps WHERE RecipeID = $1',
        [recipeid]
    );
};

export const createRecipeStep = async (recipeid: number, stepid: number): Promise<RecipeStep> => {
    return queryDatabase<RecipeStep>(
        'INSERT INTO RecipeSteps (RecipeID, StepID) VALUES ($1, $2)',
        [recipeid, stepid]
    ).then(results => results[0]);
};
export const addStepToRecipe = createRecipeStep;

export const deleteRecipeStep = async (
    recipeid: number, 
    stepid: number
): Promise<void> => {
    await queryDatabase<RecipeStep>(
        'DELETE FROM RecipeSteps WHERE RecipeID = $1 AND StepID = $2',
        [recipeid, stepid]
    );
};
