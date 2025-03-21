import { queryDatabase } from '@/db/client';
import { getRecipeSteps, createRecipeStep, deleteRecipeStep } from '@/controllers/recipeStep';
import { RecipeStep } from '@/models';

// Mock the database client
jest.mock('@/db/client');

describe('Recipe Step Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecipeSteps', () => {
        it('should return all steps for a recipe', async () => {
            const mockRecipeSteps: RecipeStep[] = [
                { recipe_id: 1, step_id: 1 },
                { recipe_id: 1, step_id: 2 }
            ];

            (queryDatabase as jest.Mock).mockResolvedValue(mockRecipeSteps);

            const result = await getRecipeSteps(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM RecipeSteps WHERE RecipeID = $1',
                [1]
            );
            expect(result).toEqual(mockRecipeSteps);
        });

        it('should return empty array when no steps exist for recipe', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getRecipeSteps(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT * FROM RecipeSteps WHERE RecipeID = $1',
                [1]
            );
            expect(result).toEqual([]);
        });
    });

    describe('createRecipeStep', () => {
        it('should create a new recipe step', async () => {
            const mockRecipeStep: RecipeStep = {
                recipe_id: 1,
                step_id: 1
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockRecipeStep]);

            const result = await createRecipeStep(1, 1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'INSERT INTO RecipeSteps (RecipeID, StepID) VALUES ($1, $2)',
                [1, 1]
            );
            expect(result).toEqual(mockRecipeStep);
        });
    });

    describe('deleteRecipeStep', () => {
        it('should delete a recipe step', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            await deleteRecipeStep(1, 1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'DELETE FROM RecipeSteps WHERE RecipeID = $1 AND StepID = $2',
                [1, 1]
            );
        });
    });
});
