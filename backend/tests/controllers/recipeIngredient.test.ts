import { getIngredientsForRecipe, createRecipeIngredient, updateRecipeIngredient, deleteRecipeIngredient, addIngredientToRecipe } from '../../src/controllers/recipeIngredient';
import { RecipeIngredient, Ingredient, Unit } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockRecipeIngredients = [
    {
        quantity: 200,
        ingredient: { name: 'Flour' },
        unit: { name: 'grams' }
    },
    {
        quantity: 100,
        ingredient: { name: 'Sugar' },
        unit: { name: 'grams' }
    },
];

describe('RecipeIngredient Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getIngredientsForRecipe returns all ingredients for a recipe', async () => {
        jest.spyOn(RecipeIngredient, 'findAll').mockResolvedValue(mockRecipeIngredients as unknown as RecipeIngredient[]);

        const ingredients = await getIngredientsForRecipe(1);

        expect(ingredients).toEqual(mockRecipeIngredients);
        expect(RecipeIngredient.findAll).toHaveBeenCalledWith({
            where: { recipeId: 1 },
            include: [
                { model: Ingredient, as: 'ingredient', attributes: ['name'] },
                { model: Unit, as: 'unit', attributes: ['name'] },
            ],
            attributes: ['quantity'],
        });
    });

    test('createRecipeIngredient creates a new recipe ingredient', async () => {
        const newIngredient = { recipeId: 1, ingredientId: 3, quantity: 50, unitId: 2 };
        jest.spyOn(RecipeIngredient, 'create').mockResolvedValue(newIngredient as RecipeIngredient);

        const created = await createRecipeIngredient(1, 3, 50, 2);

        expect(created).toEqual(newIngredient);
        expect(RecipeIngredient.create).toHaveBeenCalledWith(newIngredient);
    });

    test('updateRecipeIngredient updates a recipe ingredient', async () => {
        jest.spyOn(RecipeIngredient, 'update').mockResolvedValue([1]);

        await updateRecipeIngredient(1, 3, 100, 2);

        expect(RecipeIngredient.update).toHaveBeenCalledWith(
            { quantity: 100, unitId: 2 },
            { where: { recipeId: 1, ingredientId: 3 }, returning: true }
        );
    });

    test('deleteRecipeIngredient deletes a recipe ingredient', async () => {
        jest.spyOn(RecipeIngredient, 'destroy').mockResolvedValue(1);

        await deleteRecipeIngredient(1, 3);

        expect(RecipeIngredient.destroy).toHaveBeenCalledWith({ where: { recipeId: 1, ingredientId: 3 } });
    });

    test('addIngredientToRecipe adds a new ingredient to a recipe', async () => {
        const newIngredient = { recipeId: 1, ingredientId: 4, quantity: 75, unitId: 1 };
        jest.spyOn(RecipeIngredient, 'create').mockResolvedValue(newIngredient as RecipeIngredient);

        const added = await addIngredientToRecipe(1, 4, 75, 1);

        expect(added).toEqual(newIngredient);
        expect(RecipeIngredient.create).toHaveBeenCalledWith(newIngredient);
    });
});
