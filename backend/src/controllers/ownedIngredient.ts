import { OwnedIngredient, Ingredient } from '../models/init-models';

/**
 * Get all owned ingredients, optionally with associated Ingredient info.
 */
export const getOwnedIngredients = async (): Promise<OwnedIngredient[]> => {
    return OwnedIngredient.findAll({
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                attributes: ['name', 'description', 'standard_unit', 'density'],
            },
        ],
    });
};

/**
 * Get a single owned ingredient by ingredient ID.
 */
export const getOwnedIngredientById = async (
    ingredientId: number
): Promise<OwnedIngredient | null> => {
    return OwnedIngredient.findByPk(ingredientId, {
        include: [
            {
                model: Ingredient,
                attributes: ['name', 'description', 'standard_unit', 'density'],
            },
        ],
    });
};

/**
 * Create a new owned ingredient.
 */
export const createOwnedIngredient = async (
    ingredientId: number,
    quantity: number
): Promise<OwnedIngredient> => {
    return OwnedIngredient.create({
        ingredientId,
        quantity,
    });
};

/**
 * Update the quantity of an owned ingredient.
 */
export const updateOwnedIngredient = async (
    ingredientId: number,
    quantity: number
): Promise<void> => {
    await OwnedIngredient.update(
        { quantity },
        {
            where: { ingredientId },
            returning: true,
        }
    );
};

/**
 * Delete an owned ingredient.
 */
export const deleteOwnedIngredient = async (
    ingredientId: number
): Promise<void> => {
    await OwnedIngredient.destroy({
        where: { ingredientId },
    });
};
