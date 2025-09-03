import { api } from './api';

export interface UserProfile {
  id: string;
  username: string;
  _count?: {
    recipes: number;
  };
}

export const userService = {
  async fetchProfile(token: string): Promise<UserProfile> {
    const response = await api.get('/api/auth/profile', token);
    return response;
  }
};