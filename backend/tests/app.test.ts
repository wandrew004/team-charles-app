import request from 'supertest';
import app from '../src/app';
import { getRecipes, getRecipeById, createRecipe, createIngredient, createStep, addIngredientToRecipe, addStepToRecipe, getUnitByName } from '../src/controllers';

jest.mock('../src/controllers');

const mockRecipes = [
    { id: 1, name: 'Cake', description: 'Delicious cake' },
    { id: 2, name: 'Bread', description: 'Fresh bread' },
];

const mockRecipeDetail = {
    id: 1,
    name: 'Cake',
    description: 'Delicious cake',
    recipeIngredients: [
        { quantity: 200, ingredient: { name: 'Flour' }, unit: { name: 'grams' } },
        { quantity: 100, ingredient: { name: 'Sugar' }, unit: { name: 'grams' } },
    ],
    recipeSteps: [
        { step: { stepNumber: 1, stepText: 'Mix ingredients' } },
        { step: { stepNumber: 2, stepText: 'Bake the mixture' } },
    ],
};

describe('Express App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /recipes returns all recipes', async () => {
        (getRecipes as jest.Mock).mockResolvedValue(mockRecipes);

        const response = await request(app).get('/recipes');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecipes);
    });

    test('GET /recipes/:id returns a specific recipe', async () => {
        (getRecipeById as jest.Mock).mockResolvedValue(mockRecipeDetail);

        const response = await request(app).get('/recipes/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Cake',
            description: 'Delicious cake',
            ingredients: [
                { name: 'Flour', quantity: 200, unit: 'grams' },
                { name: 'Sugar', quantity: 100, unit: 'grams' },
            ],
            steps: [
                { stepNumber: 1, stepText: 'Mix ingredients' },
                { stepNumber: 2, stepText: 'Bake the mixture' },
            ],
        });
    });

    test('POST /recipes creates a new recipe', async () => {
        (createRecipe as jest.Mock).mockResolvedValue({ id: 3 });
        (createIngredient as jest.Mock).mockResolvedValue({ id: 1 });
        (getUnitByName as jest.Mock).mockResolvedValue({ id: 1 });
        (addIngredientToRecipe as jest.Mock).mockResolvedValue({});
        (createStep as jest.Mock).mockResolvedValue({ id: 1 });
        (addStepToRecipe as jest.Mock).mockResolvedValue({});

        const newRecipeData = {
            name: 'Cookies',
            description: 'Crunchy cookies',
            ingredients: [{ name: 'Butter', quantity: 100, unit: 'grams' }],
            steps: [{ stepNumber: 1, stepText: 'Mix butter' }],
        };

        const response = await request(app).post('/recipes').send(newRecipeData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Recipe added successfully', recipeId: 3 });
    });
});
