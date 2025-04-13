import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import Sidebar from './Sidebar';

interface IngredientEntry {
  ingredientId: number;
  quantity: number;
  unitId: number;
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
      id: number;
      name: string;
    };
    unit: {
      id: number;
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

interface Unit {
  id: number;
  name: string;
  type: string;
}

interface Ingredient {
  id: number;
  name: string;
  description?: string;
  standardUnit?: number;
  density?: number;
}

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

const useFetchRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/recipes/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
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

  const fetchIngredients = async (): Promise<Ingredient[]> => {
    const response = await fetch(`${API_BASE}/ingredients`);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    return response.json();
  };

  const { data: units, isLoading: unitsLoading, error: unitsError } = useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const { data: availableIngredients, isLoading: ingredientsLoading, error: ingredientsError } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filteredIngredients = availableIngredients?.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getIngredientName = (ingredientId: number) => {
    return availableIngredients?.find(i => i.id === ingredientId)?.name || '';
  };

  const handleIngredientSearch = (index: number, value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
    setActiveIndex(index);
  };

  const handleIngredientSelect = (index: number, ingredientId: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].ingredientId = ingredientId;
    setIngredients(newIngredients);
    setSearchTerm(getIngredientName(ingredientId));
    setShowDropdown(false);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      newIngredients[index].quantity = numericValue;
    }
    setIngredients(newIngredients);
  };

  const handleUnitChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].unitId = Number(value);
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ingredients[index].ingredientId) {
        setIngredients([...ingredients, { ingredientId: 0, quantity: 0, unitId: 0 }]);
        setSearchTerm('');
        setShowDropdown(false);
        setTimeout(() => {
          const inputs = document.querySelectorAll('.ingredient-input');
          if (inputs.length > 0) {
            (inputs[inputs.length - 1] as HTMLInputElement).focus();
          }
        }, 0);
      }
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4 mt-6 w-1/2 min-h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="mr-2 font-semibold">{index + 1}.)</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search ingredient..."
              value={activeIndex === index ? searchTerm : getIngredientName(ingredient.ingredientId)}
              onChange={(e) => handleIngredientSearch(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full p-2 rounded focus:outline-none ingredient-input"
            />
            {showDropdown && activeIndex === index && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                {ingredientsLoading ? (
                  <div className="p-2">Loading ingredients...</div>
                ) : ingredientsError ? (
                  <div className="p-2">Error loading ingredients</div>
                ) : filteredIngredients.length === 0 ? (
                  <div className="p-2">No ingredients found</div>
                ) : (
                  filteredIngredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleIngredientSelect(index, ing.id)}
                    >
                      {ing.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex items-center ml-2 border border-black rounded p-1">
            <input
              type="text"
              placeholder="0"
              value={ingredient.quantity === 0 ? '' : ingredient.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              className="w-12 p-1 outline-none"
            />
            <select
              value={ingredient.unitId || 0}
              onChange={(e) => handleUnitChange(index, e.target.value)}
              className="p-1 outline-none"
            >
              <option value={0}>Select unit...</option>
              {unitsLoading ? (
                <option>Loading units...</option>
              ) : unitsError ? (
                <option>Error loading units</option>
              ) : (
                units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
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
        // Focus the new input after state update
        setTimeout(() => {
          const inputs = document.querySelectorAll('.instruction-input');
          if (inputs.length > 0) {
            (inputs[inputs.length - 1] as HTMLInputElement).focus();
          }
        }, 0);
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
            className="flex-1 p-2 rounded focus:outline-none bg-transparent instruction-input"
          />
        </div>
      ))}
    </div>
  );
};

const RecipeUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error, refetch } = useFetchRecipe(id!);
  const updateMutation = useUpdateRecipe();
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchUnits = async (): Promise<Unit[]> => {
    const response = await fetch(`${API_BASE}/units`);
    if (!response.ok) {
      throw new Error('Failed to fetch units');
    }
    return response.json();
  };

  const fetchIngredients = async (): Promise<Ingredient[]> => {
    const response = await fetch(`${API_BASE}/ingredients`);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    return response.json();
  };

  const { data: units, isLoading: unitsLoading } = useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const { data: availableIngredients, isLoading: ingredientsLoading } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  });

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([
    { ingredientId: 0, quantity: 0, unitId: 0 },
  ]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const headerImage = recipe?.headerImage || "/default.jpg";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description);
      setDate(recipe.date);
      setLink(recipe.link);
      setIngredients(recipe.recipeIngredients.map((ing: RecipeData['recipeIngredients'][0]) => ({
        ingredientId: ing.ingredient.id,
        quantity: parseFloat(ing.quantity),
        unitId: ing.unit.id
      })));
      setInstructions(recipe.recipeSteps.map((step: RecipeData['recipeSteps'][0]) => step.step.stepText));
    }
  }, [recipe]);

  const handleUpdate = () => {
    if (recipe && units && availableIngredients) {
      const updatedRecipe: RecipeData = {
        ...recipe,
        name,
        description,
        date,
        link,
        headerImage,
        recipeIngredients: ingredients
          .filter(ing => ing.ingredientId !== 0)
          .map(ing => ({
            quantity: ing.quantity.toString(),
            ingredient: {
              id: ing.ingredientId,
              name: availableIngredients.find(i => i.id === ing.ingredientId)?.name || ''
            },
            unit: {
              id: ing.unitId,
              name: units.find(u => u.id === ing.unitId)?.name || ''
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

  if (isLoading || unitsLoading || ingredientsLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!recipe || !units || !availableIngredients) return <p>Recipe not found.</p>;

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
