import { recipestep } from '../models/init-models';

export const getRecipeSteps = async (recipeid: number): Promise<recipestep[]> => {
    return recipestep.findAll({
        where: {
            recipeid,
        },
    });
};

export const createRecipeStep = async (
    recipeid: number,
    stepid: number
): Promise<recipestep> => {
    return recipestep.create({
        recipeid,
        stepid,
    });
};

export const addStepToRecipe = createRecipeStep;

export const updateRecipeStep = async (
    recipeid: number,
    oldStepid: number,
    newStepid: number
): Promise<recipestep | null> => {
    const [_, updated] = await recipestep.update(
        { stepid: newStepid },
        {
            where: {
                recipeid,
                stepid: oldStepid,
            },
            returning: true,
        }
    );
    return updated[0] || null;
};

export const deleteRecipeStep = async (
    recipeid: number,
    stepid: number
): Promise<void> => {
    await recipestep.destroy({
        where: {
            recipeid,
            stepid,
        },
    });
};
