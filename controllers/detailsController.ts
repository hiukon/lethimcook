import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@/config';

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
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      const filteredRecipes = response.data.filter(
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
      let favoriteRecipes = JSON.parse(await AsyncStorage.getItem('favoriteRecipes') || '[]') || [];
      const isExist = favoriteRecipes.some((item: { id: string }) => item.id === recipe.id.toString());

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
