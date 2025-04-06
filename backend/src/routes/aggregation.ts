import { Router, Request, Response, NextFunction } from 'express';
import { getIngredientsForRecipes } from '../controllers';

const router = Router();

/**
 * @route GET /api/aggregation/ingredients
 * @description Get all ingredients needed for a list of recipes
 * @param {number[]} recipeIds - List of recipe IDs
 * @returns {RecipeIngredient[]} List of ingredients with quantities
 */
router.get('/ingredients', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { recipeIds } = req.query;
        
        if (!recipeIds || !Array.isArray(recipeIds)) {
            res.status(400).json({ error: 'recipeIds must be provided as an array' });
            return;
        }

        const numericRecipeIds = recipeIds.map(id => Number(id));
        if (numericRecipeIds.some(isNaN)) {
            res.status(400).json({ error: 'All recipe IDs must be numbers' });
            return;
        }

        const ingredients = await getIngredientsForRecipes(numericRecipeIds);
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
});

export default router;
