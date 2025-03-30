import { recipeingredient } from '../models/init-models'; // Adjust if needed

export const getRecipeIngredients = async (recipeid: number): Promise<recipeingredient[]> => {
    return recipeingredient.findAll({
        where: {
            recipeid,
        },
    });
};

export const createRecipeIngredient = async (
    recipeid: number,
    ingredientid: number,
    quantity: number,
    unitid: number
): Promise<recipeingredient> => {
    return recipeingredient.create({
        recipeid,
        ingredientid,
        quantity,
        unitid,
    });
};

export const addIngredientToRecipe = createRecipeIngredient;

export const updateRecipeIngredient = async (
    recipeid: number,
    ingredientid: number,
    quantity: number,
    unitid: number
): Promise<recipeingredient | null> => {
    const [_, updated] = await recipeingredient.update(
        {
            quantity,
            unitid,
        },
        {
            where: {
                recipeid,
                ingredientid,
            },
            returning: true,
        }
    );
    return updated[0] || null;
};

export const deleteRecipeIngredient = async (
    recipeid: number,
    ingredientid: number
): Promise<void> => {
    await recipeingredient.destroy({
        where: {
            recipeid,
            ingredientid,
        },
    });
};
