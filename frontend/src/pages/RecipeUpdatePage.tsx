import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import Sidebar from './Sidebar';
import IngredientsBox from '../components/IngredientsBox';
import InstructionsBox from '../components/InstructionsBox';

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
    ingredient: { id: number; name: string };
    unit: { id: number; name: string };
  }[];
  recipeSteps: {
    recipeId: number;
    stepId: number;
    step: { stepNumber: number; stepText: string };
  }[];
}

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

const useFetchRecipe = (id: string) =>
  useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/recipes/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

const useUpdateRecipe = () =>
  useMutation({
    mutationFn: async (data: RecipeData) => {
      const response = await fetch(`${API_BASE}/recipes/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have permission to edit this recipe');
        } else if (response.status === 404) {
          throw new Error('Recipe not found');
        } else {
          throw new Error('Failed to update recipe. Please try again later.');
        }
      }
      return response.json();
    },
  });

const RecipeUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error, refetch } = useFetchRecipe(id!);
  const updateMutation = useUpdateRecipe();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // import-dialog state
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [textImportOpen, setTextImportOpen] = useState(false);
  const [imageImportOpen, setImageImportOpen] = useState(false);

  // fetch units + ingredients
  const fetchUnits = async (): Promise<Unit[]> => {
    const res = await fetch(`${API_BASE}/units`);
    if (!res.ok) throw new Error('Failed to fetch units');
    return res.json();
  };
  const fetchIngredients = async (): Promise<Ingredient[]> => {
    const res = await fetch(`${API_BASE}/ingredients`);
    if (!res.ok) throw new Error('Failed to fetch ingredients');
    return res.json();
  };

  const {
    data: units,
    isLoading: unitsLoading,
  } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits
  });
  const {
    data: availableIngredients,
    isLoading: ingredientsLoading,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients
  });

  // form state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([
    { ingredientId: 0, quantity: 0, unitId: 0 },
  ]);
  const [instructions, setInstructions] = useState<
    { stepId: number; stepNumber: number; stepText: string }[]
  >([]);
  const headerImage = recipe?.headerImage || '/default.jpg';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // populate on fetch
  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description);
      setDate(recipe.date);
      setLink(recipe.link);
      setIngredients(
        recipe.recipeIngredients.map((ing: any) => ({
          ingredientId: ing.ingredient.id,
          quantity: parseFloat(ing.quantity),
          unitId: ing.unit.id,
        }))
      );
      setInstructions(
        recipe.recipeSteps.map((step: any) => ({
          stepId: step.stepId,
          stepNumber: step.step.stepNumber,
          stepText: step.step.stepText,
        }))
      );
      // Check if user is authorized to edit this recipe
      fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(user => {
          setIsAuthorized(recipe.userId === user.id);
        })
        .catch(() => setIsAuthorized(false));
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
          .filter(step => step.stepText.trim() !== '')
          .map(step => ({
            recipeId: recipe.id,
            stepId: step.stepId,
            step: {
              stepNumber: step.stepNumber,
              stepText: step.stepText
            }
          }))
      };
      updateMutation.mutate(updatedRecipe, {
        onSuccess: () => {
          refetch();
          setShowSuccess(true);
        },
        onError: (error) => {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to update recipe');
          setShowError(true);
        }
      });
    }
    if (!recipe || !units || !availableIngredients) return;
    const updated: RecipeData = {
      ...recipe,
      name,
      description,
      date,
      link,
      headerImage,
      recipeIngredients: ingredients
        .filter((ing) => ing.ingredientId !== 0)
        .map((ing) => ({
          quantity: ing.quantity.toString(),
          ingredient: {
            id: ing.ingredientId,
            name:
              availableIngredients.find((i) => i.id === ing.ingredientId)
                ?.name || '',
          },
          unit: {
            id: ing.unitId,
            name: units.find((u) => u.id === ing.unitId)?.name || '',
          },
        })),
      recipeSteps: instructions
        .filter((step) => step.stepText.trim() !== '')
        .map((step) => ({
          recipeId: recipe.id,
          stepId: step.stepId,
          step: {
            stepNumber: step.stepNumber,
            stepText: step.stepText,
          },
        })),
    };
    updateMutation.mutate(updated, {
      onSuccess: () => {
        refetch();
        setShowSuccess(true);
      },
      onError: (error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to update recipe');
        setShowError(true);
      }
    });
  };

  if (isLoading || unitsLoading || ingredientsLoading)
    return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!recipe || !units || !availableIngredients)
    return <p>Recipe not found.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-[#7B8A64]">
      {sidebarOpen && <Sidebar currentTitle={name} />}
      <main className="flex-1 p-8 relative overflow-y-auto">
        {!sidebarOpen && (
          <button
            className="absolute top-2 left-2 text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        )}

        <div className="w-full h-64 mb-4 relative rounded-lg shadow-lg overflow-hidden">
          <img
            src={headerImage}
            alt="Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white opacity-30" />
        </div>

        {/* title + import button */}
        <Box className="flex items-center gap-4 mb-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipe Title"
            className="text-3xl font-bold w-full p-2 rounded focus:outline-none"
          />
          <Button
            onClick={() => setImportDialogOpen(true)}
            variant="contained"
            sx={{
              textTransform: 'none',
              minWidth: '160px',
              whiteSpace: 'nowrap',
              backgroundColor: '#7B8A64',
            }}
          >
            import recipe
          </Button>
        </Box>

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
              <span
                onClick={() => setIsEditingLink(true)}
                className="underline cursor-pointer"
              >
                {link || 'add link..'}
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-row gap-8">
          <IngredientsBox
            ingredients={ingredients}
            setIngredients={setIngredients}
            API_BASE={API_BASE}
          />
          <InstructionsBox
            instructions={instructions}
            setInstructions={setInstructions}
          />
        </div>

        <Box mt={4}>
          {isAuthorized && (
            <Button
              type="button"
              variant="contained"
              fullWidth
              onClick={handleUpdate}
              sx={{ textTransform: 'none' }}
            >
              update recipe
            </Button>
          )}
        </Box>
      </main>

      {/* success snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          recipe updated successfully!
        </Alert>
      </Snackbar>
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

      {/* Import chooser */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      >
        <DialogTitle sx={{ textTransform: 'none' }}>
          import recipe
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setImportDialogOpen(false);
                setTextImportOpen(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              import text
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setImportDialogOpen(false);
                setImageImportOpen(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              import image
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Text import */}
      <Dialog open={textImportOpen} onClose={() => setTextImportOpen(false)}>
        <DialogTitle sx={{ textTransform: 'none' }}>import text</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={8}
            placeholder="paste recipe text here..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTextImportOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image import */}
      <Dialog
        open={imageImportOpen}
        onClose={() => setImageImportOpen(false)}
      >
        <DialogTitle sx={{ textTransform: 'none' }}>upload images</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 5,
              textAlign: 'center',
            }}
          >
            <Typography>drag & drop images here</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImageImportOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecipeUpdatePage;
