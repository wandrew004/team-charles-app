import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Box, Button } from '@mui/material';
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
        <div className="w-full h-64 mb-4 relative rounded-lg shadow-lg overflow-hidden">
          <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white opacity-30"></div>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe Title"
          className="text-3xl font-bold mb-2 w-full p-2 rounded focus:outline-none"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe Description"
          className="text-xl mb-2 w-full p-2 rounded focus:outline-none"
        />
        <div className="flex items-center gap-4 text-sm text-[#7B8A64] mb-4">
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
                className="underline bg-transparent focus:outline-none"
              />
            ) : (
              <span onClick={() => setIsEditingLink(true)} className="underline cursor-pointer">
                {link || 'add link..'}
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-row gap-8">
          <IngredientsBox ingredients={ingredients} setIngredients={setIngredients} API_BASE={API_BASE} />
          <InstructionsBox instructions={instructions} setInstructions={setInstructions} />
        </div>
        <Box mt={4}>
          <Button type="submit" variant="contained" fullWidth onClick={handleSubmit}>
            Submit Recipe
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default RecipeFormPage;
