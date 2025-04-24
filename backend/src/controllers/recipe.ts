import { Recipe, Ingredient, Step, RecipeIngredient, RecipeStep, Unit } from '../models/init-models';

/**
 * Get all recipes (basic data)
 */
export const getRecipes = async (): Promise<Recipe[]> => {
    return Recipe.findAll({
        attributes: ['id', 'name', 'description', 'userId'],
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
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Unit,
                        as: 'unit',
                        attributes: ['id', 'name'],
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
    description?: string,
    userId?: number
): Promise<Recipe> => {
    return Recipe.create({
        name,
        description,
        userId,
    });
};

/**
 * Update a recipe
 */
export const updateRecipe = async (
    id: number,
    name: string,
    description?: string,
    userId?: number
): Promise<void> => {
    await Recipe.update(
        {
            name,
            description,
            userId,
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

/**
 * Update a recipe with all its relationships (ingredients and steps)
 */
export const updateRecipeWithRelations = async (
    id: number,
    name: string,
    description?: string,
    userId?: number,
    recipeIngredients?: Array<{
        quantity: string;
        ingredient: {
            id: number;
            name: string;
        };
        unit: {
            id: number;
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
                userId,
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
                // Create recipe ingredient with the provided IDs
                await RecipeIngredient.create({
                    recipeId: id,
                    ingredientId: ing.ingredient.id,
                    quantity: parseFloat(ing.quantity),
                    unitId: ing.unit.id,
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
