import { queryDatabase } from '@/db/client';
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from '@/controllers/recipe';
import { Recipe } from '@/models';

// Mock the database client
jest.mock('@/db/client');

describe('Recipe Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecipes', () => {
        it('should return all recipes', async () => {
            const mockRecipes: Recipe[] = [
                { id: 1, name: 'Pasta', description: 'Italian pasta dish' },
                { id: 2, name: 'Pizza', description: 'Classic pizza' }
            ];

            (queryDatabase as jest.Mock).mockResolvedValue(mockRecipes);

            const result = await getRecipes();

            expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM Recipes');
            expect(result).toEqual(mockRecipes);
        });

        it('should return empty array when no recipes exist', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getRecipes();

            expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM Recipes');
            expect(result).toEqual([]);
        });
    });

    describe('getRecipeById', () => {
        it('should return a recipe when it exists', async () => {
            const mockRecipe: Recipe = {
                id: 1,
                name: 'Pasta',
                description: 'Italian pasta dish'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipe]);

            const result = await getRecipeById(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM Recipes WHERE ID = $1',
                [1]
            );
            expect(result).toEqual(mockRecipe);
        });

        it('should return null when recipe does not exist', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getRecipeById(999);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM Recipes WHERE ID = $1',
                [999]
            );
            expect(result).toBeNull();
        });
    });

    describe('createRecipe', () => {
        it('should create a new recipe', async () => {
            const mockRecipe: Recipe = {
                id: 1,
                name: 'Pasta',
                description: 'Italian pasta dish'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipe]);

            const result = await createRecipe('Pasta', 'Italian pasta dish');

            expect(queryDatabase).toHaveBeenCalledWith(
                'INSERT INTO Recipes (Name, Description) VALUES ($1, $2) RETURNING *',
                ['Pasta', 'Italian pasta dish']
            );
            expect(result).toEqual(mockRecipe);
        });
    });

    describe('updateRecipe', () => {
        it('should update an existing recipe', async () => {
            const mockRecipe: Recipe = {
                id: 1,
                name: 'Spaghetti',
                description: 'Updated pasta dish'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipe]);

            const result = await updateRecipe(1, 'Spaghetti', 'Updated pasta dish');

            expect(queryDatabase).toHaveBeenCalledWith(
                'UPDATE Recipes SET Name = $1, Description = $2 WHERE ID = $3 RETURNING *',
                ['Spaghetti', 'Updated pasta dish', 1]
            );
            expect(result).toEqual(mockRecipe);
        });
    });

    describe('deleteRecipe', () => {
        it('should delete a recipe', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            await deleteRecipe(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'DELETE FROM Recipes WHERE ID = $1',
                [1]
            );
        });
    });
});
