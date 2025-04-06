import { Router, Request, Response, NextFunction } from 'express';
import { getIngredientsForRecipes } from '../controllers';

const router = Router();

/**
 * @route GET /api/aggregation/ingredients
 * @description Get all ingredients needed for a list of recipes
 * @param {string} recipeIds - Comma-separated list of recipe IDs
 * @returns {RecipeIngredient[]} List of ingredients with quantities
 */
router.get('/ingredients', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { recipeIds } = req.query;
        
        if (!recipeIds || typeof recipeIds !== 'string') {
            res.status(400).json({ error: 'recipeIds must be provided as a comma-separated string' });
            return;
        }

        const numericRecipeIds = recipeIds.split(',').map(id => Number(id.trim()));
        if (numericRecipeIds.some(isNaN)) {
            res.status(400).json({ error: 'All recipe IDs must be numbers' });
            return;
        }

        // Validate that all IDs are positive integers
        if (numericRecipeIds.some(id => !Number.isInteger(id) || id <= 0)) {
            res.status(400).json({ error: 'All recipe IDs must be positive integers' });
            return;
        }

        const ingredients = await getIngredientsForRecipes(numericRecipeIds);
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
});

export default router;
