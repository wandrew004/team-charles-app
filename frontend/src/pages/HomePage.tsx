import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecipeData } from '../types/recipeData';

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}/recipes`;

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <header>
        <h1>RecipeHub</h1>
        <nav>
          <Link to="/create">Create New Recipe</Link>
        </nav>
      </header>
      <main>
        <h2>All Recipes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default HomePage;
