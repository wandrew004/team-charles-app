import request from 'supertest';
import app from '../../src/app';
import { addIngredientToRecipe, addStepToRecipe, createIngredient, createRecipe, createStep, deleteRecipe, getRecipeById, getRecipes, getUnitById, updateRecipeWithRelations } from '../../src/controllers';

// Mock all controller functions
jest.mock('../../src/controllers');


describe('Recipes Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return all recipes', async () => {
            const mockRecipes = [
                { id: 1, name: 'Recipe 1', description: 'Description 1' },
                { id: 2, name: 'Recipe 2', description: 'Description 2' }
            ];
            (getRecipes as jest.Mock).mockResolvedValue(mockRecipes);

            const response = await request(app).get('/recipes');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipes);
            expect(getRecipes).toHaveBeenCalledTimes(1);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            (getRecipes as jest.Mock).mockRejectedValue(error);

            const response = await request(app).get('/recipes');
            
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        it('should return a specific recipe', async () => {
            const mockRecipe = {
                id: 1,
                name: 'Test Recipe',
                description: 'Test Description',
                toJSON: () => ({ id: 1, name: 'Test Recipe', description: 'Test Description' })
            };
            (getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);

            const response = await request(app).get('/recipes/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipe.toJSON());
            expect(getRecipeById).toHaveBeenCalledWith(1);
        });

        it('should return 404 for non-existent recipe', async () => {
            (getRecipeById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/recipes/999');
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Recipe not found');
        });

        it('should return 400 for invalid recipe ID', async () => {
            const response = await request(app).get('/recipes/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid recipe ID');
        });
    });

    describe('POST /', () => {
        it('should create a new recipe with ingredients and steps', async () => {
            const recipeData = {
                name: 'Test Recipe',
                description: 'Test Description',
                ingredients: [
                    { name: 'Ingredient 1', unit: 1, quantity: 2 },
                    { name: 'Ingredient 2', unit: 1, quantity: 1 }
                ],
                steps: [
                    { stepNumber: 1, stepText: 'Step 1' },
                    { stepNumber: 2, stepText: 'Step 2' }
                ]
            };

            // Mock all the necessary controller responses
            (createRecipe as jest.Mock).mockResolvedValue({
                id: 1,
                name: recipeData.name,
                description: recipeData.description,
                toJSON: () => ({ id: 1, name: recipeData.name, description: recipeData.description })
            });
            (createIngredient as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Ingredient 1',
                toJSON: () => ({ id: 1, name: 'Ingredient 1' })
            });
            (getUnitById as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'cup',
                toJSON: () => ({ id: 1, name: 'cup' })
            });
            (createStep as jest.Mock).mockResolvedValue({
                id: 1,
                stepNumber: 1,
                stepText: 'Step 1',
                toJSON: () => ({ id: 1, stepNumber: 1, stepText: 'Step 1' })
            });
            (addIngredientToRecipe as jest.Mock).mockResolvedValue(true);
            (addStepToRecipe as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/recipes')
                .send(recipeData);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Recipe added successfully');
            expect(response.body.recipeId).toBe(1);
        });

        it('should handle missing unit error', async () => {
            const recipeData = {
                name: 'Test Recipe',
                description: 'Test Description',
                ingredients: [
                    { name: 'Ingredient 1', unit: 'invalid_unit', quantity: 2 }
                ],
                steps: []
            };

            (createRecipe as jest.Mock).mockResolvedValue({
                id: 1,
                name: recipeData.name,
                description: recipeData.description,
                toJSON: () => ({ id: 1, name: recipeData.name, description: recipeData.description })
            });
            (createIngredient as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Ingredient 1',
                toJSON: () => ({ id: 1, name: 'Ingredient 1' })
            });
            (getUnitById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/recipes')
                .send(recipeData);
            
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('PUT /:id', () => {
        it('should update a recipe', async () => {
            const updateData = {
                id: 1,
                name: 'Updated Recipe',
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            (updateRecipeWithRelations as jest.Mock).mockResolvedValue(true);
            (getRecipeById as jest.Mock).mockResolvedValue({
                ...updateData,
                toJSON: () => updateData
            });

            const response = await request(app)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updateData);
        });

        it('should return 400 for missing name', async () => {
            const updateData = {
                id: 1,
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            const response = await request(app)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('name is required');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a recipe', async () => {
            (deleteRecipe as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/recipes/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Recipe deleted successfully');
            expect(deleteRecipe).toHaveBeenCalledWith(1);
        });

        it('should return 400 for invalid recipe ID', async () => {
            const response = await request(app).delete('/recipes/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid recipe ID');
        });
    });
}); 
