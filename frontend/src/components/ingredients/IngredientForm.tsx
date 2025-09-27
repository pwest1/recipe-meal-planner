import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import { ingredientService } from '../../services/ingredientService';
import type { Ingredient, CreateIngredientData } from '../../types';
import { Package, Save, X } from 'lucide-react';

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onSave?: (ingredient: Ingredient) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  category: string;
  unit: string;
}

const COMMON_UNITS = [
  'pieces', 'cups', 'tablespoons', 'teaspoons', 'grams', 'kilograms', 
  'pounds', 'ounces', 'liters', 'milliliters', 'fluid ounces', 
  'cloves', 'slices', 'bunches', 'cans', 'bottles', 'packages'
];

const COMMON_CATEGORIES = [
  'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Poultry', 'Seafood',
  'Grains', 'Legumes', 'Nuts', 'Seeds', 'Herbs', 'Spices',
  'Oils', 'Condiments', 'Beverages', 'Baking', 'Frozen', 'Canned'
];

export const IngredientForm = ({ ingredient, onSave, onCancel }: IngredientFormProps) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: ingredient?.name || '',
      category: ingredient?.category || '',
      unit: ingredient?.unit || ''
    }
  });

  const watchedUnit = watch('unit');
  const watchedCategory = watch('category');

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const ingredientData: CreateIngredientData = {
        name: data.name.trim(),
        category: data.category.trim() || undefined,
        unit: data.unit.trim()
      };

      const token = await getToken();
      const savedIngredient = ingredient 
        ? await ingredientService.updateIngredient(ingredient.id, ingredientData, token)
        : await ingredientService.createIngredient(ingredientData, token);

      if (onSave) {
        onSave(savedIngredient);
      }
    } catch (err: any) {
      console.error('Error saving ingredient:', err);
      setError(err.message || 'Failed to save ingredient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold">
          {ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredient Name *
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Tomatoes, Olive Oil"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('unit', { required: 'Unit is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., pieces, cups, grams"
              list="units-list"
            />
            <datalist id="units-list">
              {COMMON_UNITS.map(unit => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
          </div>
          {errors.unit && (
            <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
          )}
          
          {/* Common units quick select */}
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Quick select:</div>
            <div className="flex flex-wrap gap-1">
              {COMMON_UNITS.slice(0, 8).map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setValue('unit', unit)}
                  className={`px-2 py-1 text-xs rounded border ${
                    watchedUnit === unit 
                      ? 'bg-blue-100 text-blue-800 border-blue-300' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category (optional)
          </label>
          <input
            type="text"
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Vegetables, Dairy"
            list="categories-list"
          />
          <datalist id="categories-list">
            {COMMON_CATEGORIES.map(category => (
              <option key={category} value={category} />
            ))}
          </datalist>
          
          {/* Common categories quick select */}
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Quick select:</div>
            <div className="flex flex-wrap gap-1">
              {COMMON_CATEGORIES.slice(0, 6).map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setValue('category', category)}
                  className={`px-2 py-1 text-xs rounded border ${
                    watchedCategory === category 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              <X size={16} />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            {ingredient ? 'Update' : 'Save'} Ingredient
          </button>
        </div>
      </form>

      {/* Help text */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p><strong>Tips:</strong></p>
        <p>• Use singular names (e.g., "Tomato" not "Tomatoes")</p>
        <p>• Be specific with units (e.g., "large eggs" vs "eggs")</p>
        <p>• Categories help organize your ingredients</p>
      </div>
    </div>
  );
};