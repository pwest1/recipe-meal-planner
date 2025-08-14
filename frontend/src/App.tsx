import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
    getAccessTokenSilently
  } = useAuth0();
  
  const [profile, setProfile] = useState(null);

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });
  
  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  useEffect(() => {
   
    const fetchProfile = async () => {
      if (isAuthenticated) {
        console.log('✅ User is authenticated, fetching profile...');
        try {
          console.log('🔑 Getting access token...');
          const token = await getAccessTokenSilently({ authorizationParams: {
          audience: 'https://api.recipe-planner.com' }});
          console.log('✅ Token received:', token ? 'Yes' : 'No');
          console.log('🌐 Making API call...');

          const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
            
          });
          console.log('Response status:', response.status);
          console.log('This is a pain in the ass')
          
          const data = await response.json();
          setProfile(data.user);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Recipe Planner - Auth0</h1>
        
        {isAuthenticated ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl mb-4">Welcome back!</h2>
            <p className="mb-2">Logged in as: <strong>{user?.email}</strong></p>
            
            {profile && (
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-bold mb-2">Database Profile:</h3>
                <p>ID: {profile.id}</p>
                <p>Username: {profile.username}</p>
                <p>Recipes: {profile._count?.recipes || 0}</p>
              </div>
            )}
            
            <details className="mb-4">
              <summary className="cursor-pointer text-blue-600">View Auth0 Data</summary>
              <pre className="bg-gray-100 p-2 mt-2 rounded text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
            
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default App;