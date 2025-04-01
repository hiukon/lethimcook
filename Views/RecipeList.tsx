import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import tw from 'twrnc';
import { RootStackParamList } from '@/types';
import { getUserData } from '../models/authHelper';
import Login from './Login';

const API_BASE_URL = 'http://192.168.31.188:3000/api';
// const API_BASE_URL = 'http://172.20.10.2:3000/api';

type SearchViewRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;

const RecipeList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchViewRouteProp>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  type Recipe = {
    id: number;
    _id: string;
    name: string;
    image: string;
    author: string;
    ingredients: string[];
    steps: string[];
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handlePressRecipe = (recipe: Recipe) => {
    navigation.navigate('Details', { recipe: { ...recipe, id: Number(recipe.id) } });
  };
  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      const randomRecipes = response.data
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((recipe: Recipe) => ({ ...recipe, id: Number(recipe.id) }));
      setRecipes(randomRecipes);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách công thức:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const { token } = await getUserData();
      if (!token) {
        navigation.navigate('Login');
      } else {
        setIsAuthenticated(true);
        fetchRandomRecipes();
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

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