import { Router, Request, Response, NextFunction } from 'express';
import { extractRecipeFromText } from '../controllers/aiRecipe';

const router = Router();

/**
 * @brief endpoint for extracting recipe data from text
 */
router.post('/extract', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contentType = req.headers['content-type'];
        let recipeText: string;

        if (contentType?.includes('text/plain')) {
            recipeText = req.body as string;
        } else if (contentType?.includes('application/json')) {
            recipeText = req.body.recipeText;
        } else {
            res.status(400).json({ error: 'Content-Type must be text/plain or application/json' });
            return;
        }

        if (!recipeText) {
            res.status(400).json({ error: 'recipeText is required' });
            return;
        }

        const recipeData = await extractRecipeFromText(recipeText);
        res.status(200).json(recipeData);
    } catch (error) {
        next(error);
    }
});

export default router; 