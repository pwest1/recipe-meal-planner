import { api } from './api';

// Types
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

export interface UpdateUserProfileData {
  username?: string;
  email?: string;
}

export const userService = {
  // Kept this one and removed the duplicate 'getProfile'
  async fetchProfile(token: string): Promise<UserProfile> {
    const response = await api.get('/api/auth/profile', token);
    return response;
  }, // <-- I added the missing comma here

  async updateProfile(data: UpdateUserProfileData, token: string): Promise<UserProfile> {
    return api.put('/api/auth/profile', data, token);
  }
};