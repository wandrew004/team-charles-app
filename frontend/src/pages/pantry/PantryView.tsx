import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Typography, CircularProgress, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '../../theme';

type Ingredient = {
  id: number;
  name: string;
  quantity: string;
  unit: string;
};

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}/recipes`;

const fetchPantry = async (): Promise<Ingredient[]> => {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
};

const PantryView: React.FC = () => {
  const { data: pantry, isLoading, isError } = useQuery({
    queryKey: ['pantry'],
    queryFn: fetchPantry,
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-100 px-8 py-12 font-sans">
          <Box className="flex justify-between items-center mb-12">
            <Button 
              component={Link} 
              to="/" 
              className="!text-[#7B8A64] !text-lg"
            >
              ← back
            </Button>
            <Typography variant="h4" className="text-[#7B8A64] font-bold">
              Your Pantry
            </Typography>
            <Button 
              component={Link} 
              to="/pantry/create" 
              variant="contained" 
              className="!bg-[#7B8A64] !text-[#FFC664] !text-lg min-w-[120px] py-2"
            >
              + new
            </Button>
          </Box>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress className="!text-[#7B8A64]" />
            </div>
          ) : isError ? (
            <div className="text-red-500 text-center text-lg">Failed to load pantry.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pantry?.map((ingredient) => (
                <Card
                  key={ingredient.id}
                  // component={Link}
                  // to={`/pantry/${ingredient.id}`}
                  className="!bg-[#E2EBCA] shadow-md hover:shadow-lg transition duration-200 cursor-pointer w-full"
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      className="!text-[#7B8A64] !font-semibold !text-lg mb-2"
                    >
                      {ingredient.name} →
                    </Typography>
                    <Typography 
                      variant="body1" 
                      className="!text-[#7B8A64] !text-base"
                    >
                      {ingredient.quantity} {ingredient.unit}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default PantryView;
