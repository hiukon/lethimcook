// src/services/handleIngredientSearch.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { searchRecipesByIngredient } from './services/searchApi';

export const handleIngredientSearch = async (
  ingredientName: string,
  navigation: NativeStackNavigationProp<RootStackParamList>,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const results = await searchRecipesByIngredient(ingredientName);
    console.log("2222");
    if (results.length === 0) {
      alert('Không tìm thấy kết quả nào!');
      return;
    }

    navigation.navigate('SearchView', {
      searchQuery: ingredientName,
      searchResults: results,
    });
  } catch (error) {
    console.error('Lỗi khi tìm kiếm công thức:', error);
    alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
  } finally {
    setLoading(false);
  }
};
