import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RecipeForm from './pages/RecipeFormPage';
import Recipes from './pages/Recipes';
import AggregationPage from './pages/AggregationPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/create" element={<RecipeForm />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/aggregate" element={<AggregationPage />} />
      </Routes>
    </Router>
  );
}

export default App;