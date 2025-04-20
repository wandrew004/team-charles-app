import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import recipesRouter from '../../src/routes/recipes';
import { addIngredientToRecipe, addStepToRecipe, createRecipe, createStep, deleteRecipe, getRecipeById, getRecipes, updateRecipeWithRelations } from '../../src/controllers';
import { User } from '../../src/models/init-models';
import { errorHandler } from '../../src/middleware/error';

// Mock all controller functions
jest.mock('../../src/controllers');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req: any, res, next) => {
    req.isAuthenticated = () => true;
    req.user = { id: 1, username: 'testuser' } as User;
    next();
});

app.use('/recipes', recipesRouter);

// Add global error handler
app.use(errorHandler);

const unauthenticatedApp = express();
unauthenticatedApp.use(express.json());

// Mock authentication middleware
unauthenticatedApp.use((req: any, res, next) => {
    req.isAuthenticated = () => false;
    req.user = undefined;
    next();
});

unauthenticatedApp.use('/recipes', recipesRouter);

// Add global error handler
unauthenticatedApp.use(errorHandler);

describe('Recipes Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return all recipes filtered by user', async () => {
            const mockRecipes = [
                { id: 1, name: 'Recipe 1', description: 'Description 1', userId: 1 },
                { id: 2, name: 'Recipe 2', description: 'Description 2', userId: null },
                { id: 3, name: 'Recipe 3', description: 'Description 3', userId: 2 }
            ];
            (getRecipes as jest.Mock).mockResolvedValue(mockRecipes);

            const response = await request(app).get('/recipes');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 1, name: 'Recipe 1', description: 'Description 1', userId: 1 },
                { id: 2, name: 'Recipe 2', description: 'Description 2', userId: null }
            ]);
            expect(getRecipes).toHaveBeenCalledTimes(1);
        });

        it('should return only public recipes for unauthenticated users', async () => {
            const mockRecipes = [
                { id: 1, name: 'Recipe 1', description: 'Description 1', userId: 1 },
                { id: 2, name: 'Recipe 2', description: 'Description 2', userId: -1 },
                { id: 3, name: 'Recipe 3', description: 'Description 3', userId: 2 }
            ];
            (getRecipes as jest.Mock).mockResolvedValue(mockRecipes);

            const response = await request(unauthenticatedApp).get('/recipes');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 2, name: 'Recipe 2', description: 'Description 2', userId: -1 }
            ]);
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
        it('should return a specific recipe if user owns it', async () => {
            const mockRecipe = {
                id: 1,
                name: 'Test Recipe',
                description: 'Test Description',
                userId: 1,
                toJSON: () => ({ id: 1, name: 'Test Recipe', description: 'Test Description', userId: 1 })
            };
            (getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);

            const response = await request(app).get('/recipes/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipe.toJSON());
            expect(getRecipeById).toHaveBeenCalledWith(1);
        });

        it('should return a public recipe', async () => {
            const mockRecipe = {
                id: 1,
                name: 'Test Recipe',
                description: 'Test Description',
                userId: null,
                toJSON: () => ({ id: 1, name: 'Test Recipe', description: 'Test Description', userId: null })
            };
            (getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);

            const response = await request(app).get('/recipes/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipe.toJSON());
        });

        it('should return 403 for unauthorized recipe access', async () => {
            const mockRecipe = {
                id: 1,
                name: 'Test Recipe',
                description: 'Test Description',
                userId: 2,
                toJSON: () => ({ id: 1, name: 'Test Recipe', description: 'Test Description', userId: 2 })
            };
            (getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);

            const response = await request(app).get('/recipes/1');
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
        });

        it('should return 403 for unauthenticated user', async () => {
            const response = await request(unauthenticatedApp).get('/recipes/1');
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
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
                    { ingredientId: 1, unitId: 1, quantity: 2 },
                    { ingredientId: 2, unitId: 2, quantity: 1 }
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
                userId: 1,
                toJSON: () => ({ id: 1, name: recipeData.name, description: recipeData.description, userId: 1 })
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
            expect(createRecipe).toHaveBeenCalledWith(recipeData.name, recipeData.description, 1);
        });

        it('should return 403 for unauthenticated user', async () => {
            const recipeData = {
                name: 'Test Recipe',
                description: 'Test Description',
                ingredients: [],
                steps: []
            };

            const response = await request(unauthenticatedApp)
                .post('/recipes')
                .send(recipeData);
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You need to log in first');
        });

        it('should handle missing unit error', async () => {
            const recipeData = {
                name: 'Test Recipe',
                description: 'Test Description',
                ingredients: [
                    { ingredientId: 1, unitId: 999, quantity: 2 }
                ],
                steps: []
            };

            (createRecipe as jest.Mock).mockResolvedValue({
                id: 1,
                name: recipeData.name,
                description: recipeData.description,
                userId: 1,
                toJSON: () => ({ id: 1, name: recipeData.name, description: recipeData.description, userId: 1 })
            });
            (addIngredientToRecipe as jest.Mock).mockRejectedValue(new Error('Unit not found'));

            const response = await request(app)
                .post('/recipes')
                .send(recipeData);
            
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('PUT /:id', () => {
        it('should update a recipe if user owns it', async () => {
            const updateData = {
                id: 1,
                name: 'Updated Recipe',
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            (getRecipeById as jest.Mock).mockResolvedValue({
                id: 1,
                userId: 1,
                toJSON: () => updateData
            });
            (updateRecipeWithRelations as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updateData);
        });

        it('should return 403 for unauthenticated user', async () => {
            const updateData = {
                id: 1,
                name: 'Updated Recipe',
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            const response = await request(unauthenticatedApp)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
        });

        it('should return 403 for unauthorized recipe update', async () => {
            const updateData = {
                id: 1,
                name: 'Updated Recipe',
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            (getRecipeById as jest.Mock).mockResolvedValue({
                id: 1,
                userId: 2,
                toJSON: () => updateData
            });

            const response = await request(app)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
        });

        it('should return 400 for missing name', async () => {
            const updateData = {
                id: 1,
                description: 'Updated Description',
                recipeIngredients: [],
                recipeSteps: []
            };

            (getRecipeById as jest.Mock).mockResolvedValue({
                id: 1,
                userId: 1,
                toJSON: () => updateData
            });

            const response = await request(app)
                .put('/recipes/1')
                .send(updateData);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('name is required');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a recipe if user owns it', async () => {
            (getRecipeById as jest.Mock).mockResolvedValue({
                id: 1,
                userId: 1
            });
            (deleteRecipe as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/recipes/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Recipe deleted successfully');
            expect(deleteRecipe).toHaveBeenCalledWith(1);
        });

        it('should return 403 for unauthenticated user', async () => {
            const response = await request(unauthenticatedApp).delete('/recipes/1');
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
        });

        it('should return 403 for unauthorized recipe deletion', async () => {
            (getRecipeById as jest.Mock).mockResolvedValue({
                id: 1,
                userId: 2
            });

            const response = await request(app).delete('/recipes/1');
            
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('You are not authorized to access this recipe');
        });

        it('should return 400 for invalid recipe ID', async () => {
            const response = await request(app).delete('/recipes/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid recipe ID');
        });
    });
}); 
