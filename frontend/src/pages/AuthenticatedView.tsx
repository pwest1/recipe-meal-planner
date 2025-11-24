import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { userService, type UserProfile } from '../services/userService';
import { RecipeList } from '../components/recipes/RecipeList';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeDetail } from '../components/recipes/RecipeDetail';
import { IngredientBrowser } from '../components/ingredients/IngredientBrowser';
import { IngredientForm } from '../components/ingredients/IngredientForm';
import type { Recipe, Ingredient } from '../types';
import { ProfilePage } from './ProfilePage'
import { Dashboard } from './Dashboard';
import { Sidebar } from '../components/layout/Sidebar';

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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
        <Dashboard
          user={user ?? null}
          profile={profile}
          profileError={profileError}
          onShowRecipes={showRecipes}
          onShowIngredients={showIngredients}
        />
      );
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
         return <ProfilePage user={user} profile={profile} />;
    }
  };

  return (
  <div className="flex min-h-screen">
    <Sidebar
      currentView={currentView}
      onShowDashboard={showDashboard}
      onShowRecipes={showRecipes}
      onShowIngredients={showIngredients}
      onShowProfile={showProfile}
      onLogout={logout}
    />

    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </main>
  </div>
);
};