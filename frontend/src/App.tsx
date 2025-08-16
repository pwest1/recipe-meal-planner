import { useAuth } from './components/auth/useAuth';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AuthenticatedView } from './components/auth/AuthenticatedView';
import { UnauthenticatedView } from './components/auth/UnauthenticatedView';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Recipe Planner</h1>
        {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
      </div>
    </div>
  );
}

export default App;