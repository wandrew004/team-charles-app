import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import Sidebar from './Sidebar';

interface IngredientEntry {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeData {
  id: number;
  name: string;
  description: string;
  date: string;
  link: string;
  headerImage: string;
  recipeIngredients: {
    quantity: string;
    ingredient: {
      name: string;
    };
    unit: {
      name: string;
    };
  }[];
  recipeSteps: {
    recipeId: number;
    stepId: number;
    step: {
      stepNumber: number;
      stepText: string;
    };
  }[];
}

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

const useFetchRecipe = (id: string) => {
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${API_BASE}/recipes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json();
      console.log('Fetched recipe data:', data);
      setRecipe(data);
    } catch (err: unknown) {
      console.error('Error fetching recipe:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  return { recipe, loading, error, refetch: fetchRecipe };
};

const useUpdateRecipe = () => {
  return useMutation({
    mutationFn: async (data: RecipeData) => {
      const response = await fetch(`${API_BASE}/recipes/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
      return response.json();
    },
  });
};

interface Unit {
  unitID: number;
  name: string;
  type: string;
}

interface IngredientsBoxProps {
  ingredients: IngredientEntry[];
  setIngredients: (ings: IngredientEntry[]) => void;
}

const IngredientsBox: React.FC<IngredientsBoxProps> = ({ ingredients, setIngredients }) => {
  const fetchUnits = async (): Promise<Unit[]> => {
    const response = await fetch(`${API_BASE}/units`);
    if (!response.ok) {
      throw new Error('Failed to fetch units');
    }
    return response.json();
  };

  const { data: standardUnits, isLoading: unitsLoading, error: unitsError } = useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const handleNameChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    const numericValue = Number(value);
    // Only update if the value is a valid number
    if (!isNaN(numericValue)) {
      newIngredients[index].quantity = numericValue;
      setIngredients(newIngredients);
    }
  };

  const handleUnitChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].unit = value;
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ingredients[index].name.trim() !== '') {
        setIngredients([...ingredients, { name: '', quantity: 0, unit: '' }]);
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
              type="number"
              placeholder="quantity"
              value={ingredient.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              className="w-12 p-1 outline-none"
              min="0"
              step="0.01"
            />
            <select
              value={ingredient.unit}
              onChange={(e) => handleUnitChange(index, e.target.value)}
              className="p-1 outline-none"
            >
              <option value="">--</option>
              {unitsLoading ? (
                <option>Loading units...</option>
              ) : unitsError ? (
                <option>Error loading units</option>
              ) : (
                standardUnits?.map((unit: Unit) => (
                  <option key={unit.unitID} value={unit.unitID}>
                    {unit.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

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

const RecipeUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error, refetch } = useFetchRecipe(id!);
  const updateMutation = useUpdateRecipe();
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([{ name: '', quantity: 0, unit: '' }]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const headerImage = recipe?.headerImage || "/default.jpg";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description);
      setDate(recipe.date);
      setLink(recipe.link);
      setIngredients(recipe.recipeIngredients.map(ing => ({
        name: ing.ingredient.name,
        quantity: parseFloat(ing.quantity),
        unit: ing.unit.name
      })));
      setInstructions(recipe.recipeSteps.map(step => step.step.stepText));
    }
  }, [recipe]);

  const handleUpdate = () => {
    if (recipe) {
      const updatedRecipe: RecipeData = {
        ...recipe,
        name,
        description,
        date,
        link,
        headerImage,
        recipeIngredients: ingredients
          .filter(ing => ing.name.trim() !== '')
          .map(ing => ({
            quantity: ing.quantity.toString(),
            ingredient: {
              name: ing.name
            },
            unit: {
              name: ing.unit
            }
          })),
        recipeSteps: instructions
          .filter(step => step.trim() !== '')
          .map((stepText, index) => ({
            recipeId: recipe.id,
            stepId: index + 1,
            step: {
              stepNumber: index + 1,
              stepText
            }
          }))
      };
      updateMutation.mutate(updatedRecipe, {
        onSuccess: () => {
          refetch();
          setShowSuccess(true);
        }
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

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
          <IngredientsBox ingredients={ingredients} setIngredients={setIngredients} />
          <InstructionsBox instructions={instructions} setInstructions={setInstructions} />
        </div>
        <Box mt={4}>
          <Button type="button" variant="contained" fullWidth onClick={handleUpdate}>
            Update Recipe
          </Button>
        </Box>
      </main>
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Recipe updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RecipeUpdatePage;
