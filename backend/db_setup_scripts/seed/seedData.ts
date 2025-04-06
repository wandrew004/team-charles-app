import { RecipeFormData } from '../../src/types/recipeFormData';

export const sampleRecipes: RecipeFormData[] = [
  {
    name: "Classic Chocolate Chip Cookies",
    description: "Soft and chewy chocolate chip cookies with a crispy edge",
    ingredients: [
      { name: "All-purpose flour", quantity: 2.25, unit: "cups" },
      { name: "Butter", quantity: 1, unit: "cup" },
      { name: "Granulated sugar", quantity: 0.75, unit: "cup" },
      { name: "Brown sugar", quantity: 0.75, unit: "cup" },
      { name: "Eggs", quantity: 2, unit: "whole" },
      { name: "Vanilla extract", quantity: 1, unit: "tsp" },
      { name: "Baking soda", quantity: 1, unit: "tsp" },
      { name: "Salt", quantity: 0.5, unit: "tsp" },
      { name: "Chocolate chips", quantity: 2, unit: "cups" }
    ],
    steps: [
      { stepNumber: 1, stepText: "Preheat oven to 375°F (190°C)" },
      { stepNumber: 2, stepText: "Cream together butter and sugars until light and fluffy" },
      { stepNumber: 3, stepText: "Beat in eggs one at a time, then stir in vanilla" },
      { stepNumber: 4, stepText: "Combine flour, baking soda, and salt; gradually blend into the butter mixture" },
      { stepNumber: 5, stepText: "Stir in chocolate chips" },
      { stepNumber: 6, stepText: "Drop by rounded tablespoons onto ungreased baking sheets" },
      { stepNumber: 7, stepText: "Bake for 9 to 11 minutes or until golden brown" }
    ]
  },
  {
    name: "Oven Baked Salmon",
    description: "Simple and delicious oven-baked salmon with herbs",
    ingredients: [
      { name: "Salmon fillet", quantity: 1.5, unit: "lbs" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Lemon", quantity: 1, unit: "whole" },
      { name: "Fresh dill", quantity: 0.25, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "cloves" },
      { name: "Salt", quantity: 0.5, unit: "tsp" },
      { name: "Black pepper", quantity: 0.25, unit: "tsp" }
    ],
    steps: [
      { stepNumber: 1, stepText: "Preheat oven to 400°F (200°C)" },
      { stepNumber: 2, stepText: "Place salmon on a baking sheet lined with parchment paper" },
      { stepNumber: 3, stepText: "Drizzle with olive oil and squeeze lemon juice over the top" },
      { stepNumber: 4, stepText: "Sprinkle with minced garlic, dill, salt, and pepper" },
      { stepNumber: 5, stepText: "Bake for 12-15 minutes or until salmon flakes easily with a fork" }
    ]
  },
  {
    name: "Vegetable Stir Fry",
    description: "Quick and healthy vegetable stir fry with Asian flavors",
    ingredients: [
      { name: "Broccoli", quantity: 2, unit: "cups" },
      { name: "Bell peppers", quantity: 2, unit: "whole" },
      { name: "Carrots", quantity: 2, unit: "whole" },
      { name: "Snap peas", quantity: 1, unit: "cup" },
      { name: "Soy sauce", quantity: 3, unit: "tbsp" },
      { name: "Sesame oil", quantity: 1, unit: "tbsp" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "cloves" }
    ],
    steps: [
      { stepNumber: 1, stepText: "Cut all vegetables into bite-sized pieces" },
      { stepNumber: 2, stepText: "Heat sesame oil in a large wok or skillet over high heat" },
      { stepNumber: 3, stepText: "Add garlic and ginger, stir-fry for 30 seconds" },
      { stepNumber: 4, stepText: "Add carrots and broccoli, stir-fry for 2-3 minutes" },
      { stepNumber: 5, stepText: "Add bell peppers and snap peas, stir-fry for 1-2 minutes" },
      { stepNumber: 6, stepText: "Pour in soy sauce and stir-fry for 1 more minute" }
    ]
  }
];

export const commonIngredients = [
  { name: "All-purpose flour", description: "Basic flour for baking and cooking" },
  { name: "Butter", description: "Dairy product made from churned cream" },
  { name: "Eggs", description: "Chicken eggs, a versatile ingredient" },
  { name: "Salt", description: "Basic seasoning for enhancing flavors" },
  { name: "Black pepper", description: "Ground black peppercorns for seasoning" },
  { name: "Olive oil", description: "Oil pressed from olives, used for cooking and dressing" },
  { name: "Garlic", description: "Aromatic bulb used for flavoring" },
  { name: "Onion", description: "Bulb vegetable with a strong, pungent flavor" },
  { name: "Rice", description: "Staple grain used in many cuisines" },
  { name: "Chicken", description: "Poultry meat used in various dishes" },
  { name: "Tomatoes", description: "Fruit used as a vegetable in cooking" },
  { name: "Potatoes", description: "Starchy tuber used in many dishes" },
  { name: "Carrots", description: "Root vegetable with a sweet taste" },
  { name: "Bell peppers", description: "Sweet, bell-shaped peppers in various colors" },
  { name: "Broccoli", description: "Green vegetable with dense clusters of flower buds" }
]; 