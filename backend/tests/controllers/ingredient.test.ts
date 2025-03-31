import { getIngredients, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from '../../src/controllers/ingredient';
import { Ingredient } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockIngredients = [
  { id: 1, name: 'Sugar', description: 'Sweet ingredient', standardUnit: 1, density: 1.5 },
  { id: 2, name: 'Flour', description: 'Baking ingredient', standardUnit: 2, density: 0.6 },
];

describe('Ingredient Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getIngredients returns all ingredients', async () => {
    jest.spyOn(Ingredient, 'findAll').mockResolvedValue(mockIngredients as Ingredient[]);

    const ingredients = await getIngredients();

    expect(ingredients).toEqual(mockIngredients);
    expect(Ingredient.findAll).toHaveBeenCalledTimes(1);
  });

  test('getIngredientById returns a single ingredient by ID', async () => {
    jest.spyOn(Ingredient, 'findByPk').mockResolvedValue(mockIngredients[0] as Ingredient);

    const ingredient = await getIngredientById(1);

    expect(ingredient).toEqual(mockIngredients[0]);
    expect(Ingredient.findByPk).toHaveBeenCalledWith(1);
  });

  test('createIngredient creates and returns a new ingredient', async () => {
    const newIngredient = { id: 3, name: 'Butter', description: 'Fatty ingredient', standardUnit: 3, density: 0.9 };
    jest.spyOn(Ingredient, 'create').mockResolvedValue(newIngredient as Ingredient);

    const created = await createIngredient('Butter', 'Fatty ingredient', 3, 0.9);

    expect(created).toEqual(newIngredient);
    expect(Ingredient.create).toHaveBeenCalledWith({
      name: 'Butter',
      description: 'Fatty ingredient',
      standardUnit: 3,
      density: 0.9,
    });
  });

  test('updateIngredient updates an ingredient', async () => {
    jest.spyOn(Ingredient, 'update').mockResolvedValue([1]);

    await updateIngredient(1, 'Updated Sugar', 'Updated desc', 1, 1.6);

    expect(Ingredient.update).toHaveBeenCalledWith(
      {
        name: 'Updated Sugar',
        description: 'Updated desc',
        standardUnit: 1,
        density: 1.6,
      },
      { where: { id: 1 }, returning: true }
    );
  });

  test('deleteIngredient deletes ingredient by ID', async () => {
    jest.spyOn(Ingredient, 'destroy').mockResolvedValue(1);

    await deleteIngredient(1);

    expect(Ingredient.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});