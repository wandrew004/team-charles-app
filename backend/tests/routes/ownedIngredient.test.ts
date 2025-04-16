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

    describe('GET /user/:userId', () => {
        it('should return all owned ingredients for a specific user', async () => {
            const mockIngredients = [
                { ingredientId: 1, quantity: 5 },
                { ingredientId: 2, quantity: 3 }
            ];
            (ownedIngredientController.getUserOwnedIngredients as jest.Mock).mockResolvedValue(mockIngredients);

            const response = await request(app).get('/owned-ingredients/user/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockIngredients);
            expect(ownedIngredientController.getUserOwnedIngredients).toHaveBeenCalledWith(1);
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app).get('/owned-ingredients/user/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID');
        });
    });

    describe('GET /user/:userId/:ingredientId', () => {
        it('should return a specific owned ingredient for a user', async () => {
            const mockIngredient = { ingredientId: 1, quantity: 5 };
            (ownedIngredientController.getUserOwnedIngredientById as jest.Mock).mockResolvedValue(mockIngredient);

            const response = await request(app).get('/owned-ingredients/user/1/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockIngredient);
            expect(ownedIngredientController.getUserOwnedIngredientById).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 for non-existent ingredient', async () => {
            (ownedIngredientController.getUserOwnedIngredientById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/owned-ingredients/user/1/999');
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Ingredient not found');
        });

        it('should return 400 for invalid IDs', async () => {
            const response = await request(app).get('/owned-ingredients/user/invalid/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID or ingredient ID');
        });
    });

    describe('POST /user/:userId', () => {
        it('should create a new owned ingredient for a user', async () => {
            const newIngredient = { ingredientId: 1, quantity: 5 };
            (ownedIngredientController.getUserOwnedIngredientById as jest.Mock).mockResolvedValue(null);
            (ownedIngredientController.createUserOwnedIngredient as jest.Mock).mockResolvedValue(newIngredient);

            const response = await request(app)
                .post('/owned-ingredients/user/1')
                .send(newIngredient);
            
            expect(response.status).toBe(201);
            expect(response.body).toEqual(newIngredient);
            expect(ownedIngredientController.createUserOwnedIngredient).toHaveBeenCalledWith(1, 1, 5);
        });

        it('should update existing ingredient quantity for a user', async () => {
            const existingIngredient = { ingredientId: 1, quantity: 5 };
            const updatedQuantity = 8;
            (ownedIngredientController.getUserOwnedIngredientById as jest.Mock).mockResolvedValue(existingIngredient);
            (ownedIngredientController.updateUserOwnedIngredient as jest.Mock).mockResolvedValue({ ...existingIngredient, quantity: updatedQuantity });

            const response = await request(app)
                .post('/owned-ingredients/user/1')
                .send({ ingredientId: 1, quantity: 3 });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient quantity updated');
            expect(ownedIngredientController.updateUserOwnedIngredient).toHaveBeenCalledWith(1, 1, 8);
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/owned-ingredients/user/1')
                .send({ ingredientId: 1 }); // Missing quantity
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('ingredientId and quantity are required');
        });
    });

    describe('DELETE /user/:userId/:ingredientId', () => {
        it('should delete an owned ingredient for a user', async () => {
            (ownedIngredientController.deleteUserOwnedIngredient as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/owned-ingredients/user/1/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Ingredient deleted successfully');
            expect(ownedIngredientController.deleteUserOwnedIngredient).toHaveBeenCalledWith(1, 1);
        });

        it('should return 400 for invalid IDs', async () => {
            const response = await request(app).delete('/owned-ingredients/user/invalid/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID or ingredient ID');
        });
    });
});
