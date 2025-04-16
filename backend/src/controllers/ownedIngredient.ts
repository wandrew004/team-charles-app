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
 * Get all owned ingredients for a specific user, optionally with associated Ingredient info.
 */
export const getUserOwnedIngredients = async (userId: number): Promise<OwnedIngredient[]> => {
    return OwnedIngredient.findAll({
        where: { userId },
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
    ingredientId: number
): Promise<OwnedIngredient | null> => {
    return OwnedIngredient.findByPk(ingredientId, {
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
 * Get a single owned ingredient by ingredient ID for a specific user.
 */
export const getUserOwnedIngredientById = async (
    ingredientId: number,
    userId: number
): Promise<OwnedIngredient | null> => {
    return OwnedIngredient.findOne({
        where: { ingredientId, userId },
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
 * Create a new owned ingredient for a specific user.
 */
export const createUserOwnedIngredient = async (
    userId: number,
    ingredientId: number,
    quantity: number
): Promise<OwnedIngredient> => {
    return OwnedIngredient.create({
        userId,
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
 * Update the quantity of an owned ingredient for a specific user.
 */
export const updateUserOwnedIngredient = async (
    ingredientId: number,
    userId: number,
    quantity: number
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
    ingredientId: number
): Promise<void> => {
    await OwnedIngredient.destroy({
        where: { ingredientId },
    });
};

/**
 * Delete an owned ingredient for a specific user.
 */
export const deleteUserOwnedIngredient = async (
    ingredientId: number,
    userId: number
): Promise<void> => {
    await OwnedIngredient.destroy({
        where: { ingredientId, userId },
    });
};
