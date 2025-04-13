import React, { useState, KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Unit {
  id: number;
  name: string;
  type: string;
}

interface Ingredient {
  id: number;
  name: string;
  description?: string;
  standardUnit?: number;
  density?: number;
}

interface IngredientEntry {
  ingredientId: number;
  quantity: number;
  unitId: number;
}

interface IngredientsBoxProps {
  ingredients: IngredientEntry[];
  setIngredients: (ings: IngredientEntry[]) => void;
  API_BASE: string;
}

const IngredientsBox: React.FC<IngredientsBoxProps> = ({ ingredients, setIngredients, API_BASE }) => {
  const fetchUnits = async (): Promise<Unit[]> => {
    const response = await fetch(`${API_BASE}/units`);
    if (!response.ok) {
      throw new Error('Failed to fetch units');
    }
    return response.json();
  };

  const fetchIngredients = async (): Promise<Ingredient[]> => {
    const response = await fetch(`${API_BASE}/ingredients`);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    return response.json();
  };

  const { data: units, isLoading: unitsLoading, error: unitsError } = useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const { data: availableIngredients, isLoading: ingredientsLoading, error: ingredientsError } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filteredIngredients = availableIngredients?.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getIngredientName = (ingredientId: number) => {
    return availableIngredients?.find(i => i.id === ingredientId)?.name || '';
  };

  const handleIngredientSearch = (index: number, value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
    setActiveIndex(index);
  };

  const handleIngredientSelect = (index: number, ingredientId: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].ingredientId = ingredientId;
    setIngredients(newIngredients);
    setSearchTerm(getIngredientName(ingredientId));
    setShowDropdown(false);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      newIngredients[index].quantity = numericValue;
    }
    setIngredients(newIngredients);
  };

  const handleUnitChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].unitId = Number(value);
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ingredients[index].ingredientId) {
        setIngredients([...ingredients, { ingredientId: 0, quantity: 0, unitId: 0 }]);
        setSearchTerm('');
        setShowDropdown(false);
        setTimeout(() => {
          const inputs = document.querySelectorAll('.ingredient-input');
          if (inputs.length > 0) {
            (inputs[inputs.length - 1] as HTMLInputElement).focus();
          }
        }, 0);
      }
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4 mt-6 w-1/2 min-h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="mr-2 font-semibold">{index + 1}.)</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search ingredient..."
              value={activeIndex === index ? searchTerm : getIngredientName(ingredient.ingredientId)}
              onChange={(e) => handleIngredientSearch(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full p-2 rounded focus:outline-none ingredient-input"
            />
            {showDropdown && activeIndex === index && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                {ingredientsLoading ? (
                  <div className="p-2">Loading ingredients...</div>
                ) : ingredientsError ? (
                  <div className="p-2">Error loading ingredients</div>
                ) : filteredIngredients.length === 0 ? (
                  <div className="p-2">No ingredients found</div>
                ) : (
                  filteredIngredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleIngredientSelect(index, ing.id)}
                    >
                      {ing.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex items-center ml-2 border border-black rounded p-1">
            <input
              type="text"
              placeholder="0"
              value={ingredient.quantity === 0 ? '' : ingredient.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              className="w-12 p-1 outline-none"
            />
            <select
              value={ingredient.unitId || 0}
              onChange={(e) => handleUnitChange(index, e.target.value)}
              className="p-1 outline-none"
            >
              <option value={0}>Select unit...</option>
              {unitsLoading ? (
                <option>Loading units...</option>
              ) : unitsError ? (
                <option>Error loading units</option>
              ) : (
                units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IngredientsBox; 