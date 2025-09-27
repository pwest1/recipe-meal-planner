import { Home, ChefHat, Package, User, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onShowDashboard: () => void;
  onShowRecipes: () => void;
  onShowIngredients: () => void;
  onShowProfile: () => void;
  onLogout: () => void;
}

export const Sidebar = ({
  currentView,
  onShowDashboard,
  onShowRecipes,
  onShowIngredients,
  onShowProfile,
  onLogout,
}: SidebarProps) => {

  return (
    <nav className="h-screen sticky top-0 flex flex-col items-center p-4 w-20 bg-neutral-50 border-r border-neutral-500">
      <div className="flex flex-col space-y-2 mb-auto">
        <button
          onClick={onShowDashboard}
          className={currentView === 'dashboard' ? 'nav-item-active' : 'nav-item'}
          title="Dashboard"
        >
          <Home size={24} />
        </button>
        <button
          onClick={onShowRecipes}
          className={currentView === 'recipes' ? 'nav-item-active' : 'nav-item'}
          title="Recipes"
        >
          <ChefHat size={24} />
        </button>
        <button
          onClick={onShowIngredients}
          className={currentView === 'ingredients' ? 'nav-item-active' : 'nav-item'}
          title="Ingredients"
        >
          <Package size={24} />
        </button>
        <button
          onClick={onShowProfile}
          className={currentView === 'profile' ? 'nav-item-active' : 'nav-item'}
          title="Profile"
        >
          <User size={24} />
        </button>
      </div>

      <button
        onClick={onLogout}
        className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto"
        title="Logout"
      >
        <LogOut size={24} />
      </button>
    </nav>
  );
};