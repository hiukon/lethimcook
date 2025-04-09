import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { RootStackParamList } from '@/types';
import { fetchRandomRecipes, Recipe } from '@/controllers/services/recipeList';
import { getUserData } from '@/models/authHelper';

type SearchViewRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;

const RecipeList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchViewRouteProp>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePressRecipe = (recipe: Recipe) => {
    navigation.navigate('Details', { recipe: { ...recipe, id: Number(recipe.id) } });
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { token } = await getUserData();
      if (!token) {
        navigation.navigate('Login');
      } else {
        setIsAuthenticated(true);
        setLoading(true);
        try {
          const data = await fetchRandomRecipes();
          setRecipes(data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách công thức:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthAndFetch();
  }, []);

  if (!isAuthenticated) return null;
  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      nestedScrollEnabled={true}
      renderItem={({ item }) => (
        <View style={tw`m-2 items-center`}>
          <TouchableOpacity onPress={() => handlePressRecipe(item)}>
            <Image source={{ uri: item.image }} style={tw`w-24 h-24 rounded-lg`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePressRecipe(item)}>
            <Text style={tw`text-l mt-1`}>{item.name}</Text>
          </TouchableOpacity>
          <Text style={tw`text-xs text-gray-500`}>{item.author}</Text>
        </View>
      )}
    />
  );
};

export default RecipeList;
