import { useAuth0 } from '@auth0/react';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently 
  } = useAuth0();

  const login = () => {
    loginWithRedirect();
  };

  const signup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  };

  const logout = () => {
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  const getToken = async () => {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://api.recipe-planner.com'
        }
      });
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    signup,
    logout,
    getToken
  };
};