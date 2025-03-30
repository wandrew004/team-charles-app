import { step, recipestep } from '../models/init-models'; // Adjust path if needed

export const getStepsForRecipe = async (recipeid: number): Promise<step[]> => {
    return step.findAll({
        include: [
            {
                model: recipestep,
                where: { recipeid },
                attributes: [], // We only want step data
            },
        ],
    });
};

export const createStep = async (
    stepnumber: number,
    steptext: string
): Promise<step> => {
    return step.create({
        stepnumber,
        steptext,
    });
};

export const updateStep = async (
    id: number,
    stepnumber: number,
    steptext: string
): Promise<step | null> => {
    const [_, updated] = await step.update(
        {
            stepnumber,
            steptext,
        },
        {
            where: { id },
            returning: true,
        }
    );
    return updated[0] || null;
};

export const deleteStep = async (id: number): Promise<void> => {
    await step.destroy({
        where: { id },
    });
};
