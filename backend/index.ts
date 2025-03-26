import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { RecipeFormData } from './src/types/recipeFormData';
import { 
    createIngredient,
    createRecipe,
    createStep,
    addIngredientToRecipe,
    addStepToRecipe
} from './src/controllers';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3001');

app.use(express.json());
app.use(cors());

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

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
