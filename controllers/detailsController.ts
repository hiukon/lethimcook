import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { updateFavoriteRecipes } from '@/models/favorite';
import { getAllRecipes } from './services/recipeApi';

export const useDetailsController = (recipe: any) => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const startCooking = () => setCurrentStep(0);
  const nextStep = () => setCurrentStep((prev) => (prev !== null && prev < recipe.steps.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  const fetchSimilarRecipes = async () => {
    setLoading(true);
    try {
      const data = await getAllRecipes();
      const filteredRecipes = data.filter(
        (item: any) =>
          item.id !== recipe.id &&
          item.ingredients.some((ing: string) => recipe.ingredients.includes(ing))
      );
      setSimilarRecipes(filteredRecipes);
    } catch (error) {
      console.error('Lỗi khi lấy công thức tương tự:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      const updated = await updateFavoriteRecipes(recipe);
      const isExist = updated.some((item: { id: string }) => item.id === recipe.id);

      Alert.alert(
        'Thông báo',
        isExist ? 'Đã thêm vào món yêu thích!' : 'Đã xóa khỏi danh sách yêu thích!'
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu thích:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật yêu thích.');
    }
  };

  useEffect(() => {
    fetchSimilarRecipes();
  }, []);

  return {
    currentStep,
    similarRecipes,
    loading,
    startCooking,
    nextStep,
    prevStep,
    handleFavorite,
    setCurrentStep
  };
};
