import { Router, Request, Response, NextFunction } from 'express';
import { getOwnedIngredients, createOwnedIngredient } from '../controllers/ownedIngredient';

const router = Router();

/**
 * @brief endpoint for getting all owned ingredients
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingredients = await getOwnedIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for creating a new owned ingredient
 */
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { ingredientId, quantity } = req.body;
        if (!ingredientId || quantity === undefined) {
            res.status(400).json({ error: 'ingredientId and quantity are required' });
            return;
        }
        const ownedIngredient = await createOwnedIngredient(ingredientId, quantity);
        res.status(201).json(ownedIngredient);
    } catch (error) {
        next(error);
    }
});

export default router;
