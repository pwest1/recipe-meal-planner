import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ApiTest = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');

  // Test the health endpoint
  const testHealthEndpoint = async () => {
    setLoading(true);
    setError('');
    setApiResponse(null);
    
    try {
      // Get the Auth0 token
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://api.recipe-planner.com'
        }
      });
      
      // Show token for debugging (remove in production!)
      setToken(accessToken);
      console.log('Token obtained:', accessToken);

      // Call your backend API
      const response = await fetch('http://localhost:5001/api/health', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      console.log('API Response:', data);
      
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to call API');
    } finally {
      setLoading(false);
    }
  };

  // Test a protected route (like profile)
  const testProtectedRoute = async () => {
    setLoading(true);
    setError('');
    setApiResponse(null);
    
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://api.recipe-planner.com'
        }
      });

      const response = await fetch('http://localhost:5001/api/protected/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to call API');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>API Test</h2>
        <p>Please log in to test the API</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>API Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>User:</strong> {user?.email}</p>
        <p><strong>Auth0 ID:</strong> {user?.sub}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testHealthEndpoint}
          disabled={loading}
          style={{ 
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test Health Endpoint'}
        </button>

        <button 
          onClick={testProtectedRoute}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test Profile Endpoint'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {apiResponse && (
        <div style={{ 
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>Success! API Response:</strong>
          <pre style={{ marginTop: '10px' }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      {token && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer' }}>Show Token (Debug Only)</summary>
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            wordBreak: 'break-all',
            fontSize: '12px'
          }}>
            {token}
          </div>
        </details>
      )}
    </div>
  );
};

export default ApiTest;