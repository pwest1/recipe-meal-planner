import { useAuth } from './auth/useAuth';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AuthenticatedView } from './pages/AuthenticatedView';
import { UnauthenticatedView } from './pages/UnauthenticatedView';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
     
       
        <main className="animate-fade-in">
           <header className="text-center mb-8 lg:mb-12 pt-8 ">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-green-500 gradient-text text-balance">
            RecipeRouter
          </h1>
        </header>
          {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
        </main>

  );
}

export default App;