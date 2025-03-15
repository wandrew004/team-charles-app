import { queryDatabase } from "../db/client";
import { RecipeStep } from "../models";

export const getRecipeSteps = async (recipeid: number): Promise<RecipeStep[]> => {
    return queryDatabase<RecipeStep>(
        'SELECT * FROM RecipeSteps WHERE RecipeID = $1',
        [recipeid]
    );
};

export const addStepToRecipe = async (recipeid: number, stepid: number): Promise<RecipeStep> => {
    return queryDatabase<RecipeStep>(
        'INSERT INTO RecipeSteps (RecipeID, StepID) VALUES ($1, $2)',
        [recipeid, stepid]
    ).then(results => results[0]);
};