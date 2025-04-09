// models/favorite.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from './authHelper';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { secureRequest } from './authorizedRequest'; 

export const getFavoriteRecipes = async () => {
  try {
    const response = await secureRequest({
      method: 'get',
      url: `${API_BASE_URL}/favorites`,
    });

    await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    console.error('Lỗi khi tải danh sách yêu thích:', err);
    // throw err;
  }
};

// Thêm hoặc xóa món yêu thích (tự động gọi add/remove theo trạng thái hiện tại)
export const updateFavoriteRecipes = async (recipe: any) => {
  try {
    const stored = await AsyncStorage.getItem('favoriteRecipes');
    let parsed: any[] = [];

    try {
      const raw = stored ? JSON.parse(stored) : [];
      parsed = Array.isArray(raw.recipes) ? raw.recipes : [];
    } catch (parseError) {
      console.warn('Dữ liệu AsyncStorage bị lỗi, reset lại:', parseError);
      parsed = [];
      await AsyncStorage.removeItem('favoriteRecipes'); // xóa dữ liệu lỗi
    }
    const exists = parsed.some((item: any) => item._id === recipe._id);
    let updated;

    if (exists) {
      console.log('123');
      updated = parsed.filter((item: any) => item.id !== recipe.id);

      await secureRequest({
        method: 'delete',
        url: `${API_BASE_URL}/removefavorites`,
        data: { recipeId: recipe.id.toString() },
      });
    } else {
      console.log('3456');
      updated = [...parsed, recipe];

      await secureRequest({
        method: 'post',
        url: `${API_BASE_URL}/addfavorites`,
        data: { recipeId: recipe.id.toString() },
      });
    }

    await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Lỗi khi cập nhật món ăn yêu thích:', error);
    throw error;
  }
};