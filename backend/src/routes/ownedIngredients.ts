import { Router, Request, Response, NextFunction } from 'express';
import { getOwnedIngredients } from '../controllers/ownedIngredient';

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

export default router;
