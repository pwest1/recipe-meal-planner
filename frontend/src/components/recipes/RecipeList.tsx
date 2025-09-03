import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { recipeService } from '../../services/recipeService';
import type { Recipe, RecipeFilters } from '../../types';
import { Clock, Users, Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';

interface RecipeListProps {
  onRecipeSelect?: (recipe: Recipe) => void;
  onRecipeEdit?: (recipe: Recipe) => void;
  onRecipeDelete?: (recipe: Recipe) => void;
  onCreateNew?: () => void;
}

export const RecipeList = ({ 
  onRecipeSelect, 
  onRecipeEdit, 
  onRecipeDelete, 
  onCreateNew 
}: RecipeListProps) => {
  const { getToken } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await recipeService.getRecipes(token);
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipe: Recipe) => {
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      return;
    }

    try {
      const token = await getToken();
      await recipeService.deleteRecipe(recipe.id, token);
      setRecipes(prev => prev.filter(r => r.id !== recipe.id));
      if (onRecipeDelete) {
        onRecipeDelete(recipe);
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe');
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !recipe.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && recipe.category !== filters.category) {
      return false;
    }
    if (filters.tags?.length && !filters.tags.some(tag => recipe.tags.includes(tag))) {
      return false;
    }
    return true;
  });

  const categories = [...new Set(recipes.map(r => r.category).filter(Boolean))];

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
          onClick={loadRecipes}
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
        <h2 className="text-2xl font-bold">Recipes ({filteredRecipes.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border rounded hover:bg-gray-50"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? '☰' : '▦'}
          </button>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Recipe
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search recipes..."
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

      {/* Recipe Grid/List */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {recipes.length === 0 ? 'No recipes yet' : 'No recipes match your filters'}
          </div>
          {onCreateNew && recipes.length === 0 && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Recipe
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex gap-4 p-4' : 'p-6'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Prep: {recipe.prepTime}m</span>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Cook: {recipe.cookTime}m</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {onRecipeSelect && (
                  <button
                    onClick={() => onRecipeSelect(recipe)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="View Recipe"
                  >
                    <Eye size={16} />
                  </button>
                )}
                {onRecipeEdit && (
                  <button
                    onClick={() => onRecipeEdit(recipe)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Edit Recipe"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(recipe)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Recipe"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};