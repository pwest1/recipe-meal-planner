import { useAuth } from '../auth/useAuth';

export const UnauthenticatedView = () => {
  const { error, login, signup } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow content-center align-middle">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            Error: {error.message}
          </div>
        )}
        <div className="bg-slate-100 p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-800">Welcome!</h2>
          <p className="text-red-600 mt-2">Please login or sign up to continue</p>
        </div>
                <div className="p-6">
         
          <div className="flex flex-col space-y-4">
            <button
              onClick={login}
              
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={signup}
              
              className="w-full bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition-transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
       
      </div>
  </div>
  );
};