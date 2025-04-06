import request from 'supertest';
import express from 'express';
import ingredientRouter from '../../src/routes/ingredients';
import * as ingredientController from '../../src/controllers/ingredient';

const app = express();
app.use(express.json());
app.use('/ingredients', ingredientRouter);

jest.mock('../../src/controllers/ingredient');

describe('Ingredients API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /ingredients', () => {
    it('should return a list of ingredients', async () => {
      const mockIngredients = [
        { id: 1, name: 'Sugar', description: 'Sweet', standardUnit: 1, density: 1.5 },
        { id: 2, name: 'Flour', description: 'Baking', standardUnit: 2, density: 0.6 },
      ];
      (ingredientController.getIngredients as jest.Mock).mockResolvedValue(mockIngredients);

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIngredients);
      expect(ingredientController.getIngredients).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if an error occurs', async () => {
      (ingredientController.getIngredients as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /ingredients', () => {
    it('should create a new ingredient', async () => {
      const mockIngredient = {
        id: 3,
        name: 'Salt',
        description: 'Salty',
        standardUnit: 3,
        density: 2.2,
      };
      (ingredientController.createIngredient as jest.Mock).mockResolvedValue(mockIngredient);

      const response = await request(app)
        .post('/ingredients')
        .send({
          name: 'Salt',
          description: 'Salty',
          standardUnit: 3,
          density: 2.2,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockIngredient);
      expect(ingredientController.createIngredient).toHaveBeenCalledWith('Salt', 'Salty', 3, 2.2);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/ingredients')
        .send({
          description: 'Missing name',
          standardUnit: 1,
          density: 1.1,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Ingredient name is required.' });
    });

    it('should return 500 if creation fails', async () => {
      (ingredientController.createIngredient as jest.Mock).mockRejectedValue(new Error('Insert failed'));

      const response = await request(app)
        .post('/ingredients')
        .send({
          name: 'Pepper',
          description: 'Spicy',
          standardUnit: 2,
          density: 0.8,
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Insert failed' });
    });
  });
});
