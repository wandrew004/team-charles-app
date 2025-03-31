import { getSteps, getStepById, createStep, updateStep, deleteStep } from '../../src/controllers/step';
import { Step } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockSteps = [
  { id: 1, stepNumber: 1, stepText: 'Preheat oven' },
  { id: 2, stepNumber: 2, stepText: 'Mix ingredients' },
];

describe('Step Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSteps returns all steps ordered by stepNumber', async () => {
    jest.spyOn(Step, 'findAll').mockResolvedValue(mockSteps as Step[]);

    const steps = await getSteps();

    expect(steps).toEqual(mockSteps);
    expect(Step.findAll).toHaveBeenCalledWith({ order: [['stepNumber', 'ASC']] });
  });

  test('getStepById returns a single step by ID', async () => {
    jest.spyOn(Step, 'findByPk').mockResolvedValue(mockSteps[0] as Step);

    const step = await getStepById(1);

    expect(step).toEqual(mockSteps[0]);
    expect(Step.findByPk).toHaveBeenCalledWith(1);
  });

  test('createStep creates a new step', async () => {
    const newStep = { id: 3, stepNumber: 3, stepText: 'Bake for 20 mins' };
    jest.spyOn(Step, 'create').mockResolvedValue(newStep as Step);

    const created = await createStep(3, 'Bake for 20 mins');

    expect(created).toEqual(newStep);
    expect(Step.create).toHaveBeenCalledWith({ stepNumber: 3, stepText: 'Bake for 20 mins' });
  });

  test('updateStep updates an existing step', async () => {
    jest.spyOn(Step, 'update').mockResolvedValue([1]);

    await updateStep(1, 1, 'Preheat oven to 180C');

    expect(Step.update).toHaveBeenCalledWith(
      { stepNumber: 1, stepText: 'Preheat oven to 180C' },
      { where: { id: 1 }, returning: true }
    );
  });

  test('deleteStep deletes a step by ID', async () => {
    jest.spyOn(Step, 'destroy').mockResolvedValue(1);

    await deleteStep(1);

    expect(Step.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
