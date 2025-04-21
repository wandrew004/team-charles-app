import request from 'supertest';
import app from '../../src/app';
import { extractRecipeFromText } from '../../src/controllers/aiRecipe';

// Mock the AI recipe controller function
jest.mock('../../src/controllers/aiRecipe');

describe('AI Recipes Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /extract', () => {
        it('should extract recipe data from text and return valid RecipeFormData', async () => {
            const mockRecipeData = {
                name: 'Chocolate Chip Cookies',
                description: 'Classic chocolate chip cookies that are soft and chewy.',
                ingredients: [
                    { name: 'all-purpose flour', quantity: 2.25, unit: 10 },
                    { name: 'baking soda', quantity: 1, unit: 8 },
                    { name: 'salt', quantity: 1, unit: 8 },
                    { name: 'butter', quantity: 1, unit: 10 },
                    { name: 'granulated sugar', quantity: 0.75, unit: 10 },
                    { name: 'brown sugar', quantity: 0.75, unit: 10 },
                    { name: 'vanilla extract', quantity: 1, unit: 8 },
                    { name: 'eggs', quantity: 2, unit: 20 },
                    { name: 'chocolate chips', quantity: 2, unit: 10 }
                ],
                steps: [
                    { stepNumber: 1, stepText: 'Preheat oven to 375°F.' },
                    { stepNumber: 2, stepText: 'Combine flour, baking soda and salt in small bowl.' },
                    { stepNumber: 3, stepText: 'Beat butter, granulated sugar, brown sugar and vanilla extract in large mixer bowl until creamy.' },
                    { stepNumber: 4, stepText: 'Add eggs, one at a time, beating well after each addition.' },
                    { stepNumber: 5, stepText: 'Gradually beat in flour mixture.' },
                    { stepNumber: 6, stepText: 'Stir in chocolate chips.' },
                    { stepNumber: 7, stepText: 'Drop by rounded tablespoon onto ungreased baking sheets.' },
                    { stepNumber: 8, stepText: 'Bake for 9 to 11 minutes or until golden brown.' },
                    { stepNumber: 9, stepText: 'Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.' }
                ]
            };

            (extractRecipeFromText as jest.Mock).mockResolvedValue(mockRecipeData);

            const recipeText = `Classic Chocolate Chip Cookies

These delicious cookies are a family favorite. They're soft, chewy, and packed with chocolate chips.

Ingredients:
- 2 1/4 cups all-purpose flour
- 1 teaspoon baking soda
- 1 teaspoon salt
- 1 cup (2 sticks) butter, softened
- 3/4 cup granulated sugar
- 3/4 cup packed brown sugar
- 1 teaspoon vanilla extract
- 2 large eggs
- 2 cups (12-oz. pkg.) semi-sweet chocolate chips

Steps:
1. Preheat oven to 375°F.
2. Combine flour, baking soda and salt in small bowl.
3. Beat butter, granulated sugar, brown sugar and vanilla extract in large mixer bowl until creamy.
4. Add eggs, one at a time, beating well after each addition.
5. Gradually beat in flour mixture.
6. Stir in chocolate chips.
7. Drop by rounded tablespoon onto ungreased baking sheets.
8. Bake for 9 to 11 minutes or until golden brown.
9. Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.`;

            const response = await request(app)
                .post('/ai-recipes/extract')
                .set('Content-Type', 'text/plain')
                .send(recipeText);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecipeData);
            expect(extractRecipeFromText).toHaveBeenCalledWith(recipeText);
        });

        it('should return 400 for missing recipeText', async () => {
            const response = await request(app)
                .post('/ai-recipes/extract')
                .set('Content-Type', 'text/plain')
                .send('');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('recipeText is required');
        });
    });
}); 