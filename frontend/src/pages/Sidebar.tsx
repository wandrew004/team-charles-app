import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}/recipes`;

interface RecipeSummary {
  id: number;
  name: string;
}

const fetchRecipes = async (): Promise<RecipeSummary[]> => {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
};

interface SidebarProps {
  currentTitle?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTitle }) => {
  const { data: recipes, isLoading, error } = useQuery<RecipeSummary[]>({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  return (
    <aside className="w-64 bg-gray-100 border-r p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Link to="/recipes" className="text-xl">←</Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Recipes</h2>
      <ul>
        <li className="p-2 cursor-pointer rounded mb-2 bg-gray-300">
          {currentTitle && currentTitle.trim() !== '' ? currentTitle : "New Recipe"}
        </li>
        {isLoading && <li>Loading...</li>}
        {error && <li>Error loading recipes</li>}
        {recipes && recipes.map((recipe: RecipeSummary) => (
          <li key={recipe.id} className="flex items-center justify-between p-2 cursor-pointer rounded mb-2 hover:bg-gray-200">
            <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
            <Link to={`/update/${recipe.id}`} className="ml-2 text-blue-500 text-sm">Edit</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
