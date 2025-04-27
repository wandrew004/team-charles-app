import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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

const RecipeFormPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
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
  const navigate = useNavigate();

  const mutation = useSubmitRecipe();

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
              placeholder="paste recipe text here"
              className="w-full h-40 p-2 border rounded focus:outline-none lowercase"
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={() => setImportTextModalOpen(false)}>
              cancel
            </Button>
            <Button sx={{ textTransform: 'none', color: '#7B8A64' }} onClick={() => setImportTextModalOpen(false)}>
              ok
            </Button>
          </DialogActions>
        </Dialog>

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
