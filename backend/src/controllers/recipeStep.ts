import { RecipeStep, Step, Recipe } from '../models/init-models';

/**
 * Get all steps for a recipe, including step number and text
 */
export const getStepsForRecipe = async (recipeId: number): Promise<Step[]> => {
    const recipeSteps = await RecipeStep.findAll({
        where: { recipeId },
        include: [
            {
                model: Step,
                as: 'step',
                attributes: ['stepNumber', 'stepText'],
            },
        ],
    });

    return recipeSteps.map(rs => rs.step);
};

/**
 * Add a step to a recipe
 */
export const addStepToRecipe = async (
    recipeId: number,
    stepId: number
): Promise<RecipeStep> => {
    return RecipeStep.create({
        recipeId,
        stepId,
    });
};

/**
 * Update the step ID for a recipe step (if needed)
 */
export const updateRecipeStep = async (
    recipeId: number,
    oldStepId: number,
    newStepId: number
): Promise<void> => {
    await RecipeStep.update(
        { stepId: newStepId },
        {
            where: {
                recipeId,
                stepId: oldStepId,
            },
            returning: true,
        }
    );
};

/**
 * Remove a step from a recipe
 */
export const deleteRecipeStep = async (
    recipeId: number,
    stepId: number
): Promise<void> => {
    await RecipeStep.destroy({
        where: {
            recipeId,
            stepId,
        },
    });
};
