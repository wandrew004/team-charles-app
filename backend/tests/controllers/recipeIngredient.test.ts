import { queryDatabase } from '../../src/db/client';
import { getRecipeIngredients, createRecipeIngredient, updateRecipeIngredient, deleteRecipeIngredient } from '../../src/controllers/recipeIngredient';
import { RecipeIngredient } from '../../src/models';

// Mock the database client
jest.mock('../../src/db/client');

describe('Recipe Ingredient Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecipeIngredients', () => {
        it('should return all ingredients for a recipe', async () => {
            const mockRecipeIngredients: RecipeIngredient[] = [
                { recipeid: 1, ingredientid: 1, quantity: 2, unit: 'cups' },
                { recipeid: 1, ingredientid: 2, quantity: 1, unit: 'tbsp' }
            ];

            (queryDatabase as jest.Mock).mockResolvedValue(mockRecipeIngredients);

            const result = await getRecipeIngredients(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM RecipeIngredients WHERE RecipeID = $1',
                [1]
            );
            expect(result).toEqual(mockRecipeIngredients);
        });

        it('should return empty array when no ingredients exist for recipe', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getRecipeIngredients(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM RecipeIngredients WHERE RecipeID = $1',
                [1]
            );
            expect(result).toEqual([]);
        });
    });

    describe('createRecipeIngredient', () => {
        it('should create a new recipe ingredient', async () => {
            const mockRecipeIngredient: RecipeIngredient = {
                recipeid: 1,
                ingredientid: 1,
                quantity: 2,
                unit: 'cups'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipeIngredient]);

            const result = await createRecipeIngredient(1, 1, 2, 'cups');

            expect(queryDatabase).toHaveBeenCalledWith(
                'INSERT INTO RecipeIngredients (RecipeID, IngredientID, Quantity, Unit) VALUES ($1, $2, $3, $4)',
                [1, 1, 2, 'cups']
            );
            expect(result).toEqual(mockRecipeIngredient);
        });
    });

    describe('updateRecipeIngredient', () => {
        it('should update an existing recipe ingredient', async () => {
            const mockRecipeIngredient: RecipeIngredient = {
                recipeid: 1,
                ingredientid: 1,
                quantity: 3,
                unit: 'cups'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipeIngredient]);

            const result = await updateRecipeIngredient(1, 1, 3, 'cups');

            expect(queryDatabase).toHaveBeenCalledWith(
                'UPDATE RecipeIngredients SET Quantity = $1, Unit = $2 WHERE RecipeID = $3 AND IngredientID = $4 RETURNING *',
                [3, 'cups', 1, 1]
            );
            expect(result).toEqual(mockRecipeIngredient);
        });
    });

    describe('deleteRecipeIngredient', () => {
        it('should delete a recipe ingredient', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            await deleteRecipeIngredient(1, 1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'DELETE FROM RecipeIngredients WHERE RecipeID = $1 AND IngredientID = $2',
                [1, 1]
            );
        });
    });
});
