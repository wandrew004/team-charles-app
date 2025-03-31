import { getStepsForRecipe, addStepToRecipe, updateRecipeStep, deleteRecipeStep } from '../../src/controllers/recipeStep';
import { RecipeStep, Step } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockSteps = [
  { stepNumber: 1, stepText: 'Preheat oven' },
  { stepNumber: 2, stepText: 'Mix ingredients' },
];

const mockRecipeSteps = mockSteps.map(step => ({ step }));

describe('RecipeStep Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getStepsForRecipe returns all steps for a recipe', async () => {
    jest.spyOn(RecipeStep, 'findAll').mockResolvedValue(mockRecipeSteps as unknown as RecipeStep[]);

    const steps = await getStepsForRecipe(1);

    expect(steps).toEqual(mockSteps);
    expect(RecipeStep.findAll).toHaveBeenCalledWith({
      where: { recipeId: 1 },
      include: [{ model: Step, as: 'step', attributes: ['stepNumber', 'stepText'] }],
    });
  });

  test('addStepToRecipe adds a new step to a recipe', async () => {
    const newRecipeStep = { recipeId: 1, stepId: 3 };
    jest.spyOn(RecipeStep, 'create').mockResolvedValue(newRecipeStep as RecipeStep);

    const added = await addStepToRecipe(1, 3);

    expect(added).toEqual(newRecipeStep);
    expect(RecipeStep.create).toHaveBeenCalledWith(newRecipeStep);
  });

  test('updateRecipeStep updates a recipe step', async () => {
    jest.spyOn(RecipeStep, 'update').mockResolvedValue([1]);

    await updateRecipeStep(1, 2, 3);

    expect(RecipeStep.update).toHaveBeenCalledWith(
      { stepId: 3 },
      { where: { recipeId: 1, stepId: 2 }, returning: true }
    );
  });

  test('deleteRecipeStep deletes a step from a recipe', async () => {
    jest.spyOn(RecipeStep, 'destroy').mockResolvedValue(1);

    await deleteRecipeStep(1, 2);

    expect(RecipeStep.destroy).toHaveBeenCalledWith({ where: { recipeId: 1, stepId: 2 } });
  });
});
