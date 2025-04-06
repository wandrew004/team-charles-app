import request from 'supertest';
import express from 'express';
import ownedIngredientsRouter from '../../src/routes/ownedIngredients';
import * as ownedIngredientController from '../../src/controllers/ownedIngredient';

// Mock the controller functions
jest.mock('../../src/controllers/ownedIngredient');

const app = express();
app.use(express.json());
app.use('/owned-ingredients', ownedIngredientsRouter);

describe('Owned Ingredients Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return all owned ingredients', async () => {
            const mockIngredients = [
                { ingredientId: 1, quantity: 5 },
                { ingredientId: 2, quantity: 3 }
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
        it('should create a new owned ingredient', async () => {
            const newIngredient = { ingredientId: 1, quantity: 5 };
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(null);
            (ownedIngredientController.createOwnedIngredient as jest.Mock).mockResolvedValue(newIngredient);

            const response = await request(app)
                .post('/owned-ingredients')
                .send(newIngredient);
            
            expect(response.status).toBe(201);
            expect(response.body).toEqual(newIngredient);
            expect(ownedIngredientController.createOwnedIngredient).toHaveBeenCalledWith(1, 5);
        });

        it('should update existing ingredient quantity', async () => {
            const existingIngredient = { ingredientId: 1, quantity: 5 };
            const updatedQuantity = 8;
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(existingIngredient);
            (ownedIngredientController.updateOwnedIngredient as jest.Mock).mockResolvedValue({ ...existingIngredient, quantity: updatedQuantity });

            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1, quantity: 3 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient quantity updated');
            expect(ownedIngredientController.updateOwnedIngredient).toHaveBeenCalledWith(1, 8);
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/owned-ingredients')
                .send({ ingredientId: 1 }); // Missing quantity
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('ingredientId and quantity are required');
        });
    });

    describe('DELETE /:ingredientId', () => {
        it('should delete an owned ingredient', async () => {
            (ownedIngredientController.deleteOwnedIngredient as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/owned-ingredients/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient deleted successfully');
            expect(ownedIngredientController.deleteOwnedIngredient).toHaveBeenCalledWith(1);
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
            const existingIngredient = { ingredientId: 1, quantity: 5 };
            (ownedIngredientController.getOwnedIngredientById as jest.Mock).mockResolvedValue(existingIngredient);
            (ownedIngredientController.deleteOwnedIngredient as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete('/owned-ingredients/1/quantity')
                .send({ quantity: 5 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient deleted completely');
            expect(ownedIngredientController.deleteOwnedIngredient).toHaveBeenCalledWith(1);
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
