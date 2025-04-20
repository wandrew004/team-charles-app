import { OwnedIngredient, Ingredient, Unit } from '../models/init-models';

/**
 * Get all owned ingredients, optionally with associated Ingredient info.
 */
export const getOwnedIngredients = async (): Promise<OwnedIngredient[]> => {
    return OwnedIngredient.findAll({
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                include: [
                    {
                        model: Unit,
                        as: 'standardUnitUnit',
                        attributes: ['id', 'name', 'type']
                    }
                ],
                attributes: ['name', 'description', 'standardUnit', 'density']
            }
        ]
    });
};

/**
 * Get a single owned ingredient by ingredient ID.
 */
export const getOwnedIngredientById = async (
    ingredientId: number,
    userId: number
): Promise<OwnedIngredient | null> => {
    return OwnedIngredient.findOne({
        where: {
            ingredientId,
            userId
        },
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                attributes: ['name', 'description', 'standard_unit', 'density'],
            },
        ]
    });
};

/**
 * Create a new owned ingredient.
 */
export const createOwnedIngredient = async (
    ingredientId: number,
    quantity: number,
    userId: number
): Promise<OwnedIngredient> => {
    return OwnedIngredient.create({
        ingredientId,
        quantity,
        userId
    });
};

/**
 * Update the quantity of an owned ingredient.
 */
export const updateOwnedIngredient = async (
    ingredientId: number,
    quantity: number,
    userId: number
): Promise<void> => {
    await OwnedIngredient.update(
        { quantity },
        {
            where: { ingredientId, userId },
            returning: true,
        }
    );
};

/**
 * Delete an owned ingredient.
 */
export const deleteOwnedIngredient = async (
    ingredientId: number,
    userId: number
): Promise<void> => {
    await OwnedIngredient.destroy({
        where: { ingredientId, userId },
    });
};
