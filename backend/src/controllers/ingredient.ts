import { IngredientQuantity } from 'types/ingredientQuantity';
import { Ingredient, RecipeIngredient, Unit } from "../models/init-models";

export const getIngredients = async (): Promise<Ingredient[]> => {
    return Ingredient.findAll();
};

export const getIngredientById = async (id: number): Promise<Ingredient | null> => {
    return Ingredient.findByPk(id);
};

// export const getIngredientsForRecipe = async (recipeid: number): Promise<IngredientQuantity[]> => {
//     const recipeIngredients = await RecipeIngredient.findAll({
//         where: { recipeId: recipeid },
//         include: [
//             {
//                 model: Ingredient,
//                 attributes: ['name'],
//             },
//             {
//                 model: Unit,
//                 attributes: ['name'],
//             },
//         ],
//         attributes: ['quantity'],
//     });
    
//     return recipeIngredients.map(ri => ({
//         name: ri.ingredient.name,
//         quantity: ri.quantity,
//         unit: ri.unit.name,
//     }));
// };

export const createIngredient = async (name: string, description?: string, standardUnit?: number, density?: number): Promise<Ingredient> => {
    return Ingredient.create({
        name,
        description,
        standardUnit,
        density
    });
};

export const updateIngredient = async (
    id: number,
    name: string,
    description?: string,
    standardUnit?: number,
    density?: number
): Promise<Ingredient | null> => {
    const [_, updated] = await Ingredient.update(
        {
            name,
            description,
            standardUnit,
            density,
        },
        {
            where: { id },
            returning: true, // 🔥 gets the updated row(s) back
        }
    );
    
    return updated[0] || null;
};

export const deleteIngredient = async (id: number): Promise<void> => {
    await Ingredient.destroy({
        where: {
            id: id
        }
    });
};