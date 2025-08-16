import api from './api'

export const getRecipe = async (id:string, accessToken: string) => {
    const response = await api.get('/recipes/${id}', accessToken);
    return response.data;
}

export const getRecipes = async (accessToken: string) => {
  const response = await api.get('/recipes', accessToken);
  return response.data;
};