export type RecipeFormData = {
    name: string;
    description: string;
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: { stepNumber: number; stepText: string }[];
};