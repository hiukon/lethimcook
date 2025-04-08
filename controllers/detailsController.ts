// controllers/detailsController.ts
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

export const fetchSimilarRecipes = async (recipe: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`);
    const filteredRecipes = response.data.filter((item: any) =>
      item.id !== recipe.id &&
      item.ingredients.some((ing: string) => recipe.ingredients.includes(ing))
    );
    return filteredRecipes;
  } catch (error) {
    console.error('Lỗi khi lấy công thức tương tự:', error);
    throw error;
  }
};

export const handleFavorite = async (recipe: any) => {
  try {
    let favoriteRecipes = JSON.parse(await AsyncStorage.getItem('favoriteRecipes') || '[]') || [];

    const isExist = favoriteRecipes.some((item: any) => item.id === recipe.id.toString());

    if (!isExist) {
      favoriteRecipes.push({ ...recipe, id: recipe.id.toString() });
      await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      Alert.alert('Thành công', 'Đã thêm vào món yêu thích!');
    } else {
      Alert.alert('Thông báo', 'Món ăn này đã có trong danh sách yêu thích!');
    }
  } catch (error) {
    console.error('Lỗi khi lưu món ăn:', error);
    Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu món ăn.');
  }
};
