import { Ingredient } from '../models/init-models';

export const getIngredients = async (): Promise<Ingredient[]> => {
    return Ingredient.findAll();
};

export const getIngredientById = async (id: number): Promise<Ingredient | null> => {
    return Ingredient.findByPk(id);
};

export const getIngredientByName = async (name: string): Promise<Ingredient | null> => {
    return Ingredient.findOne({ where: { name } });
};

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
): Promise<void> => {
    await Ingredient.update(
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
};

export const deleteIngredient = async (id: number): Promise<void> => {
    await Ingredient.destroy({
        where: {
            id: id
        }
    });
};