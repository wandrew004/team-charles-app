import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Box, Button } from '@mui/material';

interface IngredientEntry {
  name: string;
  amount: string;
  measure: string;
}

interface CreateRecipeData {
  title: string;
  date: string;
  link: string;
  headerImage: string;
  ingredients: IngredientEntry[];
  instructions: string[];
}

interface Recipe {
  id: number;
  name: string;
  headerImage: string;
  date: string;
  link: string;
}

// Dummy recipes for sidebar navigation
const recipes: Recipe[] = [
  {
    id: 1,
    name: 'Spaghetti Bolognese',
    headerImage: '/spaghetti.jpg',
    date: '3/15/2025',
    link: 'https://example.com/spaghetti'
  },
  {
    id: 2,
    name: 'Chicken Curry',
    headerImage: '/chicken-curry.jpg',
    date: '3/16/2025',
    link: 'https://example.com/chicken-curry'
  },
  {
    id: 3,
    name: 'Garden Salad',
    headerImage: '/salad.jpg',
    date: '3/17/2025',
    link: 'https://example.com/salad'
  },
];

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

// React Query mutation hook for submitting a recipe
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

// Controlled IngredientsBox component
interface IngredientsBoxProps {
  ingredients: IngredientEntry[];
  setIngredients: (ings: IngredientEntry[]) => void;
}

const IngredientsBox: React.FC<IngredientsBoxProps> = ({ ingredients, setIngredients }) => {
  const handleNameChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
  };

  const handleAmountChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].amount = value;
    setIngredients(newIngredients);
  };

  const handleMeasureChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].measure = value;
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ingredients[index].name.trim() !== '') {
        setIngredients([...ingredients, { name: '', amount: '', measure: '' }]);
      }
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4 mt-6 w-1/2 min-h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="mr-2 font-semibold">{index + 1}.)</span>
          <input
            type="text"
            placeholder="add ingredient..."
            value={ingredient.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="flex-1 p-2 rounded focus:outline-none"
          />
          <div className="flex items-center ml-2 border border-black rounded p-1">
            <input
              type="text"
              placeholder="amt"
              value={ingredient.amount}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              className="w-12 p-1 outline-none"
            />
            <select
              value={ingredient.measure}
              onChange={(e) => handleMeasureChange(index, e.target.value)}
              className="p-1 outline-none"
            >
              <option value="">--</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="cup">cup</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

// Controlled InstructionsBox component
interface InstructionsBoxProps {
  instructions: string[];
  setInstructions: (ins: string[]) => void;
}

const InstructionsBox: React.FC<InstructionsBoxProps> = ({ instructions, setInstructions }) => {
  const handleInputChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (instructions[index].trim() !== '') {
        setInstructions([...instructions, '']);
      }
    }
  };

  return (
    <div className="relative p-4 mt-6 w-1/2">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      {instructions.map((step, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="mr-2 font-semibold">{index + 1}.)</span>
          <input
            type="text"
            placeholder="add step..."
            value={step}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="flex-1 p-2 rounded focus:outline-none bg-transparent"
          />
        </div>
      ))}
    </div>
  );
};

// CreateRecipePage component with sidebar and React Query mutation
const CreateRecipePage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([
    { name: '', amount: '', measure: '' },
  ]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const headerImage = "/Brownie_Header.jpg";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mutation = useSubmitRecipe();

  const handleSubmit = () => {
    const newRecipe: CreateRecipeData = {
      title,
      date,
      link,
      headerImage,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      instructions: instructions.filter(step => step.trim() !== '')
    };
    mutation.mutate(newRecipe);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-[#7B8A64]">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-100 border-r p-4 min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <Link to="/recipes" className="text-xl">←</Link>
            <button className="text-xl" onClick={() => setSidebarOpen(false)}>☰</button>
          </div>
          <h2 className="text-xl font-bold mb-4">Recipes</h2>
          <ul>
            {/* New Recipe item with dark grey highlight */}
            <li className="p-2 cursor-pointer rounded mb-2 bg-gray-300 ">
              {title.trim() !== '' ? title : "New Recipe"}
            </li>
            {recipes.map((recipe) => (
              <li key={recipe.id} className="p-2 cursor-pointer rounded mb-2 hover:bg-gray-200">
                <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 relative overflow-y-auto">
        {!sidebarOpen && (
          <button className="absolute top-2 left-2 text-xl" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}

        {/* Header Image Container */}
        <div className="w-full h-64 mb-4 relative rounded-lg shadow-lg overflow-hidden">
          <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white opacity-30"></div>
        </div>

        {/* Recipe Title Input without border */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="text-3xl font-bold mb-2 w-full p-2 rounded focus:outline-none"
        />

        {/* Date and Link Row */}
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

        {/* 2-Column Section for Ingredients + Instructions */}
        <div className="flex flex-row gap-8">
          <IngredientsBox ingredients={ingredients} setIngredients={setIngredients} />
          <InstructionsBox instructions={instructions} setInstructions={setInstructions} />
        </div>

        {/* Submit Button */}
        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleSubmit}
          >
            Submit Recipe
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default CreateRecipePage;
