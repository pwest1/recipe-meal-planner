import { useState } from 'react';
import type { Recipe } from '../../types';
import { Clock, Users, ArrowLeft, Edit2, Trash2, ChefHat, Tag } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack?: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export const RecipeDetail = ({ recipe, onBack, onEdit, onDelete }: RecipeDetailProps) => {
  const [servings, setServings] = useState(recipe.servings);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      onDelete?.(recipe);
    }
  };

  const getScaledQuantity = (originalQuantity: number) => {
    const scale = servings / recipe.servings;
    const scaled = originalQuantity * scale;
    
    // Round to reasonable precision
    if (scaled < 1) {
      return Math.round(scaled * 100) / 100; // 2 decimal places for small amounts
    } else if (scaled < 10) {
      return Math.round(scaled * 10) / 10; // 1 decimal place
    } else {
      return Math.round(scaled); // Whole numbers for large amounts
    }
  };

  const formatInstructions = (instructions: string) => {
    // Split by numbered steps or new lines and filter empty strings
    const steps = instructions
      .split(/\n\s*\d+\.|\n/)
      .map(step => step.trim())
      .filter(step => step.length > 0);

    return steps;
  };

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Back to recipes"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-gray-600 mt-1">{recipe.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(recipe)}
              className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Recipe Meta */}
      <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
        {recipe.prepTime && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm">
              <strong>Prep:</strong> {recipe.prepTime}m
            </span>
          </div>
        )}
        {recipe.cookTime && (
          <div className="flex items-center gap-2">
            <ChefHat size={16} className="text-gray-500" />
            <span className="text-sm">
              <strong>Cook:</strong> {recipe.cookTime}m
            </span>
          </div>
        )}
        {totalTime > 0 && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm">
              <strong>Total:</strong> {totalTime}m
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm">
            <strong>Serves:</strong> {recipe.servings}
          </span>
        </div>
        {recipe.category && (
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            <span className="text-sm">
              <strong>Category:</strong> {recipe.category}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="servings" className="text-sm font-medium">
                Servings:
              </label>
              <select
                id="servings"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {recipe.recipeIngredients.map((ri, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">
                    {getScaledQuantity(ri.quantity)} {ri.unit} {ri.ingredient.name}
                  </div>
                  {ri.notes && (
                    <div className="text-sm text-gray-600 mt-1">
                      {ri.notes}
                    </div>
                  )}
                  {ri.ingredient.category && (
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {ri.ingredient.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {recipe.recipeIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ingredients listed
            </div>
          )}
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-4">
            {formatInstructions(recipe.instructions).map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>

          {formatInstructions(recipe.instructions).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No instructions provided
            </div>
          )}
        </div>
      </div>

      {/* Recipe Info Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
          <span>Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};