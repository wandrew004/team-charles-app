import { IngredientQuantity } from 'types/ingredientQuantity';
import { ingredient, recipeingredient, unit } from "../models/init-models";

export const getIngredients = async (): Promise<ingredient[]> => {
    return ingredient.findAll();
};

export const getIngredientById = async (id: number): Promise<ingredient | null> => {
    return ingredient.findByPk(id);
};

export const getIngredientsForRecipe = async (recipeid: number): Promise<IngredientQuantity[]> => {
    const recipeIngredients = await recipeingredient.findAll({
        where: { recipeid: recipeid },
        include: [
            {
                model: ingredient,
                attributes: ['name'],
            },
            {
                model: unit,
                attributes: ['name'],
            },
        ],
        attributes: ['quantity'],
    });
    
    return recipeIngredients.map(ri => ({
        name: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.unit.name,
    }));
};

export const createIngredient = async (name: string, description?: string, standard_unit?: number, density?: number): Promise<ingredient> => {
    return ingredient.create({
        name: name,
        description: description,
        standard_unit: standard_unit,
        density: density
    });
};

export const updateIngredient = async (
    id: number,
    name: string,
    description?: string,
    standard_unit?: number,
    density?: number
): Promise<ingredient | null> => {
    const [_, updated] = await ingredient.update(
        {
            name,
            description,
            standard_unit,
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
    await ingredient.destroy({
        where: {
            id: id
        }
    });
};