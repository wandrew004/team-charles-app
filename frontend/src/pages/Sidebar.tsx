import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const API_ENDPOINT = `${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:3001'}`;

interface RecipeSummary {
  id: number;
  name: string;
}

const fetchRecipes = async (): Promise<RecipeSummary[]> => {
  const response = await fetch(`${API_ENDPOINT}/recipes`, {
    credentials: 'include',
  });
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
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    // Check authentication status
    fetch(`${API_ENDPOINT}/auth/status`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate('/recipes');
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'));
  };

  return (
    <aside className="w-64 bg-gray-100 border-r p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBack} className="text-xl cursor-pointer" title="Go back">←</button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recipes</h2>
        {location.pathname !== '/create' && (
          <Link to="/create" className="text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded">
            + Add new
          </Link>
        )}
      </div>
      <ul>
        <li className="p-2 cursor-pointer rounded mb-2 bg-gray-300">
          {currentTitle && currentTitle.trim() !== '' ? currentTitle : "New Recipe"}
        </li>
        {isLoading && <li>Loading...</li>}
        {error && <li>Error loading recipes</li>}
        {recipes && recipes.map((recipe: RecipeSummary) => (
          <li key={recipe.id} className="flex items-center justify-between p-2 cursor-pointer rounded mb-2 hover:bg-gray-200">
            <Link to={`/update/${recipe.id}`} className="flex items-center justify-between w-full">
              <span>{recipe.name}</span>
              <span className="text-blue-500 text-sm">Edit</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
