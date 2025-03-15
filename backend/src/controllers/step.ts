import { queryDatabase } from "../db/client";
import { Step } from "../models";

export const getStepsForRecipe = async (recipeid: number): Promise<Step[]> => {
    return queryDatabase<Step>(
        'SELECT s.* FROM Steps AS s INNER JOIN RecipeSteps AS rs ON s.StepID = rs.StepID WHERE rs.RecipeID = $1',
        [recipeid]
    );
};

export const createStep = async (stepNumber: number, stepText: string): Promise<Step> => {
    return queryDatabase<Step>(
        'INSERT INTO Steps (StepNumber, StepText) VALUES ($1, $2) RETURNING *',
        [stepNumber, stepText]
    ).then(results => results[0]);
};

export const deleteStep = async (id: number): Promise<void> => {
    await queryDatabase<Step>('DELETE FROM Steps WHERE ID = $1', [id]);
};
