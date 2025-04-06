import { Recipe, Ingredient, Step, RecipeIngredient, RecipeStep, Unit } from '../models/init-models';

/**
 * Get all recipes (basic data)
 */
export const getRecipes = async (): Promise<Recipe[]> => {
    return Recipe.findAll({
        attributes: ['id', 'name', 'description'],
    });
};

/**
 * Get a single recipe with associated ingredients and steps
 */
export const getRecipeById = async (id: number): Promise<Recipe | null> => {
    return Recipe.findByPk(id, {
        include: [
            {
                model: RecipeIngredient,
                as: 'recipeIngredients',
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
            },
            {
                model: RecipeStep,
                as: 'recipeSteps',
                include: [
                    {
                        model: Step,
                        as: 'step',
                        attributes: ['stepNumber', 'stepText'],
                    },
                ],
            },
        ],
    });
};

/**
 * Create a new recipe
 */
export const createRecipe = async (
    name: string,
    description?: string
): Promise<Recipe> => {
    return Recipe.create({
        name,
        description,
    });
};

/**
 * Update a recipe
 */
export const updateRecipe = async (
    id: number,
    name: string,
    description?: string
): Promise<void> => {
    await Recipe.update(
        {
            name,
            description,
        },
        {
            where: { id },
            returning: true,
        }
    );
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (id: number): Promise<void> => {
    await Recipe.destroy({
        where: { id },
    });
};
