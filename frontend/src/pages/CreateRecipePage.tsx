import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with API 
    console.log('New Recipe:', { title, ingredients, instructions });
    navigate('/');
  };

  return (
    <div>
      <header>
        <h1>Create New Recipe</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Recipe Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="ingredients">Ingredients (comma separated):</label>
            <input
              id="ingredients"
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Recipe</button>
        </form>
      </main>
    </div>
  );
};

export default CreateRecipePage;
