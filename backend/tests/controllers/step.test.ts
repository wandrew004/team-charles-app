import { queryDatabase } from '../../src/db/client';
import { getStepsForRecipe, createStep, updateStep, deleteStep } from '../../src/controllers/step';
import { Step } from '../../src/bkup_models';

// Mock the database client
jest.mock('../../src/db/client');

describe('Step Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getStepsForRecipe', () => {
        it('should return all steps for a recipe', async () => {
            const mockSteps: Step[] = [
                { id: 1, stepnumber: 1, steptext: 'First step' },
                { id: 2, stepnumber: 2, steptext: 'Second step' }
            ];

            (queryDatabase as jest.Mock).mockResolvedValue(mockSteps);

            const result = await getStepsForRecipe(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT s.* FROM Steps AS s INNER JOIN RecipeSteps AS rs ON s.id = rs.stepId WHERE rs.recipeId = $1',
                [1]
            );
            expect(result).toEqual(mockSteps);
        });

        it('should return empty array when no steps exist for recipe', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            const result = await getStepsForRecipe(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'SELECT s.* FROM Steps AS s INNER JOIN RecipeSteps AS rs ON s.id = rs.stepId WHERE rs.recipeId = $1',
                [1]
            );
            expect(result).toEqual([]);
        });
    });

    describe('createStep', () => {
        it('should create a new step', async () => {
            const mockStep: Step = {
                id: 1,
                stepnumber: 1,
                steptext: 'First step'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockStep]);

            const result = await createStep(1, 'First step');

            expect(queryDatabase).toHaveBeenCalledWith(
                'INSERT INTO Steps (StepNumber, StepText) VALUES ($1, $2) RETURNING *',
                [1, 'First step']
            );
            expect(result).toEqual(mockStep);
        });
    });

    describe('updateStep', () => {
        it('should update an existing step', async () => {
            const mockStep: Step = {
                id: 1,
                stepnumber: 1,
                steptext: 'Updated step'
            };

            (queryDatabase as jest.Mock).mockResolvedValue([mockStep]);

            const result = await updateStep(1, 1, 'Updated step');

            expect(queryDatabase).toHaveBeenCalledWith(
                'UPDATE Steps SET StepNumber = $1, StepText = $2 WHERE ID = $3 RETURNING *',
                [1, 'Updated step', 1]
            );
            expect(result).toEqual(mockStep);
        });
    });

    describe('deleteStep', () => {
        it('should delete a step', async () => {
            (queryDatabase as jest.Mock).mockResolvedValue([]);

            await deleteStep(1);

            expect(queryDatabase).toHaveBeenCalledWith(
                'DELETE FROM Steps WHERE ID = $1',
                [1]
            );
        });
    });
});
