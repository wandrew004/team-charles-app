import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RecipeForm from './pages/RecipeFormPage';
import Recipes from './pages/Recipes';
import AggregationPage from './pages/AggregationPage';
import RecipeUpdatePage from './pages/RecipeUpdatePage';
import PantryView from './pages/pantry/PantryView';
import PantryForm from './pages/pantry/PantryForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <RecipeForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          } 
        />
        <Route path="/aggregate" element={<AggregationPage />} />
        <Route path="/update/:id" element={<RecipeUpdatePage />} />
        <Route path="/pantry" element={<PantryView />} />
        <Route path="/pantry/create" element={<PantryForm />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
