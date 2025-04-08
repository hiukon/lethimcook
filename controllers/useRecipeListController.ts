import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { RootStackParamList } from '@/types';
import { getUserData } from '../models/authHelper';
import { API_BASE_URL } from '../config';

export type Recipe = {
  id: number;
  _id: string;
  name: string;
  image: string;
  author: string;
  ingredients: string[];
  steps: string[];
};

const useRecipeListController = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePressRecipe = (recipe: Recipe) => {
    navigation.navigate('Details', { recipe: { ...recipe, id: Number(recipe.id) } });
  };

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      const data = response.data;
      const randomRecipes = data
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((recipe: Recipe) => ({
          ...recipe,
          id: Number(recipe.id),
        }));
      setRecipes(randomRecipes);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách công thức:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { token } = await getUserData();
      if (!token) {
        navigation.navigate('Login');
      } else {
        setIsAuthenticated(true);
        fetchRandomRecipes();
      }
    };

    checkAuth();
  }, []);

  return {
    recipes,
    loading,
    isAuthenticated,
    handlePressRecipe,
  };
};

export default useRecipeListController;
