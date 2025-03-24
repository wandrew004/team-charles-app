import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  // Sample static data
  const recipes = [
    { id: 1, title: 'Spaghetti Bolognese' },
    { id: 2, title: 'Chicken Curry' },
  ];

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
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
