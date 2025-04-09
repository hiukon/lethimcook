// src/services/api/searchApi.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const searchRecipesByIngredient = async (ingredientName: string) => {
  const response = await axios.get(`${API_BASE_URL}/search?q=${ingredientName}`);
  return response.data;
};
