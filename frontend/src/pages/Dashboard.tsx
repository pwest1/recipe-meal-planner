import { ChefHat, Package, User } from 'lucide-react';
import { type UserProfile } from '../services/userService';


//Define props (data and function) dashboard needs to retrieve
interface DashboardProps {
  user: { name?: string | null } | null;
  profile: UserProfile | null;
  profileError: string | null;
  onShowRecipes: () => void;
  onShowIngredients: () => void;
}

export const Dashboard = ({ user, profile, profileError, onShowRecipes, onShowIngredients }: DashboardProps) => {
  return (
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
            onClick={onShowRecipes}
            className="group p-8 text-left border border-slate-500 bg-gradient-to-br from-primary-500 to-primary-600 text-blue-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 hover:shadow-strong"
          >
            <ChefHat size={32} className="mb-4 group-hover:animate-bounce-subtle" />
            <h3 className="text-2xl font-bold mb-3">My Recipes</h3>
            <p className="text-primary-100 text-lg">Create, edit, and organize your favorite recipes</p>
          </button>
          <button
            onClick={onShowIngredients}
            className="group p-8 text-left bg-gradient-to-br border border-slate-500 from-accent-500 to-accent-600 text-orange-600 rounded-2xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 hover:scale-105 hover:shadow-strong"
          >
            <Package size={32} className="mb-4 group-hover:animate-bounce-subtle" />
            <h3 className="text-2xl font-bold mb-3">Ingredients</h3>
            <p className="text-accent-100 text-lg">Manage your ingredient database and inventory</p>
          </button>
        </div>
      </div>
    </div>
  );
};