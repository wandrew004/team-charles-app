import { queryDatabase } from '../../src/db/client';
import { getIngredients, createIngredient, updateIngredient, deleteIngredient, getIngredientById, getIngredientsForRecipe } from '../../src/controllers/ingredient';
import { Ingredient } from '../../src/models';
import { IngredientQuantity } from 'types/ingredientQuantity';

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

    describe('getIngredientById', () => {
        it('should return an ingredient when it exists', async () => {
            const mockIngredient: Ingredient = {
                id: 1,
                name: 'Flour',
                description: 'All-purpose white flour'
            };
    
            (queryDatabase as jest.Mock).mockResolvedValue([mockIngredient]);
    
            const result = await getIngredientById(1);
    
            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM Ingredients WHERE ID=$1',
                [1]
            );
            expect(result).toEqual(mockIngredient);
        });
    
        it('should return null when ingredient does not exist', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);
    
            const result = await getIngredientById(999);
    
            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM Ingredients WHERE ID=$1',
                [999]
            );
            expect(result).toBeNull();
        });
    });

    describe('getIngredientsForRecipe', () => {
        it('should return a list of ingredients for a valid recipe ID', async () => {
            const mockIngredients: IngredientQuantity[] = [
                { name: 'Flour', quantity: 2, unit: 'cups' },
                { name: 'Sugar', quantity: 1, unit: 'cup' }
            ];
    
            (queryDatabase as jest.Mock).mockResolvedValue(mockIngredients);
    
            const result = await getIngredientsForRecipe(1);
    
            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT i.name, ri.quantity, ri.unit FROM Ingredients as i INNER JOIN RecipeIngredients as ri ON i.ID = ri.ingredientID WHERE ri.recipeID=$1',
                [1]
            );
            expect(result).toEqual(mockIngredients);
        });
    
        it('should return an empty array when no ingredients are found for the recipe ID', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);
    
            const result = await getIngredientsForRecipe(999);
    
            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT i.name, ri.quantity, ri.unit FROM Ingredients as i INNER JOIN RecipeIngredients as ri ON i.ID = ri.ingredientID WHERE ri.recipeID=$1',
                [999]
            );
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