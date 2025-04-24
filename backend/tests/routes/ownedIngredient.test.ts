import request from 'supertest';
import express from 'express';
import ownedIngredientsRouter from '../../src/routes/ownedIngredients';
import * as ownedIngredientController from '../../src/controllers/ownedIngredient';
import { User } from '../../src/models/init-models';

// Mock the controller functions
jest.mock('../../src/controllers/ownedIngredient');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req: any, res, next) => {
    req.isAuthenticated = () => true;
    req.user = { id: 1, username: 'testuser' } as User;
    next();
});

app.use('/owned-ingredients', ownedIngredientsRouter);

const unauthenticatedApp = express();
unauthenticatedApp.use(express.json());

// Mock authentication middleware
unauthenticatedApp.use((req: any, res, next) => {
    req.isAuthenticated = () => false;
    req.user = undefined;
    next();
});

unauthenticatedApp.use('/owned-ingredients', ownedIngredientsRouter);

describe('Owned Ingredients Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return all owned ingredients', async () => {
            const mockIngredients = [
                { ingredientId: 1, quantity: 5, userId: 1 },
                { ingredientId: 2, quantity: 3, userId: 1 }
            ];
            (ownedIngredientController.getOwnedIngredients as jest.Mock).mockResolvedValue(mockIngredients);

            const response = await request(app).get('/owned-ingredients');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockIngredients);
            expect(ownedIngredientController.getOwnedIngredients).toHaveBeenCalledTimes(1);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            (ownedIngredientController.getOwnedIngredients as jest.Mock).mockRejectedValue(error);

            const response = await request(app).get('/owned-ingredients');
            
            expect(response.status).toBe(500);
        });
    });

    describe('POST /', () => {
        it('should create a new owned ingredient for authenticated user', async () => {
            const newIngredient = { ingredientId: 1, quantity: 5, userId: 1 };
            
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(null);
            (ownedIngredientController.createOwnedIngredient as jest.Mock).mockResolvedValue(newIngredient);

            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1, quantity: 5 });
            
            expect(response.status).toBe(201);
            expect(response.body).toEqual(newIngredient);
            expect(ownedIngredientController.createOwnedIngredient).toHaveBeenCalledWith(1, 5, 1);
        });

        it('should update existing ingredient quantity', async () => {
            const existingIngredient = { ingredientId: 1, quantity: 5, userId: 1 };
            const updatedQuantity = 8; // 5 (existing) + 3 (new) = 8
            
            // First call returns existing ingredient
            (ownedIngredientController.getOwnedIngredientById as jest.Mock)
                .mockResolvedValueOnce(existingIngredient)
                // Second call returns updated ingredient
                .mockResolvedValueOnce({ ...existingIngredient, quantity: updatedQuantity });
            
            (ownedIngredientController.updateOwnedIngredient as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1, quantity: 3 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient quantity updated');
            expect(response.body.ingredientId).toBe(1);
            expect(response.body.newQuantity).toBe(updatedQuantity);
            expect(ownedIngredientController.updateOwnedIngredient).toHaveBeenCalledWith(1, 8, 1);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1 }); // Missing quantity
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('ingredientId and quantity are required');
        });

        it('should return 400 for invalid quantity', async () => {
            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1, quantity: 'not a number' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('quantity must be a valid number');
        });

        it('should return 401 for unauthenticated user', async () => {
            const response = await request(unauthenticatedApp)
                .post('/owned-ingredients')
                .send({ ingredientId: 1, quantity: 5 });
            
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized');
        });
    });

    describe('DELETE /:ingredientId', () => {
        it('should delete an owned ingredient', async () => {
            (ownedIngredientController.deleteOwnedIngredient as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/owned-ingredients/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient deleted successfully');
            expect(ownedIngredientController.deleteOwnedIngredient).toHaveBeenCalledWith(1, 1);
        });

        it('should return 400 for invalid ingredient ID', async () => {
            const response = await request(app).delete('/owned-ingredients/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid ingredient ID');
        });
    });

    describe('DELETE /:ingredientId/quantity', () => {
        it('should reduce ingredient quantity', async () => {
            const existingIngredient = { ingredientId: 1, quantity: 10 };
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(existingIngredient);
            (ownedIngredientController.updateOwnedIngredient as jest.Mock).mockResolvedValue({ ...existingIngredient, quantity: 7 });

            const response = await request(app)
                .delete('/owned-ingredients/1/quantity')
                .send({ quantity: 3 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient quantity updated');
            expect(response.body.newQuantity).toBe(7);
        });

        it('should delete ingredient when quantity becomes 0', async () => {
            const existingIngredient = { ingredientId: 1, quantity: 5, userId: 1 };
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(existingIngredient);
            (ownedIngredientController.deleteOwnedIngredient as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .delete('/owned-ingredients/1/quantity')
                .send({ quantity: 5 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient deleted completely');
            expect(response.body.ingredientId).toBe(1);
            expect(ownedIngredientController.deleteOwnedIngredient).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 for non-existent ingredient', async () => {
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .delete('/owned-ingredients/999/quantity')
                .send({ quantity: 1 });
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Ingredient not found');
        });

        it('should return 400 for invalid quantity', async () => {
            const response = await request(app)
                .delete('/owned-ingredients/1/quantity')
                .send({ quantity: -1 });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Valid quantity is required');
        });
    });
});
