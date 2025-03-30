import { ownedingredient, ingredient } from '../models/init-models'; // Adjust import paths as needed

export const getOwnedIngredients = async (): Promise<ownedingredient[]> => {
    return ownedingredient.findAll({
        include: [
            {
                model: ingredient,
                attributes: ['name', 'description', 'standard_unit', 'density'], // Customize fields if needed
            },
        ],
    });
};

export const getOwnedIngredientById = async (
    ingredientid: number
): Promise<ownedingredient | null> => {
    return ownedingredient.findByPk(ingredientid, {
        include: [
            {
                model: ingredient,
                attributes: ['name', 'description', 'standard_unit', 'density'],
            },
        ],
    });
};

export const createOwnedIngredient = async (
    ingredientid: number,
    quantity: number
): Promise<ownedingredient> => {
    return ownedingredient.create({
        ingredientid,
        quantity,
    });
};

export const updateOwnedIngredient = async (
    ingredientid: number,
    quantity: number
): Promise<ownedingredient | null> => {
    const [_, updated] = await ownedingredient.update(
        {
            quantity,
        },
        {
            where: { ingredientid },
            returning: true,
        }
    );
    return updated[0] || null;
};

export const deleteOwnedIngredient = async (
    ingredientid: number
): Promise<void> => {
    await ownedingredient.destroy({
        where: { ingredientid },
    });
};
