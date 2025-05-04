import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Snackbar } from '@mui/material';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import IngredientsBox from '../components/IngredientsBox';
import InstructionsBox from '../components/InstructionsBox';

interface IngredientEntry {
  ingredientId: number;
  quantity: number;
  unitId: number;
}

interface CreateRecipeData {
  name: string;
  description: string;
  date: string;
  link: string;
  headerImage: string;
  ingredients: {
    ingredientId: number;
    quantity: number;
    unitId: number;
  }[];
  steps: {
    stepNumber: number;
    stepText: string;
  }[];
}

interface ExtractedRecipeData {
  name: string;
  description: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: number;
  }[];
  steps: {
    stepNumber: number;
    stepText: string;
  }[];
}

interface CreatedIngredient {
  id: number;
  name: string;
  description: string;
  standardUnit: number;
}

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

const useSubmitRecipe = () => {
  return useMutation({
    mutationFn: async (data: CreateRecipeData) => {
      const response = await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

const useExtractRecipe = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch(`${API_BASE}/ai-recipes/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        credentials: 'include',
        body: text,
      });
      if (!response.ok) {
        throw new Error('Failed to extract recipe');
      }
      return response.json();
    },
  });
};

const useCreateIngredient = () => {
  return useMutation({
    mutationFn: async (data: { name: string; description: string; standardUnit: number }) => {
      const response = await fetch(`${API_BASE}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create ingredient');
      }
      return response.json();
    },
  });
};

const RecipeFormPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  // const [date, setDate] = useState<string>(new Date().toLocaleDateString()); -- commented out for live demo
  // const [link, setLink] = useState<string>(''); -- commented out for live demo
  const [date] = useState<string>(new Date().toLocaleDateString());
  const [link] = useState<string>('');
  // const [isEditingLink, setIsEditingLink] = useState<boolean>(false); -- commented out for live demo
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([
    { ingredientId: 0, quantity: 0, unitId: 0 },
  ]);
  const [instructions, setInstructions] = useState<Array<{stepId: number; stepNumber: number; stepText: string}>>([{ 
    stepId: 1,
    stepNumber: 1,
    stepText: ''
  }]);
  const headerImage = "/Brownie_Header.jpg";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTextModalOpen, setImportTextModalOpen] = useState(false);
  const [importImageModalOpen, setImportImageModalOpen] = useState(false);
  const [recipeText, setRecipeText] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showIngredientConfirm, setShowIngredientConfirm] = useState(false);
  const [extractedRecipe, setExtractedRecipe] = useState<ExtractedRecipeData | null>(null);
  const [ingredientQuantities, setIngredientQuantities] = useState<Record<string, number>>({});
  const [createdIngredients, setCreatedIngredients] = useState<CreatedIngredient[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useSubmitRecipe();
  const extractMutation = useExtractRecipe();
  const createIngredientMutation = useCreateIngredient();

  const handleExtractRecipe = async () => {
    try {
      const result = await extractMutation.mutateAsync(recipeText);
      setExtractedRecipe(result);
      setShowIngredientConfirm(true);
      setImportTextModalOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to extract recipe');
      setShowError(true);
    }
  };

  const handleConfirmIngredients = async () => {
    if (!extractedRecipe) return;

    try {
      const ingredientPromises = extractedRecipe.ingredients.map(async (ing) => {
        const result = await createIngredientMutation.mutateAsync({
          name: ing.name,
          description: `Ingredient extracted from recipe: ${extractedRecipe.name}`,
          standardUnit: ing.unit,
        });
        return result;
      });

      const newIngredients = await Promise.all(ingredientPromises);
      setCreatedIngredients(newIngredients);

      await queryClient.invalidateQueries({ queryKey: ['ingredients'] });

      setName(extractedRecipe.name);
      setDescription(extractedRecipe.description);
      setInstructions(
        extractedRecipe.steps.map((step, index) => ({
          stepId: index + 1,
          stepNumber: step.stepNumber,
          stepText: step.stepText,
        }))
      );

      setIngredients(
        extractedRecipe.ingredients.map((ing, index) => ({
          ingredientId: newIngredients[index].id,
          quantity: ingredientQuantities[ing.name] || ing.quantity,
          unitId: ing.unit,
        }))
      );

      setShowIngredientConfirm(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create ingredients');
      setShowError(true);
    }
  };

  const handleSubmit = () => {
    const newRecipe: CreateRecipeData = {
      name,
      description,
      date,
      link,
      headerImage,
      ingredients: ingredients
        .filter(ing => ing.ingredientId !== 0)
        .map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: Number(ing.quantity),
          unitId: ing.unitId
        })),
      steps: instructions
        .filter(step => step.stepText.trim() !== '')
        .map(step => ({
          stepNumber: step.stepNumber,
          stepText: step.stepText
        }))
    };
    mutation.mutate(newRecipe, {
      onSuccess: (response) => {
        if (response && response.recipeId) {
          navigate(`/update/${response.recipeId}`);
        } else {
          console.error('No recipe ID received from server');
          navigate('/recipes');
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-[#7B8A64]">
      {sidebarOpen && <Sidebar currentTitle={name} />}
      <main className="flex-1 p-8 relative overflow-y-auto">
        {!sidebarOpen && (
          <button className="absolute top-2 left-2 text-xl" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}
        {/* <div className="w-full h-64 mb-4 relative rounded-lg shadow-lg overflow-hidden">
          <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white opacity-30"></div>
        </div> */}
        {/* Title and Import Button */}
        <div className="flex items-center mb-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="recipe title"
            className="text-3xl font-bold w-full p-2 rounded focus:outline-none"
          />
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              color: '#7B8A64',
              borderColor: '#7B8A64',
              minWidth: '150px',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setImportModalOpen(true)}
          >
            import recipe
          </Button>
        </div>
        {/* Description */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="recipe description"
          className="text-xl mb-2 w-full p-2 rounded focus:outline-none lowercase"
        />
        {/* Date and Link */}
        {/* <div className="flex items-center gap-4 text-sm text-[#7B8A64] mb-4 lowercase">
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="focus:outline-none"
          />
          <span className="flex items-center gap-1">
            {isEditingLink ? (
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onBlur={() => setIsEditingLink(false)}
                placeholder="add link.."
                className="underline bg-transparent focus:outline-none lowercase"
              />
            ) : (
              <span onClick={() => setIsEditingLink(true)} className="underline cursor-pointer lowercase">
                {link || 'add link..'}
              </span>
            )}
          </span>
        </div> */}
        {/* Ingredient & Instructions */}
        <div className="flex flex-row gap-8">
          <IngredientsBox ingredients={ingredients} setIngredients={setIngredients} API_BASE={API_BASE} />
          <InstructionsBox instructions={instructions} setInstructions={setInstructions} />
        </div>
        {/* Submit */}
        <Box mt={4}>
          <Button type="submit" variant="contained" fullWidth onClick={handleSubmit}>
            submit recipe
          </Button>
        </Box>

        {/* Import Option Modal */}
        <Dialog open={importModalOpen} onClose={() => setImportModalOpen(false)}>
          <DialogTitle sx={{ textTransform: 'none', color: '#7B8A64' }}>import recipe</DialogTitle>
          <DialogContent className="flex flex-col gap-2">
            <Button
              variant="outlined"
              sx={{ textTransform: 'none', color: '#7B8A64', borderColor: '#7B8A64' }}
              onClick={() => { setImportTextModalOpen(true); setImportModalOpen(false); }}
            >
              import text
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: 'none', color: '#7B8A64', borderColor: '#7B8A64' }}
              onClick={() => { setImportImageModalOpen(true); setImportModalOpen(false); }}
            >
              import image
            </Button>
          </DialogContent>
        </Dialog>

        {/* Import Text Modal */}
        <Dialog open={importTextModalOpen} onClose={() => setImportTextModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ textTransform: 'none', color: '#7B8A64' }}>import text</DialogTitle>
          <DialogContent>
            <textarea
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              placeholder="paste recipe text here"
              className="w-full h-40 p-2 border rounded focus:outline-none lowercase"
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={() => setImportTextModalOpen(false)}>
              cancel
            </Button>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={handleExtractRecipe}>
              extract
            </Button>
          </DialogActions>
        </Dialog>

        {/* Ingredient Confirmation Modal */}
        <Dialog open={showIngredientConfirm} onClose={() => setShowIngredientConfirm(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ textTransform: 'none', color: '#7B8A64' }}>Confirm Ingredients</DialogTitle>
          <DialogContent>
            {extractedRecipe?.ingredients.map((ingredient) => (
              <Box key={ingredient.name} className="flex items-center gap-2 mb-2">
                <TextField
                  label={ingredient.name}
                  type="number"
                  value={ingredientQuantities[ingredient.name] || ingredient.quantity}
                  onChange={(e) => setIngredientQuantities({
                    ...ingredientQuantities,
                    [ingredient.name]: parseFloat(e.target.value)
                  })}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <span className="text-[#7B8A64]">units</span>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={() => setShowIngredientConfirm(false)}>
              cancel
            </Button>
            <Button 
              sx={{ textTransform: 'none', color: '#7B8A64' }} 
              onClick={handleConfirmIngredients}
              disabled={createIngredientMutation.isPending}
            >
              {createIngredientMutation.isPending ? 'Creating ingredients...' : 'confirm'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>

        {/* Import Image Modal */}
        <Dialog open={importImageModalOpen} onClose={() => setImportImageModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ textTransform: 'none', color: '#7B8A64' }}>upload images</DialogTitle>
          <DialogContent>
            <Box className="border-2 border-dashed h-40 flex items-center justify-center rounded text-[#7B8A64] lowercase">
              upload images
            </Box>
          </DialogContent>
          <DialogActions>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={() => setImportImageModalOpen(false)}>
              close
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default RecipeFormPage;
