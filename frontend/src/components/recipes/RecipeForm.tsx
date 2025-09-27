import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import { recipeService } from '../../services/recipeService';
import { ingredientService } from '../../services/ingredientService';
import type { Recipe, CreateRecipeData, Ingredient } from '../../types';
import { Plus, X, Clock, Users } from 'lucide-react';

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSave?: (recipe: Recipe) => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  instructions: string;
  prepTime: number | '';
  cookTime: number | '';
  servings: number;
  category: string;
  tags: string;
  ingredients: Array<{
    quantity: number | '';
    unit: string;
    notes: string;
    ingredient: {
      name: string;
      category: string;
      unit: string;
    };
  }>;
}

export const RecipeForm = ({ recipe, onSave, onCancel }: RecipeFormProps) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: recipe?.title || '',
      description: recipe?.description || '',
      instructions: recipe?.instructions || '',
      prepTime: recipe?.prepTime || '',
      cookTime: recipe?.cookTime || '',
      servings: recipe?.servings || 4,
      category: recipe?.category || '',
      tags: recipe?.tags?.join(', ') || '',
      ingredients: recipe?.recipeIngredients?.map(ri => ({
        quantity: ri.quantity,
        unit: ri.unit,
        notes: ri.notes || '',
        ingredient: {
          name: ri.ingredient.name,
          category: ri.ingredient.category || '',
          unit: ri.ingredient.unit
        }
      })) || [{ quantity: '', unit: '', notes: '', ingredient: { name: '', category: '', unit: '' } }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const token = await getToken();
      const data = await ingredientService.getIngredients(token, { search: ingredientSearch });
      setAvailableIngredients(data);
    } catch (err) {
      console.error('Error loading ingredients:', err);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, [ingredientSearch]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      // Transform form data to API format
      const recipeData: CreateRecipeData = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        instructions: data.instructions.trim(),
        prepTime: data.prepTime ? Number(data.prepTime) : undefined,
        cookTime: data.cookTime ? Number(data.cookTime) : undefined,
        servings: data.servings,
        category: data.category.trim() || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        ingredients: data.ingredients.filter(ing => ing.ingredient.name.trim()).map(ing => ({
          quantity: Number(ing.quantity),
          unit: ing.unit.trim(),
          notes: ing.notes.trim() || undefined,
          ingredient: {
            name: ing.ingredient.name.trim(),
            category: ing.ingredient.category.trim() || undefined,
            unit: ing.ingredient.unit.trim()
          }
        }))
      };

      const token = await getToken();
      const savedRecipe = recipe 
        ? await recipeService.updateRecipe(recipe.id, recipeData, token)
        : await recipeService.createRecipe(recipeData, token);

      if (onSave) {
        onSave(savedRecipe);
      }
    } catch (err: any) {
      console.error('Error saving recipe:', err);
      setError(err.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    append({ quantity: '', unit: '', notes: '', ingredient: { name: '', category: '', unit: '' } });
  };

  const selectIngredient = (index: number, ingredient: Ingredient) => {
    setValue(`ingredients.${index}.ingredient.name`, ingredient.name);
    setValue(`ingredients.${index}.ingredient.category`, ingredient.category || '');
    setValue(`ingredients.${index}.ingredient.unit`, ingredient.unit);
    setValue(`ingredients.${index}.unit`, ingredient.unit);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {recipe ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter recipe title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the recipe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline w-4 h-4 mr-1" />
              Prep Time (minutes)
            </label>
            <input
              type="number"
              {...register('prepTime', { min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline w-4 h-4 mr-1" />
              Cook Time (minutes)
            </label>
            <input
              type="number"
              {...register('cookTime', { min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline w-4 h-4 mr-1" />
              Servings *
            </label>
            <input
              type="number"
              {...register('servings', { required: 'Servings is required', min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="4"
            />
            {errors.servings && (
              <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Dinner, Dessert"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="easy, quick, vegetarian"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Ingredient
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`ingredients.${index}.quantity`, { required: 'Quantity required' })}
                    placeholder="1"
                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    {...register(`ingredients.${index}.unit`, { required: 'Unit required' })}
                    placeholder="cup"
                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="md:col-span-2 relative">
                    <input
                      type="text"
                      {...register(`ingredients.${index}.ingredient.name`, { required: 'Ingredient name required' })}
                      placeholder="Ingredient name"
                      className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => setIngredientSearch(e.target.value)}
                    />
                    {availableIngredients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                        {availableIngredients
                          .filter(ing => ing.name.toLowerCase().includes(watch(`ingredients.${index}.ingredient.name`)?.toLowerCase() || ''))
                          .slice(0, 5)
                          .map(ing => (
                            <button
                              key={ing.id}
                              type="button"
                              onClick={() => selectIngredient(index, ing)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              {ing.name} ({ing.unit})
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    {...register(`ingredients.${index}.notes`)}
                    placeholder="Notes (optional)"
                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    {...register(`ingredients.${index}.ingredient.category`)}
                    placeholder="Category"
                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  disabled={fields.length === 1}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions *
          </label>
          <textarea
            {...register('instructions', { required: 'Instructions are required' })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Step-by-step cooking instructions..."
          />
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {recipe ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};