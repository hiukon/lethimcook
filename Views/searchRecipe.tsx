import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { fetchAllRecipes, searchRecipesByQuery } from '@/controllers/services/searchRecipe';
import CustomLoading from './CustomLoading';

const SearchRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công thức:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchRecipesByQuery(searchQuery);
      setSearchResults(data);
      setLoading(false);
      navigation.navigate('BottomTabNavigator', {
        screen: 'Tìm kiếm',
        params: { screen: 'Search', params: { searchResults: data } },
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm công thức:', error);
    }
  };

  if (loading) return <CustomLoading />;

  return (
    <View style={tw`flex p-1`}>
      <View style={tw`flex-row items-center border rounded-2xl px-2 bg-orange-50 mb-1`}>
        <TextInput
          placeholder="Nhập món ăn cần tìm..."
          placeholderTextColor="gray"
          style={tw`flex-1 h-9 text-xs leading-none px-2`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchRecipe;
