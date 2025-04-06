import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '../theme';

type Recipe = {
  id: number;
  name: string;
};

type AggregatedIngredient = {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
};

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}`;

const AggregationPage: React.FC = () => {
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [numDropdowns, setNumDropdowns] = useState(1);

  // Fetch all recipes
  const { data: recipes, isLoading: isLoadingRecipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINT}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    },
  });

  // Fetch aggregated ingredients for selected recipes
  const { data: aggregatedIngredients, isLoading: isLoadingIngredients } = useQuery({
    queryKey: ['aggregatedIngredients', selectedRecipes],
    queryFn: async () => {
      if (selectedRecipes.length === 0) return [];
      const response = await fetch(`${API_ENDPOINT}/aggregation/ingredients?recipeIds=${selectedRecipes.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch aggregated ingredients');
      }
      return response.json();
    },
    enabled: selectedRecipes.length > 0,
  });

  const handleRecipeSelect = (index: number, recipeId: number) => {
    const newSelectedRecipes = [...selectedRecipes];
    newSelectedRecipes[index] = recipeId;
    setSelectedRecipes(newSelectedRecipes);
  };

  const addDropdown = () => {
    setNumDropdowns(prev => prev + 1);
  };

  const removeDropdown = () => {
    if (numDropdowns > 1) {
      setNumDropdowns(prev => prev - 1);
      setSelectedRecipes(prev => prev.slice(0, -1));
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" className="py-8">
          <Box className="flex justify-between items-center mb-8">
            <Button 
              component={Link} 
              to="/" 
              className="!text-[#7B8A64] !text-lg"
            >
              ← back
            </Button>
            <Typography variant="h4" className="text-[#7B8A64] font-bold">
              Recipe Aggregation
            </Typography>
          </Box>

          <Box className="mb-8">
            <Typography variant="h6" className="text-[#7B8A64] mb-4">
              Select Recipes to Aggregate
            </Typography>
            
            {isLoadingRecipes ? (
              <CircularProgress className="!text-[#7B8A64]" />
            ) : (
              <>
                {Array.from({ length: numDropdowns }).map((_, index) => (
                  <FormControl fullWidth key={index} className="mb-4">
                    <InputLabel>Recipe {index + 1}</InputLabel>
                    <Select
                      value={selectedRecipes[index] || ''}
                      onChange={(e) => handleRecipeSelect(index, Number(e.target.value))}
                      label={`Recipe ${index + 1}`}
                    >
                      {recipes?.map((recipe: Recipe) => (
                        <MenuItem key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}

                <Box className="flex gap-4">
                  <Button 
                    variant="contained" 
                    onClick={addDropdown}
                    className="!bg-[#7B8A64] !text-[#FFC664]"
                  >
                    Add Recipe
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={removeDropdown}
                    className="!text-[#7B8A64] !border-[#7B8A64]"
                  >
                    Remove Recipe
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {selectedRecipes.length > 0 && (
            <Box>
              <Typography variant="h6" className="text-[#7B8A64] mb-4">
                Aggregated Ingredients
              </Typography>
              
              {isLoadingIngredients ? (
                <CircularProgress className="!text-[#7B8A64]" />
              ) : (
                <List>
                  {aggregatedIngredients?.map((ingredient: AggregatedIngredient) => (
                    <ListItem key={ingredient.ingredientId} className="!bg-[#E2EBCA] !rounded-lg !mb-2">
                      <ListItemText
                        primary={ingredient.name}
                        secondary={`${ingredient.quantity} ${ingredient.unit}`}
                        className="!text-[#7B8A64]"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default AggregationPage;
