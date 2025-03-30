import { RecipeIngredient, Ingredient, Recipe, Unit } from '../models/init-models';

/**
 * Get all ingredients for a recipe, including name and unit name
 */
export const getIngredientsForRecipe = async (recipeId: number): Promise<RecipeIngredient[]> => {
    return RecipeIngredient.findAll({
        where: { recipeId },
        include: [
            {
                model: Ingredient,
                attributes: ['name'],
            },
            {
                model: Unit,
                attributes: ['name'],
            },
        ],
        attributes: ['quantity'],
    });
};

/**
 * Create a new recipe ingredient
 */
export const createRecipeIngredient = async (
    recipeId: number,
    ingredientId: number,
    quantity?: number,
    unitId?: number
): Promise<RecipeIngredient> => {
    return RecipeIngredient.create({
        recipeId,
        ingredientId,
        quantity,
        unitId,
    });
};

/**
 * Update an existing recipe ingredient
 */
export const updateRecipeIngredient = async (
    recipeId: number,
    ingredientId: number,
    quantity?: number,
    unitId?: number
): Promise<RecipeIngredient | null> => {
    const [_, updated] = await RecipeIngredient.update(
        { quantity, unitId },
        {
            where: { recipeId, ingredientId },
            returning: true,
        }
    );

    return updated[0] || null;
};

/**
 * Delete a recipe ingredient
 */
export const deleteRecipeIngredient = async (
    recipeId: number,
    ingredientId: number
): Promise<void> => {
    await RecipeIngredient.destroy({
        where: {
            recipeId,
            ingredientId,
        },
    });
};

export const addIngredientToRecipe = async (
    recipeId: number,
    ingredientId: number,
    quantity: number,
    unitId: number
): Promise<RecipeIngredient> => {
    return RecipeIngredient.create({
        recipeId,
        ingredientId,
        quantity,
        unitId,
    });
};  
