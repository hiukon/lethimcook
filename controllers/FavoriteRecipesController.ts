import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const useFavoriteRecipesController = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);

  const loadFavoriteRecipes = async () => {
    try {
      const data = await AsyncStorage.getItem('favoriteRecipes');
      if (data) {
        setFavoriteRecipes(JSON.parse(data));
      }
    } catch (error) {
      console.error('Lỗi khi tải công thức yêu thích:', error);
    }
  };

  const toggleFavorite = async (recipe: any) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('favoriteRecipes');
      const parsedRecipes: any[] = storedRecipes ? JSON.parse(storedRecipes) : [];

      const exists = parsedRecipes.some((item) => item.id === recipe.id);

      let updatedRecipes;
      if (exists) {
        updatedRecipes = parsedRecipes.filter((item) => item.id !== recipe.id);
        Alert.alert('Thông báo', 'Đã xóa khỏi danh sách yêu thích!');
      } else {
        updatedRecipes = [...parsedRecipes, recipe];
        Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
      }

      await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updatedRecipes));
      setFavoriteRecipes(updatedRecipes);
    } catch (error) {
      console.error('Lỗi khi cập nhật món ăn yêu thích:', error);
    }
  };

  const isRecipeFavorite = (id: string) => {
    return favoriteRecipes.some((item) => item.id === id);
  };

  return {
    favoriteRecipes,
    loadFavoriteRecipes,
    toggleFavorite,
    isRecipeFavorite,
  };
};

export default useFavoriteRecipesController;
