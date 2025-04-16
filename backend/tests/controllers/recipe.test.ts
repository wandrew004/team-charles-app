import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, getUserRecipes, getUserRecipeById, createUserRecipe, updateUserRecipe, deleteUserRecipe } from '../../src/controllers/recipe';
import { Recipe, RecipeIngredient, RecipeStep, Ingredient, Unit, Step } from '../../src/models/init-models';

jest.mock('../../src/models/init-models');

const mockRecipes = [
    { id: 1, name: 'Cake', description: 'Delicious cake' },
    { id: 2, name: 'Bread', description: 'Fresh bread' },
];

const mockUserRecipes = [
    { id: 1, name: 'User Cake', description: 'User delicious cake', userId: 1 },
    { id: 2, name: 'User Bread', description: 'User fresh bread', userId: 1 },
];

const mockRecipeDetail = {
    id: 1,
    name: 'Cake',
    description: 'Delicious cake',
    recipeIngredients: [
        { quantity: 200, ingredient: { name: 'Flour' }, unit: { name: 'grams' } },
        { quantity: 100, ingredient: { name: 'Sugar' }, unit: { name: 'grams' } },
    ],
    recipeSteps: [
        { step: { stepNumber: 1, stepText: 'Mix ingredients' } },
        { step: { stepNumber: 2, stepText: 'Bake the mixture' } },
    ],
};

const mockUserRecipeDetail = {
    id: 1,
    name: 'User Cake',
    description: 'User delicious cake',
    userId: 1,
    recipeIngredients: [
        { quantity: 200, ingredient: { name: 'Flour' }, unit: { name: 'grams' } },
        { quantity: 100, ingredient: { name: 'Sugar' }, unit: { name: 'grams' } },
    ],
    recipeSteps: [
        { step: { stepNumber: 1, stepText: 'Mix ingredients' } },
        { step: { stepNumber: 2, stepText: 'Bake the mixture' } },
    ],
};

describe('Recipe Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getRecipes returns all recipes', async () => {
        jest.spyOn(Recipe, 'findAll').mockResolvedValue(mockRecipes as Recipe[]);

        const recipes = await getRecipes();

        expect(recipes).toEqual(mockRecipes);
        expect(Recipe.findAll).toHaveBeenCalledWith({ attributes: ['id', 'name', 'description'] });
    });

    test('getRecipeById returns a single detailed recipe by ID', async () => {
        jest.spyOn(Recipe, 'findByPk').mockResolvedValue(mockRecipeDetail as unknown as Recipe);

        const recipe = await getRecipeById(1);

        expect(recipe).toEqual(mockRecipeDetail);
        expect(Recipe.findByPk).toHaveBeenCalledWith(1, {
            include: [
                {
                    model: RecipeIngredient,
                    as: 'recipeIngredients',
                    include: [
                        { model: Ingredient, as: 'ingredient', attributes: ['name'] },
                        { model: Unit, as: 'unit', attributes: ['name'] },
                    ],
                    attributes: ['quantity'],
                },
                {
                    model: RecipeStep,
                    as: 'recipeSteps',
                    include: [
                        { model: Step, as: 'step', attributes: ['stepNumber', 'stepText'] },
                    ],
                },
            ],
        });
    });

    test('createRecipe creates a new recipe', async () => {
        const newRecipe = { id: 3, name: 'Cookies', description: 'Crunchy cookies' };
        jest.spyOn(Recipe, 'create').mockResolvedValue(newRecipe as Recipe);

        const created = await createRecipe('Cookies', 'Crunchy cookies');

        expect(created).toEqual(newRecipe);
        expect(Recipe.create).toHaveBeenCalledWith({ name: 'Cookies', description: 'Crunchy cookies' });
    });

    test('updateRecipe updates a recipe', async () => {
        jest.spyOn(Recipe, 'update').mockResolvedValue([1]);

        await updateRecipe(1, 'Updated Cake', 'More delicious cake');

        expect(Recipe.update).toHaveBeenCalledWith(
            { name: 'Updated Cake', description: 'More delicious cake' },
            { where: { id: 1 }, returning: true }
        );
    });

    test('deleteRecipe deletes a recipe by ID', async () => {
        jest.spyOn(Recipe, 'destroy').mockResolvedValue(1);

        await deleteRecipe(1);

        expect(Recipe.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('getUserRecipes returns all recipes for a specific user', async () => {
        jest.spyOn(Recipe, 'findAll').mockResolvedValue(mockUserRecipes as Recipe[]);

        const recipes = await getUserRecipes(1);

        expect(recipes).toEqual(mockUserRecipes);
        expect(Recipe.findAll).toHaveBeenCalledWith({
            where: { userId: 1 },
            attributes: ['id', 'name', 'description'],
        });
    });

    test('getUserRecipeById returns a single detailed recipe by ID for a specific user', async () => {
        jest.spyOn(Recipe, 'findOne').mockResolvedValue(mockUserRecipeDetail as unknown as Recipe);

        const recipe = await getUserRecipeById(1, 1);

        expect(recipe).toEqual(mockUserRecipeDetail);
        expect(Recipe.findOne).toHaveBeenCalledWith({
            where: { id: 1, userId: 1 },
            include: [
                {
                    model: RecipeIngredient,
                    as: 'recipeIngredients',
                    include: [
                        { model: Ingredient, as: 'ingredient', attributes: ['name'] },
                        { model: Unit, as: 'unit', attributes: ['name'] },
                    ],
                    attributes: ['quantity'],
                },
                {
                    model: RecipeStep,
                    as: 'recipeSteps',
                    include: [
                        { model: Step, as: 'step', attributes: ['stepNumber', 'stepText'] },
                    ],
                },
            ],
        });
    });

    test('createUserRecipe creates a new recipe for a specific user', async () => {
        const newRecipe = { id: 3, name: 'User Cookies', description: 'User crunchy cookies', userId: 1 };
        jest.spyOn(Recipe, 'create').mockResolvedValue(newRecipe as Recipe);

        const created = await createUserRecipe(1, 'User Cookies', 'User crunchy cookies');

        expect(created).toEqual(newRecipe);
        expect(Recipe.create).toHaveBeenCalledWith({
            userId: 1,
            name: 'User Cookies',
            description: 'User crunchy cookies',
        });
    });

    test('updateUserRecipe updates a recipe for a specific user', async () => {
        jest.spyOn(Recipe, 'update').mockResolvedValue([1]);

        await updateUserRecipe(1, 1, 'Updated User Cake', 'More delicious user cake');

        expect(Recipe.update).toHaveBeenCalledWith(
            { name: 'Updated User Cake', description: 'More delicious user cake' },
            { where: { id: 1, userId: 1 }, returning: true }
        );
    });

    test('deleteUserRecipe deletes a recipe by ID for a specific user', async () => {
        jest.spyOn(Recipe, 'destroy').mockResolvedValue(1);

        await deleteUserRecipe(1, 1);

        expect(Recipe.destroy).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
    });
});
