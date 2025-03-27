import request from 'supertest';
import app from '../src/app';
import {
    createRecipe,
    createIngredient,
    createStep,
    addIngredientToRecipe,
    addStepToRecipe,
    getRecipes
} from '../src/controllers';

jest.mock('../src/controllers');

describe('/recipes API endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /recipes', () => {
        it('should return a list of recipes', async () => {
            const mockRecipes = [
                { id: 1, name: 'Spaghetti Bolognese' },
                { id: 2, name: 'Chicken Curry' }
            ];
        
            (getRecipes as jest.Mock).mockResolvedValue(mockRecipes);
        
            const response = await request(app).get('/recipes');
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipes);
            expect(getRecipes).toHaveBeenCalledTimes(1);
        });
      
        it('should return an empty array if no recipes found', async () => {
            (getRecipes as jest.Mock).mockResolvedValue([]);
        
            const response = await request(app).get('/recipes');
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            expect(getRecipes).toHaveBeenCalledTimes(1);
        });
      
        it('should handle errors gracefully', async () => {
            (getRecipes as jest.Mock).mockRejectedValue(new Error('DB Error'));
        
            const response = await request(app).get('/recipes');
        
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });
    });

    describe('POST /recipes', () => {
        it('should create a new recipe with ingredients and steps', async () => {
            const mockRecipeId = 1;
            const recipeData = {
                name: 'Grilled Cheese',
                description: 'A tasty sandwich',
                ingredients: [
                    { name: 'Bread', quantity: 2, unit: 'slices' },
                    { name: 'Cheese', quantity: 1, unit: 'slice' }
                ],
                steps: [
                    { stepNumber: 1, stepText: 'Butter the bread' },
                    { stepNumber: 2, stepText: 'Grill with cheese inside' }
                ]
            };
        
            (createRecipe as jest.Mock).mockResolvedValue({ id: mockRecipeId });
            (createIngredient as jest.Mock)
                .mockResolvedValueOnce({ id: 10 }) // Bread
                .mockResolvedValueOnce({ id: 11 }); // Cheese
            (addIngredientToRecipe as jest.Mock).mockResolvedValue(undefined);
            (createStep as jest.Mock)
                .mockResolvedValueOnce({ id: 20 }) // Step 1
                .mockResolvedValueOnce({ id: 21 }); // Step 2
            (addStepToRecipe as jest.Mock).mockResolvedValue(undefined);
        
            const response = await request(app)
                .post('/recipes')
                .send(recipeData);
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Recipe added successfully',
                recipeId: mockRecipeId
            });
        
            // Optional: verify that each controller was called correctly
            expect(createRecipe).toHaveBeenCalledWith('Grilled Cheese', 'A tasty sandwich');
            expect(createIngredient).toHaveBeenCalledTimes(2);
            expect(addIngredientToRecipe).toHaveBeenCalledTimes(2);
            expect(createStep).toHaveBeenCalledTimes(2);
            expect(addStepToRecipe).toHaveBeenCalledTimes(2);
        });

        it('should handle errors gracefully', async () => {
            (createRecipe as jest.Mock).mockRejectedValue(new Error('DB Error'));
          
            const response = await request(app).post('/recipes').send({
                name: 'Broken Recipe',
                description: '',
                ingredients: [],
                steps: []
            });
          
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
          
            expect(createRecipe).toHaveBeenCalledWith('Broken Recipe', '');
        });          
    });
});
