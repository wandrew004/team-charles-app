import { Recipe, Ingredient, Step, RecipeIngredient, RecipeStep, Unit } from '../models/init-models';
import { getIngredientByName, createIngredient } from './ingredient';
import { getUnitByName, createUnit } from './unit';

/**
 * Get all recipes (basic data)
 */
export const getRecipes = async (): Promise<Recipe[]> => {
    return Recipe.findAll({
        attributes: ['id', 'name', 'description'],
    });
};

/**
 * Get all recipes for a specific user (basic data)
 */
export const getUserRecipes = async (userId: number): Promise<Recipe[]> => {
    return Recipe.findAll({
        where: { userId },
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
 * Get a single recipe with associated ingredients and steps for a specific user
 */
export const getUserRecipeById = async (id: number, userId: number): Promise<Recipe | null> => {
    return Recipe.findOne({
        where: { id, userId },
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
 * Create a new recipe for a specific user
 */
export const createUserRecipe = async (
    userId: number,
    name: string,
    description?: string
): Promise<Recipe> => {
    return Recipe.create({
        userId,
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
 * Update a recipe for a specific user
 */
export const updateUserRecipe = async (
    id: number,
    userId: number,
    name: string,
    description?: string
): Promise<void> => {
    await Recipe.update(
        {
            name,
            description,
        },
        {
            where: { id, userId },
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

/**
 * Delete a recipe for a specific user
 */
export const deleteUserRecipe = async (id: number, userId: number): Promise<void> => {
    await Recipe.destroy({
        where: { id, userId },
    });
};

/**
 * Update a recipe with all its relationships (ingredients and steps)
 */
export const updateRecipeWithRelations = async (
    id: number,
    name: string,
    description?: string,
    recipeIngredients?: Array<{
        quantity: string;
        ingredient: {
            name: string;
        };
        unit: {
            name: string;
        };
    }>,
    recipeSteps?: Array<{
        stepId: number;
        step: {
            stepNumber: number;
            stepText: string;
        };
    }>
): Promise<void> => {
    // Start a transaction to ensure all updates are atomic
    const transaction = await Recipe.sequelize!.transaction();

    try {
        // Update basic recipe information
        await Recipe.update(
            {
                name,
                description,
            },
            {
                where: { id },
                transaction,
            }
        );

        // If ingredients are provided, update them
        if (recipeIngredients) {
            // First remove all existing recipe ingredients
            await RecipeIngredient.destroy({
                where: { recipeId: id },
                transaction,
            });

            // Create new recipe ingredients
            for (const ing of recipeIngredients) {
                // Find or create ingredient
                let ingredient = await getIngredientByName(ing.ingredient.name);
                if (!ingredient) {
                    ingredient = await createIngredient(ing.ingredient.name);
                }

                // Find or create unit
                let unit = await getUnitByName(ing.unit.name);
                if (!unit) {
                    unit = await createUnit(ing.unit.name, 'other'); // Default type
                }

                // Create recipe ingredient
                await RecipeIngredient.create({
                    recipeId: id,
                    ingredientId: ingredient.id,
                    quantity: parseFloat(ing.quantity),
                    unitId: unit.id,
                }, { transaction });
            }
        }

        // If steps are provided, update them
        if (recipeSteps) {
            // First remove all existing recipe steps
            await RecipeStep.destroy({
                where: { recipeId: id },
                transaction,
            });

            // Create new steps and recipe steps
            for (const stepData of recipeSteps) {
                // Create or update the step
                let step = await Step.findByPk(stepData.stepId);
                if (!step) {
                    step = await Step.create({
                        stepNumber: stepData.step.stepNumber,
                        stepText: stepData.step.stepText,
                    }, { transaction });
                } else {
                    await step.update({
                        stepNumber: stepData.step.stepNumber,
                        stepText: stepData.step.stepText,
                    }, { transaction });
                }

                // Create recipe step
                await RecipeStep.create({
                    recipeId: id,
                    stepId: step.id,
                }, { transaction });
            }
        }

        // Commit the transaction
        await transaction.commit();
    } catch (error) {
        // If anything fails, rollback the transaction
        await transaction.rollback();
        throw error;
    }
};

/**
 * Update a recipe with all its relationships (ingredients and steps) for a specific user
 */
export const updateUserRecipeWithRelations = async (
    id: number,
    userId: number,
    name: string,
    description?: string,
    recipeIngredients?: Array<{
        quantity: string;
        ingredient: {
            name: string;
        };
        unit: {
            name: string;
        };
    }>,
    recipeSteps?: Array<{
        stepId: number;
        step: {
            stepNumber: number;
            stepText: string;
        };
    }>
): Promise<void> => {
    // Start a transaction to ensure all updates are atomic
    const transaction = await Recipe.sequelize!.transaction();

    try {
        // Update basic recipe information
        await Recipe.update(
            {
                name,
                description,
            },
            {
                where: { id, userId },
                transaction,
            }
        );

        // If ingredients are provided, update them
        if (recipeIngredients) {
            // First remove all existing recipe ingredients
            await RecipeIngredient.destroy({
                where: { recipeId: id },
                transaction,
            });

            // Create new recipe ingredients
            for (const ing of recipeIngredients) {
                // Find or create ingredient
                let ingredient = await getIngredientByName(ing.ingredient.name);
                if (!ingredient) {
                    ingredient = await createIngredient(ing.ingredient.name);
                }

                // Find or create unit
                let unit = await getUnitByName(ing.unit.name);
                if (!unit) {
                    unit = await createUnit(ing.unit.name, 'other'); // Default type
                }

                // Create recipe ingredient
                await RecipeIngredient.create({
                    recipeId: id,
                    ingredientId: ingredient.id,
                    quantity: parseFloat(ing.quantity),
                    unitId: unit.id,
                }, { transaction });
            }
        }

        // If steps are provided, update them
        if (recipeSteps) {
            // First remove all existing recipe steps
            await RecipeStep.destroy({
                where: { recipeId: id },
                transaction,
            });

            // Create new steps and recipe steps
            for (const stepData of recipeSteps) {
                // Create or update the step
                let step = await Step.findByPk(stepData.stepId);
                if (!step) {
                    step = await Step.create({
                        stepNumber: stepData.step.stepNumber,
                        stepText: stepData.step.stepText,
                    }, { transaction });
                } else {
                    await step.update({
                        stepNumber: stepData.step.stepNumber,
                        stepText: stepData.step.stepText,
                    }, { transaction });
                }

                // Create recipe step
                await RecipeStep.create({
                    recipeId: id,
                    stepId: step.id,
                }, { transaction });
            }
        }

        // Commit the transaction
        await transaction.commit();
    } catch (error) {
        // If anything fails, rollback the transaction
        await transaction.rollback();
        throw error;
    }
};
