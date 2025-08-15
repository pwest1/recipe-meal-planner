import { api } from './api';

export const userService = {
  async getProfile(token: string) {
    return api.get('/api/protected/profile', token);
  },

  async updateProfile(data: any, token: string) {
    return api.put('/api/protected/profile', data, token);
  }
};