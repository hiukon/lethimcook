import React, { useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity,ActivityIndicator } from 'react-native';
import { ingredients } from '../models/ingredientsData';
import tw from 'twrnc';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import axios from 'axios';
import { API_BASE_URL } from '../config';

type SearchViewRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;

const IngredientList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchViewRouteProp>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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
  const { width } = Dimensions.get('window');

  const handleSearch = async(ingredientName: string) => {
    // Điều hướng đến màn hình tìm kiếm và truyền tên nguyên liệu
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/search?q=${ingredientName}`);
      const results = response.data;

      if (results.length === 0) {
          alert('Không tìm thấy kết quả nào!');
          return;
      }

      // Điều hướng đến màn hình hiển thị kết quả
      navigation.navigate('SearchView', { searchQuery: ingredientName, searchResults: results });
  } catch (error) {
      console.error("Lỗi khi tìm kiếm công thức:", error);
      alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
  } finally {
      setLoading(false);
  }
  };

  return (
    <View>
      <Text style={tw`text-xl m-2`}>Nguyên Liệu Phổ Biến</Text>
      <FlatList
        style={tw`flex-1 rounded-lg`}
        data={ingredients}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={tw`w-[${width / 2 - 22}px] items-center m-2.1`}>
            <TouchableOpacity
              style={tw`relative rounded-lg overflow-hidden`}
              onPress={() => handleSearch(item.name)} >
              <Image source={item.image} style={tw`w-49 h-33 rounded-lg`} />
              <Text style={tw`absolute bottom-0 text-white text-base font-bold p-1 w-full p-2 text-left`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default IngredientList;