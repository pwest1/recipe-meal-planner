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
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="status-error p-4 rounded-xl mb-6 inline-block">{error}</div>
        <button 
          onClick={loadRecipes}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold gradient-text">
          Recipes <span className="text-neutral-500">({filteredRecipes.length})</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-ghost"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? '☰' : '▦'}
          </button>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="btn-primary"
            >
              <Plus size={16} />
              Add Recipe
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search recipes..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input pl-12"
              />
            </div>
          </div>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
            className="input min-w-48"
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
        <div className="card p-12 text-center">
          <div className="text-neutral-500 text-lg mb-6">
            {recipes.length === 0 ? 'No recipes yet 🍳' : 'No recipes match your filters 🔍'}
          </div>
          {onCreateNew && recipes.length === 0 && (
            <button
              onClick={onCreateNew}
              className="btn-primary px-8 py-4 text-lg"
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
              className={`card-hover ${
                viewMode === 'list' ? 'flex gap-6 p-6' : 'p-6'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-balance">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-neutral-600 mb-4 line-clamp-2 text-balance">
                    {recipe.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-4">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>Prep: {recipe.prepTime}m</span>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>Cook: {recipe.cookTime}m</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users size={16} />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-primary-100 text-primary-800 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 text-sm font-medium rounded-full">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={`flex ${viewMode === 'list' ? 'flex-col' : 'flex-row'} gap-2`}>
                {onRecipeSelect && (
                  <button
                    onClick={() => onRecipeSelect(recipe)}
                    className="btn-ghost p-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                    title="View Recipe"
                  >
                    <Eye size={18} />
                  </button>
                )}
                {onRecipeEdit && (
                  <button
                    onClick={() => onRecipeEdit(recipe)}
                    className="btn-ghost p-3 text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                    title="Edit Recipe"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(recipe)}
                  className="btn-ghost p-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete Recipe"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};