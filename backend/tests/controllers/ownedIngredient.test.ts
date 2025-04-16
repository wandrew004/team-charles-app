import {
    getOwnedIngredients,
    getUserOwnedIngredients,
    getOwnedIngredientById,
    getUserOwnedIngredientById,
    createOwnedIngredient,
    createUserOwnedIngredient,
    updateOwnedIngredient,
    updateUserOwnedIngredient,
    deleteOwnedIngredient,
    deleteUserOwnedIngredient
} from '../../src/controllers/ownedIngredient';

import { OwnedIngredient, Ingredient, Unit } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockOwnedIngredients = [
    {
        ingredientId: 1,
        quantity: 500,
        userId: 1,
        ingredient: {
            name: 'Sugar',
            description: 'Sweet',
            standardUnit: 1,
            density: 1.5,
            standardUnitUnit: { id: 1, name: 'g', type: 'mass' },
        },
    },
    {
        ingredientId: 2,
        quantity: 1000,
        userId: 1,
        ingredient: {
            name: 'Flour',
            description: 'Baking',
            standardUnit: 2,
            density: 0.6,
            standardUnitUnit: { id: 2, name: 'oz', type: 'mass' },
        },
    },
] as unknown as OwnedIngredient[];

describe('OwnedIngredient Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getOwnedIngredients returns all owned ingredients with units', async () => {
        jest.spyOn(OwnedIngredient, 'findAll').mockResolvedValue(mockOwnedIngredients);

        const ingredients = await getOwnedIngredients();

        expect(ingredients).toEqual(mockOwnedIngredients);
        expect(OwnedIngredient.findAll).toHaveBeenCalledWith({
            include: [
                {
                    model: Ingredient,
                    as: 'ingredient',
                    attributes: ['name', 'description', 'standardUnit', 'density'],
                    include: [
                        {
                            model: Unit,
                            as: 'standardUnitUnit',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
            ],
        });
    });

    test('getUserOwnedIngredients returns all user-owned ingredients with units', async () => {
        jest.spyOn(OwnedIngredient, 'findAll').mockResolvedValue(mockOwnedIngredients);

        const ingredients = await getUserOwnedIngredients(1);

        expect(ingredients).toEqual(mockOwnedIngredients);
        expect(OwnedIngredient.findAll).toHaveBeenCalledWith({
            where: { userId: 1 },
            include: [
                {
                    model: Ingredient,
                    as: 'ingredient',
                    attributes: ['name', 'description', 'standardUnit', 'density'],
                    include: [
                        {
                            model: Unit,
                            as: 'standardUnitUnit',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
            ],
        });
    });

    test('getOwnedIngredientById returns a single owned ingredient by ID', async () => {
        jest.spyOn(OwnedIngredient, 'findByPk').mockResolvedValue(mockOwnedIngredients[0]);

        const ingredient = await getOwnedIngredientById(1);

        expect(ingredient).toEqual(mockOwnedIngredients[0]);
        expect(OwnedIngredient.findByPk).toHaveBeenCalledWith(1, {
            include: [
                {
                    model: Ingredient,
                    as: 'ingredient',
                    attributes: ['name', 'description', 'standard_unit', 'density'],
                },
            ],
        });
    });

    test('getUserOwnedIngredientById returns a user-owned ingredient by ID', async () => {
        jest.spyOn(OwnedIngredient, 'findOne').mockResolvedValue(mockOwnedIngredients[0]);

        const ingredient = await getUserOwnedIngredientById(1, 1);

        expect(ingredient).toEqual(mockOwnedIngredients[0]);
        expect(OwnedIngredient.findOne).toHaveBeenCalledWith({
            where: { ingredientId: 1, userId: 1 },
            include: [
                {
                    model: Ingredient,
                    as: 'ingredient',
                    attributes: ['name', 'description', 'standard_unit', 'density'],
                },
            ],
        });
    });

    test('createOwnedIngredient creates a new owned ingredient', async () => {
        const newIngredient = { ingredientId: 3, quantity: 250 };
        jest.spyOn(OwnedIngredient, 'create').mockResolvedValue(newIngredient as OwnedIngredient);

        const result = await createOwnedIngredient(3, 250);

        expect(result).toEqual(newIngredient);
        expect(OwnedIngredient.create).toHaveBeenCalledWith({
            ingredientId: 3,
            quantity: 250,
        });
    });

    test('createUserOwnedIngredient creates a new user-owned ingredient', async () => {
        const newIngredient = { userId: 1, ingredientId: 4, quantity: 100 };
        jest.spyOn(OwnedIngredient, 'create').mockResolvedValue(newIngredient as OwnedIngredient);

        const result = await createUserOwnedIngredient(1, 4, 100);

        expect(result).toEqual(newIngredient);
        expect(OwnedIngredient.create).toHaveBeenCalledWith({
            userId: 1,
            ingredientId: 4,
            quantity: 100,
        });
    });

    test('updateOwnedIngredient updates quantity of owned ingredient', async () => {
        jest.spyOn(OwnedIngredient, 'update').mockResolvedValue([1]);

        await updateOwnedIngredient(2, 900);

        expect(OwnedIngredient.update).toHaveBeenCalledWith(
            { quantity: 900 },
            {
                where: { ingredientId: 2 },
                returning: true,
            }
        );
    });

    test('updateUserOwnedIngredient updates quantity for specific user', async () => {
        jest.spyOn(OwnedIngredient, 'update').mockResolvedValue([1]);

        await updateUserOwnedIngredient(1, 1, 750);

        expect(OwnedIngredient.update).toHaveBeenCalledWith(
            { quantity: 750 },
            {
                where: { ingredientId: 1, userId: 1 },
                returning: true,
            }
        );
    });

    test('deleteOwnedIngredient deletes an owned ingredient by ID', async () => {
        jest.spyOn(OwnedIngredient, 'destroy').mockResolvedValue(1);

        await deleteOwnedIngredient(2);

        expect(OwnedIngredient.destroy).toHaveBeenCalledWith({
            where: { ingredientId: 2 },
        });
    });

    test('deleteUserOwnedIngredient deletes user-owned ingredient by ID', async () => {
        jest.spyOn(OwnedIngredient, 'destroy').mockResolvedValue(1);

        await deleteUserOwnedIngredient(1, 1);

        expect(OwnedIngredient.destroy).toHaveBeenCalledWith({
            where: { ingredientId: 1, userId: 1 },
        });
    });
});
