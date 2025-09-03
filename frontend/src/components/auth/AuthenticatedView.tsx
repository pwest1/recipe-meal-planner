import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { userService, type UserProfile } from '../../services/userService';
import { RecipeList } from '../recipes/RecipeList';
import { RecipeForm } from '../recipes/RecipeForm';
import { RecipeDetail } from '../recipes/RecipeDetail';
import { IngredientBrowser } from '../ingredients/IngredientBrowser';
import { IngredientForm } from '../ingredients/IngredientForm';
import type { Recipe, Ingredient } from '../../types';
import { ChefHat, Package, User, LogOut, Home } from 'lucide-react';

type View = 'dashboard' | 'recipes' | 'ingredients' | 'profile';
type RecipeView = 'list' | 'detail' | 'form';
type IngredientView = 'browser' | 'form';

export const AuthenticatedView = () => {
  const { user, logout, getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [recipeView, setRecipeView] = useState<RecipeView>('list');
  const [ingredientView, setIngredientView] = useState<IngredientView>('browser');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  // const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const userProfile = await userService.fetchProfile(token);
        setProfile(userProfile);
        setProfileError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [getToken]);

  const refreshProfile = async () => {
    try {
      const token = await getToken();
      const userProfile = await userService.fetchProfile(token);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Navigation handlers
  const showDashboard = () => {
    setCurrentView('dashboard');
  };

  const showRecipes = () => {
    setCurrentView('recipes');
    setRecipeView('list');
    setSelectedRecipe(null);
    setEditingRecipe(null);
  };

  const showIngredients = () => {
    setCurrentView('ingredients');
    setIngredientView('browser');
    // setSelectedIngredient(null);
    setEditingIngredient(null);
  };

  const showProfile = () => {
    setCurrentView('profile');
  };

  // Recipe handlers
  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeView('detail');
  };

  const handleRecipeEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setRecipeView('form');
  };

  const handleRecipeDelete = () => {
    refreshProfile();
    if (recipeView === 'detail') {
      setRecipeView('list');
      setSelectedRecipe(null);
    }
  };

  const handleRecipeCreate = () => {
    setEditingRecipe(null);
    setRecipeView('form');
  };

  const handleRecipeSave = () => {
    refreshProfile();
    setRecipeView('list');
    setEditingRecipe(null);
  };

  const handleRecipeCancel = () => {
    setRecipeView('list');
    setEditingRecipe(null);
  };

  // Ingredient handlers
  const handleIngredientEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIngredientView('form');
  };

  const handleIngredientCreate = () => {
    setEditingIngredient(null);
    setIngredientView('form');
  };

  const handleIngredientSave = () => {
    setIngredientView('browser');
    setEditingIngredient(null);
  };

  const handleIngredientCancel = () => {
    setIngredientView('browser');
    setEditingIngredient(null);
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b mb-6">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex space-x-6">
          <button
            onClick={showDashboard}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Home size={18} />
            Dashboard
          </button>
          <button
            onClick={showRecipes}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'recipes' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChefHat size={18} />
            Recipes
          </button>
          <button
            onClick={showIngredients}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'ingredients' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Package size={18} />
            Ingredients
          </button>
          <button
            onClick={showProfile}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'profile' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <User size={18} />
            Profile
          </button>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {profile?.username || user?.name || 'Chef'}!</h2>
        <p className="text-gray-600 mb-6">Manage your recipes and ingredients all in one place.</p>
        
        {profileError && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {profileError}
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <ChefHat className="mx-auto mb-2 text-blue-600" size={32} />
              <div className="text-2xl font-bold text-blue-900">{profile._count?.recipes || 0}</div>
              <div className="text-blue-700">Recipes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Package className="mx-auto mb-2 text-green-600" size={32} />
              <div className="text-2xl font-bold text-green-900">{profile._count?.inventory || 0}</div>
              <div className="text-green-700">Inventory Items</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <User className="mx-auto mb-2 text-purple-600" size={32} />
              <div className="text-2xl font-bold text-purple-900">{profile._count?.mealPlans || 0}</div>
              <div className="text-purple-700">Meal Plans</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={showRecipes}
            className="p-6 text-left bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            <ChefHat size={24} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">My Recipes</h3>
            <p className="opacity-90">Create, edit, and organize your favorite recipes</p>
          </button>
          <button
            onClick={showIngredients}
            className="p-6 text-left bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
          >
            <Package size={24} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            <p className="opacity-90">Manage your ingredient database and inventory</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 text-gray-900">{user?.email}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <div className="mt-1 text-gray-900">{profile?.username}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Member Since</label>
          <div className="mt-1 text-gray-900">
            {profile && new Date(profile.createdAt || '').toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'recipes':
        switch (recipeView) {
          case 'list':
            return (
              <RecipeList
                onRecipeSelect={handleRecipeSelect}
                onRecipeEdit={handleRecipeEdit}
                onRecipeDelete={handleRecipeDelete}
                onCreateNew={handleRecipeCreate}
              />
            );
          case 'detail':
            return selectedRecipe ? (
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setRecipeView('list')}
                onEdit={handleRecipeEdit}
                onDelete={handleRecipeDelete}
              />
            ) : null;
          case 'form':
            return (
              <RecipeForm
                recipe={editingRecipe}
                onSave={handleRecipeSave}
                onCancel={handleRecipeCancel}
              />
            );
        }
        break;
      case 'ingredients':
        switch (ingredientView) {
          case 'browser':
            return (
              <IngredientBrowser
                onIngredientEdit={handleIngredientEdit}
                onCreateNew={handleIngredientCreate}
              />
            );
          case 'form':
            return (
              <IngredientForm
                ingredient={editingIngredient}
                onSave={handleIngredientSave}
                onCancel={handleIngredientCancel}
              />
            );
        }
        break;
      case 'profile':
        return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
};