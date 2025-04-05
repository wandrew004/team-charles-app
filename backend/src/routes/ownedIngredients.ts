import { Router, Request, Response, NextFunction } from 'express';
import { getOwnedIngredients, createOwnedIngredient, getOwnedIngredientById, updateOwnedIngredient } from '../controllers/ownedIngredient';

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
 * @brief endpoint for creating a new owned ingredient or updating an existing one
 */
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { ingredientId, quantity } = req.body;
        if (!ingredientId || quantity === undefined) {
            res.status(400).json({ error: 'ingredientId and quantity are required' });
            return;
        }

        // Ensure quantity is a number
        const numericQuantity = Number(quantity);
        if (isNaN(numericQuantity)) {
            res.status(400).json({ error: 'quantity must be a valid number' });
            return;
        }

        // Check if ingredient is already owned
        const existingIngredient = await getOwnedIngredientById(ingredientId);
        if (existingIngredient) {
            // Update the quantity by adding the new quantity to the existing one
            await updateOwnedIngredient(ingredientId, numericQuantity);
            const updatedIngredient = await getOwnedIngredientById(ingredientId);
            res.status(200).json({ 
                message: 'Ingredient quantity updated', 
                ingredientId, 
                newQuantity: updatedIngredient?.quantity 
            });
            return;
        }

        // If ingredient doesn't exist, create a new one
        const ownedIngredient = await createOwnedIngredient(ingredientId, numericQuantity);
        res.status(201).json(ownedIngredient);
    } catch (error) {
        next(error);
    }
});

export default router;
