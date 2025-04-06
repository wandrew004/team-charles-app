import request from 'supertest';
import app from '../../src/app';
import { getIngredientsForRecipes } from '../../src/controllers';

// Mock the controller functions
jest.mock('../../src/controllers');

describe('Aggregation Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /ingredients', () => {
        it('should return ingredients for given recipe IDs', async () => {
            const mockIngredients = [
                { ingredientId: 1, name: 'Flour', quantity: 2, unit: 'cups' },
                { ingredientId: 2, name: 'Sugar', quantity: 1, unit: 'cup' }
            ];
            (getIngredientsForRecipes as jest.Mock).mockResolvedValue(mockIngredients);

            const response = await request(app)
                .get('/aggregation/ingredients')
                .query({ recipeIds: [1, 2] });
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockIngredients);
            expect(getIngredientsForRecipes).toHaveBeenCalledWith([1, 2]);
        });

        it('should return 400 when recipeIds is not provided', async () => {
            const response = await request(app)
                .get('/aggregation/ingredients');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('recipeIds must be provided as an array');
        });

        it('should return 400 when recipeIds is not an array', async () => {
            const response = await request(app)
                .get('/aggregation/ingredients')
                .query({ recipeIds: '1' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('recipeIds must be provided as an array');
        });

        it('should return 400 when recipeIds contains non-numeric values', async () => {
            const response = await request(app)
                .get('/aggregation/ingredients')
                .query({ recipeIds: [1, 'invalid', 3] });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('All recipe IDs must be numbers');
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            (getIngredientsForRecipes as jest.Mock).mockRejectedValue(error);

            const response = await request(app)
                .get('/aggregation/ingredients')
                .query({ recipeIds: [1, 2] });
            
            expect(response.status).toBe(500);
        });
    });
}); 
