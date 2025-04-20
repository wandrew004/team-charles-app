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
import { User } from 'models/init-models';

const router = Router();

/**
 * @brief endpoint for getting the ids and names of all recipes
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes: Recipe[] = await getRecipes();
        const user = req.user as User | undefined;
        const filteredRecipes = recipes.filter((recipe) => recipe.userId === user?.id || !recipe.userId || recipe.userId === -1);
        res.status(200).json(filteredRecipes);
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

        const user = req.user as User | undefined;
        if (recipe.userId && recipe.userId !== user?.id) {
            res.status(403).json({ error: 'You are not authorized to access this recipe' });
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
        const user = req.user as User | undefined;
        const recipe = await createRecipe(recipeData.name, recipeData.description, user?.id);

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
        const recipeId = parseInt(req.params.id, 10);
        const { name, description, recipeIngredients, recipeSteps } = req.body;

        if (isNaN(recipeId)) {
            res.status(400).json({ error: 'Invalid recipe ID' });
            return;
        }

        const recipe = await getRecipeById(recipeId);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        const user = req.user as User | undefined;
        if (!recipe.userId || recipe.userId !== user?.id) {
            res.status(403).json({ error: 'You are not authorized to access this recipe' });
            return;
        }

        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        await updateRecipeWithRelations(recipeId, name, description, recipeIngredients, recipeSteps);
        const updatedRecipe = await getRecipeById(recipeId);
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

        const user = req.user as User | undefined;
        if (!recipe.userId || recipe.userId !== user?.id) {
            res.status(403).json({ error: 'You are not authorized to access this recipe' });
            return;
        }

        await deleteRecipe(recipeId);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router; 