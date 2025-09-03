import { api } from './api';
import type { Ingredient, CreateIngredientData, UpdateIngredientData, IngredientFilters } from '../types';

export const ingredientService = {
  async getIngredients(token: string, filters?: IngredientFilters): Promise<Ingredient[]> {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.category) queryParams.append('category', filters.category);
    
    const endpoint = queryParams.toString() 
      ? `/api/ingredients?${queryParams.toString()}`
      : '/api/ingredients';
    
    return api.get(endpoint, token);
  },

  async getIngredient(id: string, token: string): Promise<Ingredient> {
    return api.get(`/api/ingredients/${id}`, token);
  },

  async createIngredient(data: CreateIngredientData, token: string): Promise<Ingredient> {
    return api.post('/api/ingredients', data, token);
  },

  async updateIngredient(id: string, data: UpdateIngredientData, token: string): Promise<Ingredient> {
    return api.put(`/api/ingredients/${id}`, data, token);
  },

  async deleteIngredient(id: string, token: string): Promise<{ message: string }> {
    return api.delete(`/api/ingredients/${id}`, token);
  }
};