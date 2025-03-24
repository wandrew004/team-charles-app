import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
// import CreateRecipePage from './pages/CreateRecipePage';
import RecipeForm from './RecipeForm';

function App() {
  return (
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/recipe/:id" element={<RecipePage />} />
  <Route path="/create" element={<RecipeForm />} />
</Routes>
  );
}

export default App;
