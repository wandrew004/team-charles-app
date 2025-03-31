import { getOwnedIngredients, getOwnedIngredientById, createOwnedIngredient, updateOwnedIngredient, deleteOwnedIngredient } from '../../src/controllers/ownedIngredient';
import { OwnedIngredient, Ingredient } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockOwnedIngredients = [
    {
      ingredientId: 1,
      quantity: 500,
      Ingredient: { name: 'Sugar', description: 'Sweet', standard_unit: 1, density: 1.5 }
    },
    {
      ingredientId: 2,
      quantity: 1000,
      Ingredient: { name: 'Flour', description: 'Baking', standard_unit: 2, density: 0.6 }
    },
  ] as unknown as OwnedIngredient[];

describe('OwnedIngredient Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getOwnedIngredients returns all owned ingredients', async () => {
    jest.spyOn(OwnedIngredient, 'findAll').mockResolvedValue(mockOwnedIngredients as OwnedIngredient[]);

    const ingredients = await getOwnedIngredients();

    expect(ingredients).toEqual(mockOwnedIngredients);
    expect(OwnedIngredient.findAll).toHaveBeenCalledWith({
      include: [{
        model: Ingredient,
        attributes: ['name', 'description', 'standard_unit', 'density']
      }]
    });
  });

  test('getOwnedIngredientById returns a single owned ingredient by ID', async () => {
    jest.spyOn(OwnedIngredient, 'findByPk').mockResolvedValue(mockOwnedIngredients[0] as OwnedIngredient);

    const ingredient = await getOwnedIngredientById(1);

    expect(ingredient).toEqual(mockOwnedIngredients[0]);
    expect(OwnedIngredient.findByPk).toHaveBeenCalledWith(1, {
      include: [{
        model: Ingredient,
        attributes: ['name', 'description', 'standard_unit', 'density']
      }]
    });
  });

  test('createOwnedIngredient creates a new owned ingredient', async () => {
    const newOwnedIngredient = { ingredientId: 3, quantity: 250 };
    jest.spyOn(OwnedIngredient, 'create').mockResolvedValue(newOwnedIngredient as OwnedIngredient);

    const created = await createOwnedIngredient(3, 250);

    expect(created).toEqual(newOwnedIngredient);
    expect(OwnedIngredient.create).toHaveBeenCalledWith({ ingredientId: 3, quantity: 250 });
  });

  test('updateOwnedIngredient updates an owned ingredient quantity', async () => {
    jest.spyOn(OwnedIngredient, 'update').mockResolvedValue([1]);

    await updateOwnedIngredient(1, 600);

    expect(OwnedIngredient.update).toHaveBeenCalledWith(
      { quantity: 600 },
      { where: { ingredientId: 1 }, returning: true }
    );
  });

  test('deleteOwnedIngredient deletes an owned ingredient by ID', async () => {
    jest.spyOn(OwnedIngredient, 'destroy').mockResolvedValue(1);

    await deleteOwnedIngredient(1);

    expect(OwnedIngredient.destroy).toHaveBeenCalledWith({ where: { ingredientId: 1 } });
  });
});
