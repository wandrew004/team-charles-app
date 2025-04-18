export type RecipeFormData = {
    name: string;
    description: string;
    ingredients: { ingredientId: number; quantity: number; unitId: number }[];
    steps: { stepNumber: number; stepText: string }[];
};