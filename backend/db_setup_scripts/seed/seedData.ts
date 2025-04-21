import { RecipeFormData } from '../../src/types/recipeFormData';

// Updated mapping of unit names to IDs based on 0.0.2.sql
const unitMapping: { [key: string]: number } = {
    'g': 1,
    'kg': 2,
    'oz': 3,
    'lb': 4,
    'mg': 5,
    'ml': 6,
    'l': 7,
    'tsp': 8,
    'tbsp': 9,
    'cup': 10,
    'quart': 11,
    'pint': 12,
    'fl oz': 13,
    'dash': 14,
    'pinch': 15,
    'piece': 16,
    'slice': 17,
    'can': 18,
    'bottle': 19,
    'unit': 20
};

// Common ingredients that will be inserted first
export const commonIngredients = [
    { name: 'All-purpose flour', description: 'Basic flour for baking and cooking', standardUnit: unitMapping['cup'], density: 0.59 },
    { name: 'Butter', description: 'Dairy product made from churned cream', standardUnit: unitMapping['cup'], density: 0.911 },
    { name: 'Granulated sugar', description: 'White refined sugar', standardUnit: unitMapping['cup'], density: 0.85 },
    { name: 'Brown sugar', description: 'Brown sugar with molasses', standardUnit: unitMapping['cup'], density: 0.93 },
    { name: 'Eggs', description: 'Chicken eggs, a versatile ingredient', standardUnit: unitMapping['unit'] },
    { name: 'Vanilla extract', description: 'Concentrated vanilla flavoring', standardUnit: unitMapping['tsp'], density: 0.88 },
    { name: 'Baking soda', description: 'Leavening agent for baking', standardUnit: unitMapping['tsp'], density: 2.2 },
    { name: 'Salt', description: 'Basic seasoning for enhancing flavors', standardUnit: unitMapping['tsp'], density: 2.16 },
    { name: 'Chocolate chips', description: 'Small pieces of chocolate for baking', standardUnit: unitMapping['cup'], density: 0.9 },
    { name: 'Salmon fillet', description: 'Fresh salmon cut into fillets', standardUnit: unitMapping['lb'] },
    { name: 'Olive oil', description: 'Oil pressed from olives, used for cooking and dressing', standardUnit: unitMapping['tbsp'], density: 0.92 },
    { name: 'Lemon', description: 'Citrus fruit with sour juice', standardUnit: unitMapping['unit'] },
    { name: 'Fresh dill', description: 'Aromatic herb with feathery leaves', standardUnit: unitMapping['cup'] },
    { name: 'Garlic', description: 'Aromatic bulb used for flavoring', standardUnit: unitMapping['unit'] },
    { name: 'Black pepper', description: 'Ground black peppercorns for seasoning', standardUnit: unitMapping['tsp'], density: 0.4 },
    { name: 'Broccoli', description: 'Green vegetable with dense clusters of flower buds', standardUnit: unitMapping['cup'] },
    { name: 'Bell peppers', description: 'Sweet, bell-shaped peppers in various colors', standardUnit: unitMapping['unit'] },
    { name: 'Carrots', description: 'Root vegetable with a sweet taste', standardUnit: unitMapping['unit'] },
    { name: 'Snap peas', description: 'Sweet, crisp pea pods', standardUnit: unitMapping['cup'] },
    { name: 'Soy sauce', description: 'Salty, umami-rich Asian condiment', standardUnit: unitMapping['tbsp'], density: 1.2 },
    { name: 'Sesame oil', description: 'Oil pressed from sesame seeds', standardUnit: unitMapping['tbsp'], density: 0.92 },
    { name: 'Ginger', description: 'Aromatic root with spicy flavor', standardUnit: unitMapping['tbsp'] }      
];

// Sample recipes that will be inserted after ingredients
// Note: ingredientId values will be replaced with actual IDs after ingredients are inserted
export const sampleRecipes: RecipeFormData[] = [
    {
        name: 'Classic Chocolate Chip Cookies',
        description: 'Soft and chewy chocolate chip cookies with a crispy edge',
        ingredients: [
            { ingredientId: 1, quantity: 2.25, unitId: unitMapping['cup'] }, // All-purpose flour
            { ingredientId: 2, quantity: 1, unitId: unitMapping['cup'] }, // Butter
            { ingredientId: 3, quantity: 0.75, unitId: unitMapping['cup'] }, // Granulated sugar
            { ingredientId: 4, quantity: 0.75, unitId: unitMapping['cup'] }, // Brown sugar
            { ingredientId: 5, quantity: 2, unitId: unitMapping['unit'] }, // Eggs
            { ingredientId: 6, quantity: 1, unitId: unitMapping['tsp'] }, // Vanilla extract
            { ingredientId: 7, quantity: 1, unitId: unitMapping['tsp'] }, // Baking soda
            { ingredientId: 8, quantity: 0.5, unitId: unitMapping['tsp'] }, // Salt
            { ingredientId: 9, quantity: 2, unitId: unitMapping['cup'] } // Chocolate chips
        ],
        steps: [
            { stepNumber: 1, stepText: 'Preheat oven to 375°F (190°C)' },
            { stepNumber: 2, stepText: 'Cream together butter and sugars until light and fluffy' },
            { stepNumber: 3, stepText: 'Beat in eggs one at a time, then stir in vanilla' },
            { stepNumber: 4, stepText: 'Combine flour, baking soda, and salt; gradually blend into the butter mixture' },
            { stepNumber: 5, stepText: 'Stir in chocolate chips' },
            { stepNumber: 6, stepText: 'Drop by rounded tablespoons onto ungreased baking sheets' },
            { stepNumber: 7, stepText: 'Bake for 9 to 11 minutes or until golden brown' }
        ]
    },
    {
        name: 'Oven Baked Salmon',
        description: 'Simple and delicious oven-baked salmon with herbs',
        ingredients: [
            { ingredientId: 10, quantity: 1.5, unitId: unitMapping['lb'] }, // Salmon fillet
            { ingredientId: 11, quantity: 2, unitId: unitMapping['tbsp'] }, // Olive oil
            { ingredientId: 12, quantity: 1, unitId: unitMapping['unit'] }, // Lemon
            { ingredientId: 13, quantity: 0.25, unitId: unitMapping['cup'] }, // Fresh dill
            { ingredientId: 14, quantity: 3, unitId: unitMapping['unit'] }, // Garlic
            { ingredientId: 8, quantity: 0.5, unitId: unitMapping['tsp'] }, // Salt
            { ingredientId: 15, quantity: 0.25, unitId: unitMapping['tsp'] } // Black pepper
        ],
        steps: [
            { stepNumber: 1, stepText: 'Preheat oven to 400°F (200°C)' },
            { stepNumber: 2, stepText: 'Place salmon on a baking sheet lined with parchment paper' },
            { stepNumber: 3, stepText: 'Drizzle with olive oil and squeeze lemon juice over the top' },
            { stepNumber: 4, stepText: 'Sprinkle with minced garlic, dill, salt, and pepper' },
            { stepNumber: 5, stepText: 'Bake for 12-15 minutes or until salmon flakes easily with a fork' }
        ]
    },
    {
        name: 'Vegetable Stir Fry',
        description: 'Quick and healthy vegetable stir fry with Asian flavors',
        ingredients: [
            { ingredientId: 16, quantity: 2, unitId: unitMapping['cup'] }, // Broccoli
            { ingredientId: 17, quantity: 2, unitId: unitMapping['unit'] }, // Bell peppers
            { ingredientId: 18, quantity: 2, unitId: unitMapping['unit'] }, // Carrots
            { ingredientId: 19, quantity: 1, unitId: unitMapping['cup'] }, // Snap peas
            { ingredientId: 20, quantity: 3, unitId: unitMapping['tbsp'] }, // Soy sauce
            { ingredientId: 21, quantity: 1, unitId: unitMapping['tbsp'] }, // Sesame oil
            { ingredientId: 22, quantity: 1, unitId: unitMapping['tbsp'] }, // Ginger
            { ingredientId: 14, quantity: 2, unitId: unitMapping['unit'] } // Garlic
        ],
        steps: [
            { stepNumber: 1, stepText: 'Cut all vegetables into bite-sized pieces' },
            { stepNumber: 2, stepText: 'Heat sesame oil in a large wok or skillet over high heat' },
            { stepNumber: 3, stepText: 'Add garlic and ginger, stir-fry for 30 seconds' },
            { stepNumber: 4, stepText: 'Add carrots and broccoli, stir-fry for 2-3 minutes' },
            { stepNumber: 5, stepText: 'Add bell peppers and snap peas, stir-fry for 1-2 minutes' },
            { stepNumber: 6, stepText: 'Pour in soy sauce and stir-fry for 1 more minute' }
        ]
    }
]; 