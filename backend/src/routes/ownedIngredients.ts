import { Router, Request, Response, NextFunction } from 'express';
import { getOwnedIngredients, createOwnedIngredient, getOwnedIngredientById, updateOwnedIngredient, deleteOwnedIngredient } from '../controllers/ownedIngredient';

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
            const existingQuantity: number = Number(existingIngredient.quantity);
            await updateOwnedIngredient(ingredientId, existingQuantity + numericQuantity);
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

/**
 * @brief endpoint for deleting an owned ingredient
 */
router.delete('/:ingredientId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ingredientId = Number(req.params.ingredientId);
        if (isNaN(ingredientId)) {
            res.status(400).json({ error: 'Invalid ingredient ID' });
            return;
        }

        await deleteOwnedIngredient(ingredientId);
        res.status(200).json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for deleting a specified quantity of an owned ingredient
 */
router.delete('/:ingredientId/quantity', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const ingredientId = Number(req.params.ingredientId);
        const { quantity } = req.body;

        if (isNaN(ingredientId)) {
            res.status(400).json({ error: 'Invalid ingredient ID' });
            return;
        }

        if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            res.status(400).json({ error: 'Valid quantity is required' });
            return;
        }

        const numericQuantity = Number(quantity);
        const existingIngredient = await getOwnedIngredientById(ingredientId);

        if (!existingIngredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }

        const newQuantity = existingIngredient.quantity - numericQuantity;

        if (newQuantity <= 0) {
            // If the new quantity would be 0 or negative, delete the ingredient entirely
            await deleteOwnedIngredient(ingredientId);
            res.status(200).json({ 
                message: 'Ingredient deleted completely', 
                ingredientId 
            });
        } else {
            // Update the quantity
            await updateOwnedIngredient(ingredientId, newQuantity);
            res.status(200).json({ 
                message: 'Ingredient quantity updated', 
                ingredientId, 
                newQuantity 
            });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
