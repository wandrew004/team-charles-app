import { queryDatabase } from '../../src/db/client';
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from '../../src/controllers/ingredient';
import { Ingredient } from '../../src/models';

// Mock the database client
jest.mock('../../src/db/client');

describe('Ingredient Controller', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getIngredients', () => {
        it('should return all ingredients', async () => {
            const mockIngredients: Ingredient[] = [
                { id: 1, name: 'Salt', description: 'Table salt' },
                { id: 2, name: 'Sugar', description: 'Granulated sugar' }
            ];

            (queryDatabase as jest.Mock).mockResolvedValue(mockIngredients);

            const result = await getIngredients();

            expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM Ingredients');
            expect(result).toEqual(mockIngredients);
        });

        it('should return empty array when no ingredients exist', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getIngredients();

            expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM Ingredients');
            expect(result).toEqual([]);
        });
    });

    describe('createIngredient', () => {
        it('should create a new ingredient', async () => {
            const mockIngredient: Ingredient = {
                id: 1,
                name: 'Salt',
                description: 'Table salt'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockIngredient]);

            const result = await createIngredient('Salt', 'Table salt');

            expect(queryDatabase).toHaveBeenCalledWith(
                'INSERT INTO Ingredients (Name, Description) VALUES ($1, $2) RETURNING *',
                ['Salt', 'Table salt']
            );
            expect(result).toEqual(mockIngredient);
        });
    });

    describe('updateIngredient', () => {
        it('should update an existing ingredient', async () => {
            const mockIngredient: Ingredient = {
                id: 1,
                name: 'Sea Salt',
                description: 'Fine sea salt'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockIngredient]);

            const result = await updateIngredient(1, 'Sea Salt', 'Fine sea salt');

            expect(queryDatabase).toHaveBeenCalledWith(
                'UPDATE Ingredients SET Name = $1, Description = $2 WHERE ID = $3 RETURNING *',
                ['Sea Salt', 'Fine sea salt', 1]
            );
            expect(result).toEqual(mockIngredient);
        });
    });

    describe('deleteIngredient', () => {
        it('should delete an ingredient', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            await deleteIngredient(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'DELETE FROM Ingredients WHERE ID = $1',
                [1]
            );
        });
    });
});  