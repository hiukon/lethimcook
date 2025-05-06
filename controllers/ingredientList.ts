// controllers/searchController.ts
import { searchRecipesByIngredient } from './services/searchApi';

export const handleIngredientSearch = async (
  ingredientName: string,
  setLoading: (loading: boolean) => void
): Promise<{ success: boolean; results?: any[] }> => {
  try {
    setLoading(true);
    const results = await searchRecipesByIngredient(ingredientName);

    if (results.length === 0) {
      alert('Không tìm thấy kết quả nào!');
      return { success: false };
    }

    return { success: true, results };
  } catch (error) {
    console.error('Lỗi khi tìm kiếm công thức:', error);
    alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
    return { success: false };
  } finally {
    setLoading(false);
  }
};
