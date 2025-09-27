import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { userService, type UserProfile } from '../services/userService';
import { RecipeList } from '../components/recipes/RecipeList';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeDetail } from '../components/recipes/RecipeDetail';
import { IngredientBrowser } from '../components/ingredients/IngredientBrowser';
import { IngredientForm } from '../components/ingredients/IngredientForm';
import type { Recipe, Ingredient } from '../types';
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
  <nav className="h-screen sticky top-0 flex flex-col items-center p-4 w-20 bg-neutral-50 border-r border-neutral-500">
    <div className="flex flex-col space-y-2 mb-auto">
      <button
        onClick={showDashboard}
        className={currentView === 'dashboard' ? 'nav-item-active' : 'nav-item'}
        title="Dashboard" 
      >
        <Home size={24} />
      </button>
      <button
        onClick={showRecipes}
        className={currentView === 'recipes' ? 'nav-item-active' : 'nav-item'}
        title="Recipes" 
      >
        <ChefHat size={24} />
      </button>
      <button
        onClick={showIngredients}
        className={currentView === 'ingredients' ? 'nav-item-active' : 'nav-item'}
        title="Ingredients" 
      >
        <Package size={24} />
      </button>
      <button
        onClick={showProfile}
        className={currentView === 'profile' ? 'nav-item-active' : 'nav-item'}
        title="Profile" 
      >
        <User size={24} />
      </button>
      
    </div>

    <button
      onClick={logout}
      className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto"
      title="Logout" 
    >
      <LogOut size={24} />
    </button>
  </nav>
);
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="card p-8 animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 text-balance ">
          Welcome back, {profile?.username || user?.name || 'Chef'}! 
        </h2>
        <p className="text-neutral-600 text-lg mb-8 text-balance">
          Manage your recipes and ingredients all in one place.
        </p>
        
        {profileError && (
          <div className="status-error p-4 text-red-300 rounded-xl mb-6">
            {profileError}
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-hover p-6 text-center bg-gradient-to-br from-primary-50 to-primary-100">
              <ChefHat className="mx-auto mb-4 text-primary-600" size={40} />
              <div className="text-3xl font-bold text-primary-900 mb-1">{profile._count?.recipes || 0}</div>
              <div className="text-primary-700 font-medium">Recipes</div>
            </div>
            <div className="card-hover p-6 text-center bg-gradient-to-br from-accent-50 to-accent-100">
              <Package className="mx-auto mb-4 text-accent-600" size={40} />
              <div className="text-3xl font-bold text-accent-900 mb-1">{profile._count?.inventory || 0}</div>
              <div className="text-accent-700 font-medium">Inventory Items</div>
            </div>
            <div className="card-hover p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <User className="mx-auto mb-4 text-purple-600" size={40} />
              <div className="text-3xl font-bold text-purple-900 mb-1">{profile._count?.mealPlans || 0}</div>
              <div className="text-purple-700 font-medium">Meal Plans</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <button
            onClick={showRecipes}
            className="group p-8 text-left border border-slate-500 bg-gradient-to-br from-primary-500 to-primary-600 text-blue-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 hover:shadow-strong"
          >
            <ChefHat size={32} className="mb-4 group-hover:animate-bounce-subtle" />
            <h3 className="text-2xl font-bold mb-3">My Recipes</h3>
            <p className="text-primary-100 text-lg">Create, edit, and organize your favorite recipes</p>
          </button>
          <button
            onClick={showIngredients}
            className="group p-8 text-left bg-gradient-to-br border border-slate-500 from-accent-500 to-accent-600 text-blue-600 rounded-2xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 hover:scale-105 hover:shadow-strong"
          >
            <Package size={32} className="mb-4 group-hover:animate-bounce-subtle" />
            <h3 className="text-2xl font-bold mb-3">Ingredients</h3>
            <p className="text-accent-100 text-lg">Manage your ingredient database and inventory</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="card p-8 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 gradient-text">Profile Information</h2>
      <div className="space-y-6">
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
          <div className="text-lg text-neutral-900 font-medium">{user?.email}</div>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Username</label>
          <div className="text-lg text-neutral-900 font-medium">{profile?.username}</div>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Member Since</label>
          <div className="text-lg text-neutral-900 font-medium">
            {profile && new Date(profile.createdAt || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
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
  <div className="flex min-h-screen">
    {/* Sidebar Navigation (fixed width) */}
    <div className="w-64 flex-shrink-0">
      {renderNavigation()}
    </div>

    {/* Main Content Area (takes remaining space) */}
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </main>
  </div>
);
};