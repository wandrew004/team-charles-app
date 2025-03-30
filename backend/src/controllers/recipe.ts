import { recipe } from "../models/init-models"; // Adjust the import path as needed

export const getRecipes = async (): Promise<recipe[]> => {
    return recipe.findAll();
};

export const getRecipeById = async (id: number): Promise<recipe | null> => {
    return recipe.findByPk(id);
};

export const createRecipe = async (name: string, description?: string): Promise<recipe> => {
    return recipe.create({
        name,
        description,
    });
};

export const updateRecipe = async (id: number, name: string, description: string): Promise<recipe | null> => {
    const [_, updated] = await recipe.update(
        {
            name,
            description,
        },
        {
            where: {
                id: id
            },
            returning: true,
        }
    );
    return updated[0] || null;
};

export const deleteRecipe = async (id: number): Promise<void> => {
    await recipe.destroy({
        where: {
            id,
        },
    });
};
