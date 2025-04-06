import { Unit, Ingredient, RecipeIngredient } from '../models/init-models';

/**
 * Get all units
 */
export const getUnits = async (): Promise<Unit[]> => {
    return Unit.findAll();
};

/**
 * Get a unit by ID
 */
export const getUnitById = async (id: number): Promise<Unit | null> => {
    return Unit.findByPk(id);
};

/**
 * Create a new unit
 */
export const createUnit = async (
    name: string,
    type: string
): Promise<Unit> => {
    return Unit.create({
        name,
        type,
    });
};

/**
 * Update an existing unit
 */
export const updateUnit = async (
    id: number,
    name: string,
    type: string
): Promise<void> => {
    await Unit.update(
        { name, type },
        {
            where: { id },
            returning: true,
        }
    );
};

/**
 * Delete a unit
 */
export const deleteUnit = async (id: number): Promise<void> => {
    await Unit.destroy({
        where: { id },
    });
};

/**
 * Get all ingredients using this unit (via standard_unit foreign key)
 */
export const getIngredientsForUnit = async (unitId: number): Promise<Ingredient[]> => {
    const unit = await Unit.findByPk(unitId);
    if (!unit) return [];
    return unit.getIngredients();
};

/**
 * Get all recipe ingredients using this unit
 */
export const getRecipeIngredientsForUnit = async (unitId: number): Promise<RecipeIngredient[]> => {
    const unit = await Unit.findByPk(unitId);
    if (!unit) return [];
    return unit.getRecipeIngredients();
};

export const getUnitByName = async (name: string): Promise<Unit | null> => {
    return Unit.findOne({ where: { name } });
};
