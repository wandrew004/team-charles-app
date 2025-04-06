import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { RecipeFormData } from './types/recipeFormData';
import {
    createIngredient,
    createRecipe,
    createStep,
    addIngredientToRecipe,
    addStepToRecipe,
    getRecipes,
    getRecipeById,
    getUnitByName
} from './controllers'; // Make sure these are Sequelize-based
import { initModels, Recipe } from './models/init-models';
import { RecipeData } from './types/recipeData';
import sequelize from './db/client';
import ownedIngredientsRouter from './routes/ownedIngredients';
import aggregationRouter from './routes/aggregation';

const app: Express = express();

app.use(express.json());
app.use(cors());
if(process.env.NODE_ENV !== 'test') {
    initModels(sequelize);
}

/**
 * @brief middleware handler to log requests
 */
app.use((req, res, next) => {
    console.log(
        '---------------------------------------------------\n' +
        `Request received: ${req.method} ${req.originalUrl}\n` +
        `\t- Params: ${JSON.stringify(req.params)}\n` +
        `\t- Query: ${JSON.stringify(req.query)}\n` +
        `\t- Body: ${JSON.stringify(req.body)}`
    );

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            '---------------------------------------------------\n' +
            `Request resolved: ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`
        );
    });

    next();
});

/**
 * @brief endpoint for getting the ids and names of all recipes
 */
app.get('/recipes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes: Recipe[] = await getRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting a specific recipe
 */
app.get('/recipes/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        console.log(recipe);

        const ingredients = recipe.recipeIngredients.map((ing) => ({
            name: ing.ingredient.name,
            quantity: Number(ing.quantity ?? 0),
            unit: ing.unit.name,
        }));

        const steps = recipe.recipeSteps.map((recipeStep) => ({
            stepNumber: recipeStep.step.stepNumber,
            stepText: recipeStep.step.stepText,
        }));

        const recipeData: RecipeData = {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description || '',
            ingredients,
            steps,
        };

        res.status(200).json(recipeData);
    } catch (error) {
        next(error);
    }
});


/**
 * @brief endpoint for saving a recipe
 */
app.post('/recipes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipeData: RecipeFormData = req.body;

        // Create the base recipe
        const recipe = await createRecipe(recipeData.name, recipeData.description);

        // Create ingredients and associate with recipe
        await Promise.all(
            recipeData.ingredients.map(async (ingredientData) => {
                const ingredient = await createIngredient(
                    ingredientData.name,
                    '', // description
                    undefined,
                    undefined
                );

                const unitRecord = await getUnitByName(ingredientData.unit);
                if (!unitRecord) {
                    throw new Error(`Unit "${ingredientData.unit}" not found.`);
                }

                await addIngredientToRecipe(
                    recipe.id,
                    ingredient.id,
                    ingredientData.quantity,
                    unitRecord.id
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

app.use('/ownedIngredients', ownedIngredientsRouter);
app.use('/api/aggregation', aggregationRouter);

/**
 * @brief global error handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(
        '---------------------------------------------------\n' +
        `Request errored: ${req.method} ${req.originalUrl}\n` +
        `\t- Params: ${JSON.stringify(req.params)}\n` +
        `\t- Query: ${JSON.stringify(req.query)}\n` +
        `\t- Body: ${JSON.stringify(req.body)}\n` +
        err.stack || err
    );

    res.status(500).json({ error: 'Internal Server Error' });
    
    next();
});

export default app;
