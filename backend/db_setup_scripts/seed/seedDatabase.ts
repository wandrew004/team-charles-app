import { sampleRecipes, commonIngredients } from './seedData';
import { 
    createIngredient, 
    createRecipe, 
    createStep, 
    addIngredientToRecipe, 
    addStepToRecipe
} from '../../src/controllers';
import { Step, Recipe, Ingredient, RecipeIngredient, RecipeStep } from '../../src/models/init-models';
import sequelize from '../../src/db/client';
import { initModels } from '../../src/models/init-models';

initModels(sequelize);

async function clearDatabase() {
    console.log('Clearing existing data...');
  
    await Step.destroy({ where: {} });
    await Recipe.destroy({ where: {} });
    await Ingredient.destroy({ where: {} });
    await RecipeIngredient.destroy({ where: {} });
    await RecipeStep.destroy({ where: {} });
  
    console.log('Database cleared successfully');
}

async function seedIngredients() {
    console.log('Seeding ingredients...');
  
    for (const ingredient of commonIngredients) {
        await createIngredient(
            ingredient.name, 
            ingredient.description,
            ingredient.standardUnit,
            ingredient.density
        );
    }
  
    console.log(`Added ${commonIngredients.length} common ingredients`);
}

async function seedRecipes() {
    console.log('Seeding recipes...');
  
    for (const recipeData of sampleRecipes) {
        // Create the recipe
        const recipe = await createRecipe(recipeData.name, recipeData.description);
        console.log(`Created recipe: ${recipe.name}`);
    
        // Add ingredients to the recipe
        for (const ingredientData of recipeData.ingredients) {
            await addIngredientToRecipe(
                recipe.id,
                ingredientData.ingredientId,
                ingredientData.quantity,
                ingredientData.unitId
            );
        }
    
        // Add steps to the recipe
        for (const stepData of recipeData.steps) {
            const step = await createStep(stepData.stepNumber, stepData.stepText);
            await addStepToRecipe(recipe.id, step.id);
        }
    }
  
    console.log(`Added ${sampleRecipes.length} recipes with ingredients and steps`);
}

export async function seedDatabase() {
    try {
        await clearDatabase();
        await seedIngredients();
        await seedRecipes();
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
