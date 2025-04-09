import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const fetchAllRecipes = async () => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data;
};

export const searchRecipesByQuery = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/search?q=${query}`);
  return response.data;
};
