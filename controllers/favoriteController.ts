// controllers/favoriteController.ts
import { getFavoriteRecipes, updateFavoriteRecipes } from '@/models/favorite';
import { getUserData } from '@/models/authHelper';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export const loadFavorites = async (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { token, refreshToken, user } = await getUserData();
    if(!token || !refreshToken || !user){
      navigation.navigate('Login');
      return [];
    }
  return await getFavoriteRecipes();
};

export const toggleFavoriteRecipe = async (recipe: any) => {
  return await updateFavoriteRecipes(recipe);
};
