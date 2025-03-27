import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { RecipeFormData } from './types/recipeFormData';
import { 
    createIngredient,
    createRecipe,
    createStep,
    addIngredientToRecipe,
    addStepToRecipe,
    getRecipes
} from './controllers';
import { Recipe } from 'models';

const app: Express = express();

app.use(express.json());
app.use(cors());

/**
 * @brief endpoint for getting the ids and names of all recipes
 */
app.get('/recipes', async (req: Request, res: Response) => {
    try {
        console.log('Request at /recipes');
        const recipes : Recipe[] = await getRecipes();
        res.status(200).json(recipes);
        console.log('Request at /recipes resolved');
    } catch (error) {
        console.error('Error getting recipes at /recipes');
        res.status(500).json({ error: 'Failed to add recipe' });
    }
});

/**
 * @brief endpoint for saving a recipe
 * 
 * Expects a request in the form of jsonified RecipeFormData
 */
app.post('/recipes', async (req: Request, res: Response) => {
    try {
        const recipeData: RecipeFormData = req.body;
        console.log('Recipe received', recipeData);

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

        console.log('Recipe added:', recipe.id);
        res.status(200).json({ message: 'Recipe added successfully', recipeId: recipe.id });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Failed to add recipe' });
    }
});

export default app;
