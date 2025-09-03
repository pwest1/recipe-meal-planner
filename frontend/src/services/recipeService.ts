import { api } from './api';
import type { Recipe, CreateRecipeData, UpdateRecipeData } from '../types';

export const recipeService = {
  async getRecipes(token: string): Promise<Recipe[]> {
    return api.get('/api/recipes', token);
  },

  async getRecipe(id: string, token: string): Promise<Recipe> {
    return api.get(`/api/recipes/${id}`, token);
  },

  async createRecipe(data: CreateRecipeData, token: string): Promise<Recipe> {
    return api.post('/api/recipes', data, token);
  },

  async updateRecipe(id: string, data: UpdateRecipeData, token: string): Promise<Recipe> {
    return api.put(`/api/recipes/${id}`, data, token);
  },

  async deleteRecipe(id: string, token: string): Promise<{ message: string }> {
    return api.delete(`/api/recipes/${id}`, token);
  }
};