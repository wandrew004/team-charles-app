import { unit } from '../models/init-models'; // Adjust path as needed

// Get all units
export const getUnits = async (): Promise<unit[]> => {
    return unit.findAll();
};

// Get a unit by ID
export const getUnitById = async (id: number): Promise<unit | null> => {
    return unit.findByPk(id);
};

// Create a new unit
export const createUnit = async (
    name: string,
    type: string
): Promise<unit> => {
    return unit.create({
        name,
        type,
    });
};

// Update a unit
export const updateUnit = async (
    id: number,
    name: string,
    type: string
): Promise<unit | null> => {
    const [_, updated] = await unit.update(
        { name, type },
        {
            where: { id },
            returning: true,
        }
    );
    return updated[0] || null;
};

// Delete a unit
export const deleteUnit = async (id: number): Promise<void> => {
    await unit.destroy({
        where: { id },
    });
};
