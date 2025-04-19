import { GoogleGenerativeAI } from '@google/generative-ai';
import { RecipeFormData } from 'types/recipeFormData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PROMPT_TEMPLATE = `
Extract the following information from the recipe text and format it as JSON:
1. Recipe name - Extract ONLY the name of the food/dish, not the full title. For example:
   - If title is "The Best Chocolate Chip Cookies Recipe", name should be "Chocolate Chip Cookies"
   - If title is "Easy Homemade Pizza Dough", name should be "Pizza Dough"
   - If title is "How to Make Italian Sausage and Peppers", name should be "Italian Sausage and Peppers"
2. Recipe description - Keep the description brief, no more than 50 words.
3. List of ingredients with:
   - ingredient name
   - quantity
   - unit (use the following unit IDs: g=1, kg=2, oz=3, lb=4, mg=5, ml=6, l=7, tsp=8, tbsp=9, cup=10, quart=11, pint=12, fl oz=13, dash=14, pinch=15, piece=16, slice=17, can=18, bottle=19, unit=20)
4. List of steps with:
   - step number
   - step text

Format the response as a JSON object with the following structure:
{
  "name": "string",
  "description": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": number,
      "unit": number
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "stepText": "string"
    }
  ]
}

Recipe text:
{recipeText}
`;

//TODO: Edit prompt for ingredients names to be standardized

export const extractRecipeFromText = async (recipeText: string): Promise<RecipeFormData> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = PROMPT_TEMPLATE.replace('{recipeText}', recipeText);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/^```json\s*|\s*```$/g, '');
        
        const recipeData = JSON.parse(cleanedText) as RecipeFormData;
        return recipeData;
    } catch (error) {
        console.error('Error extracting recipe:', error);
        throw new Error('Failed to extract recipe from text');
    }
}; 