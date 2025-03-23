import React from 'react';
import { useParams, Link } from 'react-router-dom';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // For demonstration, use static recipe data. Replace with API calls if needed.
  const recipe = {
    id,
    title: 'Spaghetti Bolognese',
    ingredients: ['Spaghetti', 'Tomato Sauce', 'Ground Beef'],
    instructions: 'Boil spaghetti. Prepare the sauce with beef and tomatoes. Combine and serve.'
  };

  return (
    <div>
      <header>
        <h1>{recipe.title}</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
      <main>
        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <p>{recipe.instructions}</p>
        </section>
      </main>
    </div>
  );
};

export default RecipePage;
