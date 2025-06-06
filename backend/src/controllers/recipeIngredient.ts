import { RecipeIngredient, Ingredient, Unit, Recipe } from '../models/init-models';

/**
 * Get all ingredients for a recipe, including name and unit name
 */
export const getIngredientsForRecipe = async (recipeId: number): Promise<RecipeIngredient[]> => {
    return RecipeIngredient.findAll({
        where: { recipeId },
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                attributes: ['name'],
            },
            {
                model: Unit,
                as: 'unit',
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
): Promise<void> => {
    await RecipeIngredient.update(
        { quantity, unitId },
        {
            where: { recipeId, ingredientId },
            returning: true,
        }
    );
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

/**
 * Get all ingredients for multiple recipes, including name and unit name
 * Aggregates quantities for the same ingredients
 */
export const getIngredientsForRecipes = async (recipeIds: number[]): Promise<RecipeIngredient[]> => {
    return RecipeIngredient.findAll({
        where: { recipeId: recipeIds },
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                attributes: ['id', 'name'],
            },
            {
                model: Unit,
                as: 'unit',
                attributes: ['id', 'name'],
            },
            {
                model: Recipe,
                as: 'recipe',
                attributes: ['id', 'name'],
            }
        ],
        attributes: ['quantity', 'recipeId'],
    });
};  
