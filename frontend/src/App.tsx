import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RecipeForm from './pages/RecipeFormPage';
import Recipes from './pages/Recipes';
import AggregationPage from './pages/AggregationPage';
import RecipeUpdatePage from './pages/RecipeUpdatePage';
import PantryView from './pages/pantry/PantryView';
import PantryForm from './pages/pantry/PantryForm';
import LoginPage from './pages/LoginPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          <Route path="/create" element={<RecipeForm />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/aggregate" element={<AggregationPage />} />
          <Route path="/update/:id" element={<RecipeUpdatePage />} />
          <Route path="/pantry" element={<PantryView />} />
          <Route path="/pantry/create" element={<PantryForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
