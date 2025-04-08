import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const handleIngredientSearch = async (
  ingredientName: string,
  navigation: NativeStackNavigationProp<RootStackParamList>,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/search?q=${ingredientName}`);
    const results = response.data;

    if (results.length === 0) {
      alert('Không tìm thấy kết quả nào!');
      return;
    }

    navigation.navigate('SearchView', { searchQuery: ingredientName, searchResults: results });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm công thức:", error);
    alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
  } finally {
    setLoading(false);
  }
};
