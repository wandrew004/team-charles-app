import { Router, Request, Response, NextFunction } from 'express';
import { 
    getRecipes, 
    getRecipeById, 
    createRecipe, 
    deleteRecipe,
    updateRecipeWithRelations,
    createStep,
    addIngredientToRecipe,
    addStepToRecipe,
} from '../controllers';
import { Recipe } from '../models/recipe';
import { RecipeFormData } from '../types/recipeFormData';

const router = Router();

/**
 * @brief endpoint for getting the ids and names of all recipes
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes: Recipe[] = await getRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting a specific recipe
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recipeId = parseInt(req.params.id, 10);

        if (isNaN(recipeId)) {
            res.status(400).json({ error: 'Invalid recipe ID' });
            return;
        }

        const recipe = await getRecipeById(recipeId);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        res.status(200).json(recipe);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for saving a recipe
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipeData: RecipeFormData = req.body;

        // Create the base recipe
        const recipe = await createRecipe(recipeData.name, recipeData.description);

        // Associate ingredients with recipe
        await Promise.all(
            recipeData.ingredients.map(async (ingredientData) => {
                await addIngredientToRecipe(
                    recipe.id,
                    ingredientData.ingredientId,
                    ingredientData.quantity,
                    ingredientData.unitId
                );
            })
        );

        // Create steps and associate with recipe
        await Promise.all(
            recipeData.steps.map(async (stepData) => {
                const step = await createStep(stepData.stepNumber, stepData.stepText);
                await addStepToRecipe(recipe.id, step.id);
            })
        );

        res.status(200).json({ message: 'Recipe added successfully', recipeId: recipe.id });
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for updating a recipe with all its relationships
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.body.id);
        const { name, description, recipeIngredients, recipeSteps } = req.body;

        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid recipe ID' });
            return;
        }

        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        await updateRecipeWithRelations(id, name, description, recipeIngredients, recipeSteps);
        const updatedRecipe = await getRecipeById(id);
        res.status(200).json(updatedRecipe);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for deleting a recipe
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid recipe ID' });
            return;
        }

        await deleteRecipe(id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router; 