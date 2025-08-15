import { useAuth } from './auth/useAuth';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthenticatedView } from './components/AuthenticatedView';
import { UnauthenticatedView } from './components/UnauthenticatedView';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Recipe Planner - Auth0</h1>
        {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
      </div>
    </div>
  );
}

export default App;