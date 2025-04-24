import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Button, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../theme';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated, username } = useAuth();
  const navigate = useNavigate();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-100 px-8 py-12 font-sans" id="root">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-[#7B8A64]">
              {isAuthenticated ? `Hi, ${username}!` : 'Welcome to RecipeHub!'}
            </h1>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/create" className="w-full">add recipe</Link>
                  </Button>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="#" className="w-full">see profile</Link>
                  </Button>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/pantry/create" className="w-full">add ingredient</Link>
                  </Button>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/pantry" className="w-full">see ingredients</Link>
                  </Button>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/aggregate" className="w-full">aggregate recipes</Link>
                  </Button>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    className="!text-lg py-3 min-w-[180px]"
                    onClick={() => navigate('/auth/logout')}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/auth/login" className="w-full">Sign In</Link>
                  </Button>
                  <Button color="primary" variant="contained" className="!text-lg py-3 min-w-[180px]">
                    <Link to="/auth/signup" className="w-full">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#7B8A64] mb-4">featured recipes</h2>
            <div className="flex flex-wrap gap-6">
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">My Brownie Recipe →</p>
                <p className="text-red-500 text-base mt-3">don't have all ingredients!</p>
              </Card>
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">Oven Baked Salmon →</p>
                <p className="text-green-600 text-base mt-3">all ingredients present</p>
              </Card>
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">My Brownie Recipe →</p>
                <p className="text-red-500 text-base mt-3">don't have all ingredients!</p>
              </Card>
              <Button className="!bg-gray-300 !text-gray-700 self-center text-lg min-w-[240px] py-3">
                <Link to="/recipes">+ see more</Link>
              </Button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#7B8A64] mb-4">your pantry</h2>
            <div className="flex flex-wrap gap-6">
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">meat and poultry →</p>
              </Card>
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">produce →</p>
              </Card>
              <Card className="w-80 h-32">
                <p className="font-medium text-lg">seasoning →</p>
              </Card>
              <Button className="!bg-gray-300 !text-gray-700 self-center text-lg min-w-[240px] py-3">
                <Link to="/pantry">+ see more</Link>
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-400 mb-4">friends recipes</h2>
            <div className="flex flex-wrap gap-6">
              <Card className="w-80 h-32 bg-gray-300" />
              <Card className="w-80 h-32 bg-gray-300" />
              <Card className="w-80 h-32 bg-gray-300" />
              <Button className="!bg-gray-300 !text-gray-700 self-center text-lg min-w-[240px] py-3">
                <Link to="#">+ see more</Link>
              </Button>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default HomePage;
