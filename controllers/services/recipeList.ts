import axios from 'axios';
import { API_BASE_URL } from '@/config';

export type Recipe = {
  id: number;
  _id: string;
  name: string;
  image: string;
  author: string;
  ingredients: string[];
  steps: string[];
};

export const fetchRandomRecipes = async (): Promise<Recipe[]> => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
    .map((recipe: Recipe) => ({ ...recipe, id: Number(recipe.id) }));
};
