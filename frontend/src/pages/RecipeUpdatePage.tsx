import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Box, Button } from '@mui/material';
import Sidebar from './Sidebar';

interface IngredientEntry {
  name: string;
  amount: string;
  measure: string; // holds the UnitID as a string (or empty)
}

interface RecipeData {
  id: number;
  title: string;
  date: string;
  link: string;
  headerImage: string;
  ingredients: IngredientEntry[];
  instructions: string[];
}

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

const useFetchRecipe = (id: string) => {
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE}/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err: unknown) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
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
  const { recipe, loading, error } = useFetchRecipe(id!);
  const updateMutation = useUpdateRecipe();

  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const headerImage = recipe?.headerImage || "/default.jpg";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDate(recipe.date);
      setLink(recipe.link);
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
    }
  }, [recipe]);

  const handleUpdate = () => {
    if (recipe) {
      const updatedRecipe: RecipeData = {
        ...recipe,
        title,
        date,
        link,
        headerImage,
        ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
        instructions: instructions.filter(step => step.trim() !== '')
      };
      updateMutation.mutate(updatedRecipe, {
        onSuccess: () => {
          navigate(`/recipe/${recipe.id}`);
        }
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-[#7B8A64]">
      {sidebarOpen && <Sidebar currentTitle={title} />}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="text-3xl font-bold mb-2 w-full p-2 rounded focus:outline-none"
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
    </div>
  );
};

export default RecipeUpdatePage;
