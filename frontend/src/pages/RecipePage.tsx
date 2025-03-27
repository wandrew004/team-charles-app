import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001';

export type RecipeData = {
  id: number;
  name: string;
  description: string;
  ingredients: { name: string; quantity: number; unit: string }[];
  steps: { stepNumber: number; stepText: string }[];
};

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE}/recipes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <header>
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
      <main>
        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}, {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <ol>
            {recipe.steps?.map((step) => (
              <li key={step.stepNumber}>{step.stepText}</li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
};

export default RecipePage;
