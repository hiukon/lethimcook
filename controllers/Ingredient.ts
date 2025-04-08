
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

// Hàm xử lý tìm kiếm theo nguyên liệu
export const handleIngredientSearch = async (
  ingredientName: string,
  navigation: NativeStackNavigationProp<RootStackParamList>,
  setLoading: (value: boolean) => void
) => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/search?q=${ingredientName}`);
    const results = response.data;

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
