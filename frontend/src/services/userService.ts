import { api } from './api';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    recipes: number;
    mealPlans: number;
    inventory: number;
    shoppingLists: number;
  };
}

export const userService = {
  async fetchProfile(token: string): Promise<UserProfile> {
    const response = await api.get('/api/auth/profile', token);
    return response;
  }
};