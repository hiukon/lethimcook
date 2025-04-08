// models/favorite.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFavoriteRecipes = async () => {
  try {
    const data = await AsyncStorage.getItem('favoriteRecipes');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    throw new Error('Lỗi khi tải công thức yêu thích');
  }
};

export const updateFavoriteRecipes = async (recipe: any) => {
  try {
    const stored = await AsyncStorage.getItem('favoriteRecipes');
    const parsed = stored ? JSON.parse(stored) : [];

    const exists = parsed.some((item: any) => item.id === recipe.id);
    let updated;

    if (exists) {
      updated = parsed.filter((item: any) => item.id !== recipe.id);
    } else {
      updated = [...parsed, recipe];
    }

    await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật món ăn yêu thích');
  }
};
