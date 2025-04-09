// src/services/api/recipeApi.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const getAllRecipes = async () => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data;
};
