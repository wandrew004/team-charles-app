import { Step, Recipe } from '../models/init-models';

/**
 * Get all steps
 */
export const getSteps = async (): Promise<Step[]> => {
    return Step.findAll({
        order: [['stepNumber', 'ASC']],
    });
};

/**
 * Get a step by ID
 */
export const getStepById = async (id: number): Promise<Step | null> => {
    return Step.findByPk(id);
};

// /**
//  * Get all steps for a specific recipe (through the RecipeStep join table)
//  */
// export const getStepsForRecipe = async (recipeId: number): Promise<Step[]> => {
//     return Step.findAll({
//         include: [
//             {
//                 model: Recipe,
//                 where: { id: recipeId },
//                 through: { attributes: [] },
//                 attributes: [], // Exclude Recipe fields, only want Step data
//             },
//         ],
//         order: [['stepNumber', 'ASC']],
//     });
// };

/**
 * Create a step
 */
export const createStep = async (
    stepNumber: number,
    stepText: string
): Promise<Step> => {
    return Step.create({
        stepNumber,
        stepText,
    });
};

/**
 * Update a step
 */
export const updateStep = async (
    id: number,
    stepNumber: number,
    stepText: string
): Promise<void> => {
    await Step.update(
        {
            stepNumber,
            stepText,
        },
        {
            where: { id },
            returning: true,
        }
    );
};

/**
 * Delete a step
 */
export const deleteStep = async (id: number): Promise<void> => {
    await Step.destroy({
        where: { id },
    });
};
