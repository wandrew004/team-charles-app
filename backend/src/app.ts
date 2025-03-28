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
    getStepsForRecipe,
    getIngredientsForRecipe
} from './controllers';
import { Recipe, Step } from 'models';
import { RecipeData } from 'types/recipeData';

const app: Express = express();

app.use(express.json());
app.use(cors());

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
        const recipes : Recipe[] = await getRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting a specific recipe
 */
app.get('/recipes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get the initial recipe
        const recipeId = parseInt(req.params.id, 10);

        if (isNaN(recipeId)) {
            res.status(400).json({ error: 'Invalid recipe ID' });
            return;
        }

        const recipe: Recipe | null = await getRecipeById(recipeId);

        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        // get the associated ingredients and steps
        const ingredients = await getIngredientsForRecipe(recipeId);
        const steps = (await getStepsForRecipe(recipeId)).map((step: Step) => ({
            stepNumber: step.stepnumber,
            stepText: step.steptext
        }));

        const recipeData: RecipeData = {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            ingredients: ingredients,
            steps: steps
        };
        res.status(200).json(recipeData);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for saving a recipe
 * 
 * Expects a request in the form of jsonified RecipeFormData
 */
app.post('/recipes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipeData: RecipeFormData = req.body;

        // Create Recipe
        const recipe = await createRecipe(recipeData.name, recipeData.description);

        // Create ingredients and associate with recipe
        await Promise.all(
            recipeData.ingredients.map(async (ingredientData) => {
                const ingredient = await createIngredient(ingredientData.name, '');
                await addIngredientToRecipe(
                    recipe.id,
                    ingredient.id,
                    ingredientData.quantity,
                    ingredientData.unit
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
