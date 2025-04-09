export type RecipeFormData = {
    name: string;
    description: string;
    ingredients: { name: string; quantity: number; unit: number }[];
    steps: { stepNumber: number; stepText: string }[];
};