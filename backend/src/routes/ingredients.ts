import express, { Request, Response, NextFunction } from 'express';
import { getIngredients, createIngredient } from '../controllers/ingredient';

const router = express.Router();

/**
 * @brief endpoint for getting all owned ingredients
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ingredients = await getIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for creating a new ingredient
 */
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description, standardUnit, density } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Ingredient name is required.' });
            return;
        }

        const newIngredient = await createIngredient(name, description, standardUnit, density);

        res.status(201).json(newIngredient);
    } catch (error: any) {
        next(error);
    }
});

export default router;
