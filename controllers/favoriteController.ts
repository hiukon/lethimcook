// controllers/favoriteController.ts
import { getFavoriteRecipes, updateFavoriteRecipes } from '@/models/favorite';

export const loadFavorites = async () => {
  return await getFavoriteRecipes();
};

export const toggleFavoriteRecipe = async (recipe: any) => {
  return await updateFavoriteRecipes(recipe);
};
