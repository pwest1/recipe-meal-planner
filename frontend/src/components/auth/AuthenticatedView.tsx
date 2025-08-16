import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { userService, UserProfile } from '../../services/userService';

export const AuthenticatedView = () => {
  const { user, logout, getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h2 className="text-xl mb-4">Welcome back!</h2>
      <p className="mb-2">Logged in as: <strong>{user?.email}</strong></p>
      
      {profileError && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {profileError}
        </div>
      )}

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
        <pre className="bg-orange-100 p-2 mt-2 rounded text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
      
      <button 
        onClick={logout}
        className="bg-orange-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};