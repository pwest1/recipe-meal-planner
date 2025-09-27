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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 animate-in">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text text-balance">
            Recipe Planner
          </h1>
        </header>
        <main className="animate-fade-in">
          {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
        </main>
      </div>
    </div>
  );
}

export default App;