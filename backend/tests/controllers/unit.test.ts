import { getUnits, getUnitById, createUnit, updateUnit, deleteUnit, getIngredientsForUnit, getRecipeIngredientsForUnit, getUnitByName } from '../../src/controllers/unit';
import { Unit } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockUnits = [
    { id: 1, name: 'grams', type: 'weight' },
    { id: 2, name: 'cups', type: 'volume' },
];

const mockIngredients = [
    { id: 1, name: 'Sugar' },
    { id: 2, name: 'Flour' },
];

const mockRecipeIngredients = [
    { recipeId: 1, ingredientId: 1, quantity: 100 },
    { recipeId: 1, ingredientId: 2, quantity: 200 },
];

describe('Unit Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getUnits returns all units', async () => {
        jest.spyOn(Unit, 'findAll').mockResolvedValue(mockUnits as Unit[]);

        const units = await getUnits();

        expect(units).toEqual(mockUnits);
        expect(Unit.findAll).toHaveBeenCalled();
    });

    test('getUnitById returns a single unit by ID', async () => {
        jest.spyOn(Unit, 'findByPk').mockResolvedValue(mockUnits[0] as Unit);

        const unit = await getUnitById(1);

        expect(unit).toEqual(mockUnits[0]);
        expect(Unit.findByPk).toHaveBeenCalledWith(1);
    });

    test('createUnit creates a new unit', async () => {
        const newUnit = { id: 3, name: 'liters', type: 'volume' };
        jest.spyOn(Unit, 'create').mockResolvedValue(newUnit as Unit);

        const created = await createUnit('liters', 'volume');

        expect(created).toEqual(newUnit);
        expect(Unit.create).toHaveBeenCalledWith({ name: 'liters', type: 'volume' });
    });

    test('updateUnit updates an existing unit', async () => {
        jest.spyOn(Unit, 'update').mockResolvedValue([1]);

        await updateUnit(1, 'kilograms', 'weight');

        expect(Unit.update).toHaveBeenCalledWith(
            { name: 'kilograms', type: 'weight' },
            { where: { id: 1 }, returning: true }
        );
    });

    test('deleteUnit deletes a unit by ID', async () => {
        jest.spyOn(Unit, 'destroy').mockResolvedValue(1);

        await deleteUnit(1);

        expect(Unit.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('getIngredientsForUnit returns ingredients for a unit', async () => {
        const mockUnit = { getIngredients: jest.fn().mockResolvedValue(mockIngredients) };
        jest.spyOn(Unit, 'findByPk').mockResolvedValue(mockUnit as unknown as Unit);

        const ingredients = await getIngredientsForUnit(1);

        expect(ingredients).toEqual(mockIngredients);
        expect(Unit.findByPk).toHaveBeenCalledWith(1);
        expect(mockUnit.getIngredients).toHaveBeenCalled();
    });

    test('getRecipeIngredientsForUnit returns recipe ingredients for a unit', async () => {
        const mockUnit = { getRecipeIngredients: jest.fn().mockResolvedValue(mockRecipeIngredients) };
        jest.spyOn(Unit, 'findByPk').mockResolvedValue(mockUnit as unknown as Unit);

        const recipeIngredients = await getRecipeIngredientsForUnit(1);

        expect(recipeIngredients).toEqual(mockRecipeIngredients);
        expect(Unit.findByPk).toHaveBeenCalledWith(1);
        expect(mockUnit.getRecipeIngredients).toHaveBeenCalled();
    });

    test('getUnitByName returns a single unit by name', async () => {
        jest.spyOn(Unit, 'findOne').mockResolvedValue(mockUnits[0] as Unit);

        const unit = await getUnitByName('grams');

        expect(unit).toEqual(mockUnits[0]);
        expect(Unit.findOne).toHaveBeenCalledWith({ where: { name: 'grams' } });
    });
});
