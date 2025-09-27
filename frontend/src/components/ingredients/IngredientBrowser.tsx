import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { ingredientService } from '../../services/ingredientService';
import type { Ingredient, IngredientFilters } from '../../types';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';

interface IngredientBrowserProps {
  onIngredientSelect?: (ingredient: Ingredient) => void;
  onIngredientEdit?: (ingredient: Ingredient) => void;
  onIngredientDelete?: (ingredient: Ingredient) => void;
  onCreateNew?: () => void;
  selectionMode?: boolean;
}

export const IngredientBrowser = ({ 
  onIngredientSelect, 
  onIngredientEdit, 
  onIngredientDelete, 
  onCreateNew,
  selectionMode = false
}: IngredientBrowserProps) => {
  const { getToken } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IngredientFilters>({});

  useEffect(() => {
    loadIngredients();
  }, [filters]);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await ingredientService.getIngredients(token, filters);
      setIngredients(data);
      setError(null);
    } catch (err) {
      console.error('Error loading ingredients:', err);
      setError('Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ingredient: Ingredient) => {
    if (!window.confirm(`Are you sure you want to delete "${ingredient.name}"?`)) {
      return;
    }

    try {
      const token = await getToken();
      await ingredientService.deleteIngredient(ingredient.id, token);
      setIngredients(prev => prev.filter(i => i.id !== ingredient.id));
      if (onIngredientDelete) {
        onIngredientDelete(ingredient);
      }
    } catch (err: any) {
      console.error('Error deleting ingredient:', err);
      alert(err.message || 'Failed to delete ingredient');
    }
  };

  const categories = [...new Set(ingredients.map(i => i.category).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadIngredients}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {selectionMode ? 'Select Ingredient' : `Ingredients (${ingredients.length})`}
        </h2>
        {!selectionMode && onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Ingredient
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ingredients List */}
      {ingredients.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-gray-500 mb-4">
            {Object.keys(filters).some(key => filters[key as keyof IngredientFilters])
              ? 'No ingredients match your filters'
              : 'No ingredients yet'
            }
          </div>
          {onCreateNew && Object.keys(filters).every(key => !filters[key as keyof IngredientFilters]) && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Ingredient
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map(ingredient => (
            <div
              key={ingredient.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border ${
                selectionMode ? 'cursor-pointer hover:bg-blue-50' : ''
              }`}
              onClick={() => selectionMode && onIngredientSelect?.(ingredient)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Unit:</span> {ingredient.unit}
                  </div>
                  {ingredient.category && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {ingredient.category}
                    </div>
                  )}
                </div>

                {!selectionMode && (
                  <div className="flex gap-1">
                    {onIngredientEdit && (
                      <button
                        onClick={() => onIngredientEdit(ingredient)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Edit Ingredient"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ingredient)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Ingredient"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Added: {new Date(ingredient.createdAt).toLocaleDateString()}
              </div>

              {selectionMode && (
                <div className="mt-3 text-center">
                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    Select This Ingredient
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Summary */}
      {!selectionMode && ingredients.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const count = ingredients.filter(i => i.category === category).length;
              return (
                <div
                  key={category}
                  className="p-3 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => setFilters(prev => ({ ...prev, category }))}
                >
                  <div className="font-medium">{category}</div>
                  <div className="text-sm text-gray-600">{count} ingredient{count !== 1 ? 's' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};