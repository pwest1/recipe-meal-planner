import { useAuth } from './useAuth';

export const UnauthenticatedView = () => {
  const { error, login, signup } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}
      <h2 className="text-xl mb-4">Welcome! Please login to continue</h2>
      <div className="space-x-4">
        <button 
          onClick={login}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button 
          onClick={signup}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};