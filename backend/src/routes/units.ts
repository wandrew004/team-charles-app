import { Router, Request, Response, NextFunction } from 'express';
import { 
    getUnits, 
    getUnitById, 
    createUnit, 
    updateUnit, 
    deleteUnit,
    getIngredientsForUnit,
    getRecipeIngredientsForUnit
} from '../controllers/unit';

const router = Router();

/**
 * @brief endpoint for getting all units
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const units = await getUnits();
        res.status(200).json(units);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting a specific unit by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid unit ID' });
            return;
        }

        const unit = await getUnitById(id);
        if (!unit) {
            res.status(404).json({ error: 'Unit not found' });
            return;
        }

        res.status(200).json(unit);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for creating a new unit
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, type } = req.body;
        if (!name || !type) {
            res.status(400).json({ error: 'name and type are required' });
            return;
        }

        const unit = await createUnit(name, type);
        res.status(201).json(unit);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for updating a unit
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { name, type } = req.body;

        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid unit ID' });
            return;
        }

        if (!name || !type) {
            res.status(400).json({ error: 'name and type are required' });
            return;
        }

        await updateUnit(id, name, type);
        const updatedUnit = await getUnitById(id);
        res.status(200).json(updatedUnit);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for deleting a unit
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid unit ID' });
            return;
        }

        await deleteUnit(id);
        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting all ingredients using a specific unit
 */
router.get('/:id/ingredients', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid unit ID' });
            return;
        }

        const ingredients = await getIngredientsForUnit(id);
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting all recipe ingredients using a specific unit
 */
router.get('/:id/recipe-ingredients', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid unit ID' });
            return;
        }

        const recipeIngredients = await getRecipeIngredientsForUnit(id);
        res.status(200).json(recipeIngredients);
    } catch (error) {
        next(error);
    }
});

export default router;
