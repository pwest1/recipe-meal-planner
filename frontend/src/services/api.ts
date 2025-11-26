
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export const api = {
  async request(endpoint: string, options: ApiOptions = {}) {
    const { token, ...fetchOptions } = options;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>)
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    });

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (e) {
        error = { message: `Request failed with status: ${response.status}` };
      }
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return;
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