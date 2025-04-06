import { sampleRecipes, commonIngredients } from './seedData';
import { 
  createIngredient, 
  createRecipe, 
  createStep, 
  addIngredientToRecipe, 
  addStepToRecipe 
} from '../../controllers';
import { queryDatabase } from '../../db/client';
import { Ingredient } from '../../models';

async function clearDatabase() {
  console.log('Clearing existing data...');
  
  await queryDatabase('DELETE FROM RecipeSteps');
  await queryDatabase('DELETE FROM RecipeIngredients');
  await queryDatabase('DELETE FROM Steps');
  await queryDatabase('DELETE FROM Recipes');
  await queryDatabase('DELETE FROM Ingredients');
  
  // Reset sequences to start from 1
  await queryDatabase('ALTER SEQUENCE "ingredients_id_seq" RESTART WITH 1');
  await queryDatabase('ALTER SEQUENCE "recipes_id_seq" RESTART WITH 1');
  await queryDatabase('ALTER SEQUENCE "steps_id_seq" RESTART WITH 1');
  
  console.log('Database cleared successfully and sequences reset');
}

async function seedIngredients() {
  console.log('Seeding ingredients...');
  
  for (const ingredient of commonIngredients) {
    await createIngredient(ingredient.name, ingredient.description);
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
      const existingIngredients = await queryDatabase<Ingredient>(
        'SELECT * FROM Ingredients WHERE Name = $1',
        [ingredientData.name]
      );
      
      let ingredientId;
      if (existingIngredients.length > 0) {
        ingredientId = existingIngredients[0].id;
      } else {
        const newIngredient = await createIngredient(ingredientData.name, '');
        ingredientId = newIngredient.id;
      }
      
      await addIngredientToRecipe(
        recipe.id,
        ingredientId,
        ingredientData.quantity,
        ingredientData.unit
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