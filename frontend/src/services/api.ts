const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiOptions extends RequestInit {
  token?: string;
}

export const api = {
  async request(endpoint: string, options: ApiOptions = {}) {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint: string, token?: string) {
    return this.request(endpoint, { method: 'GET', token });
  },

  post(endpoint: string, data: any, token?: string) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token
    });
  },

  put(endpoint: string, data: any, token?: string) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token
    });
  },

  delete(endpoint: string, token?: string) {
    return this.request(endpoint, { method: 'DELETE', token });
  }
};