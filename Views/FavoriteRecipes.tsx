import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from './header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SearchController from '@/controllers/SearchRecipe';
import Icon from 'react-native-vector-icons/FontAwesome';


const FavoriteRecipes: React.FC = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const isFocused = useIsFocused();

  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isFocused) {
      loadFavoriteRecipes();
    }
  }, [isFocused]);

  const loadFavoriteRecipes = async () => {
    try {
      const data = await AsyncStorage.getItem('favoriteRecipes');
      if (data) {
        setFavoriteRecipes(JSON.parse(data));
      }
    } catch (error) {
      console.error('Lỗi khi tải công thức yêu thích:', error);
    }
  };

  const toggleFavorite = async (recipe: any) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('favoriteRecipes');
      const parsedRecipes: any[] = storedRecipes ? JSON.parse(storedRecipes) : [];

      const updatedRecipes = parsedRecipes.filter((item: any) => item.id !== recipe.id);

      if (updatedRecipes.length !== (storedRecipes ? storedRecipes.length : 0)) {
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updatedRecipes));
        setFavoriteRecipes(updatedRecipes);
        Alert.alert('Thông báo', 'Đã xóa khỏi danh sách yêu thích!');
      } else {
        const updatedStoredRecipes = storedRecipes ? [...parsedRecipes] : [];
        updatedStoredRecipes.push(recipe);
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updatedStoredRecipes));
        setFavoriteRecipes(updatedStoredRecipes);
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(storedRecipes));
        setFavoriteRecipes(storedRecipes ? JSON.parse(storedRecipes) : []);
        Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật món ăn yêu thích:', error);
    }
  };

  return (
    <View style={tw`bg-white flex-1 p-2`}>
      <View style={tw`flex-row `}>
        <Header />
        <Text style={tw`text-black text-xl p-2 items-center `}>Kho Món Ngon Của Bạn</Text>
      </View>
      <SearchController></SearchController> 
     
      <View style={tw`flex-row `}>
        <TouchableOpacity style={tw`flex-row items-center h-8 w-auto border rounded-xl px-3 mt-2 mb-5 bg-white-100 text-sm p-1 ml-4`}>
          <Icon name="bookmark" size={20} color="black" style={tw`mr-2`} />
          <Text style={tw`text-sm`}>Đã lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center h-8 w-auto border rounded-2xl px-3 mt-2 mb-5 bg-white-100 text-sm p-1 ml-3`}>
          <Icon name="heart" size={20} color="black" style={tw`mr-2`} />
          <Text style={tw`text-sm`}>Món Tủ</Text>
        </TouchableOpacity>
      </View>
        {favoriteRecipes.length === 0 ? (
        <Text style={tw`text-gray-400`}>Chưa có món ăn yêu thích nào.</Text>
      ) : (
       
      <FlatList 
          data={favoriteRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isFavorite = favoriteRecipes.some((recipe) => recipe.id === item.id);
            return (
            <>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Details', { recipe: item })}
                style={tw`bg-orange-100 p-3 mb-3 border rounded-lg flex-row items-center`}>
                <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded-lg mr-3`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-black text-lg`}>{item.name}</Text>
                  <Text style={tw`text-gray-400`}>Tác giả: {item.author}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Text style={tw`${isFavorite ? 'text-yellow-500' : 'text-gray-400'} text-3xl`}>★</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default FavoriteRecipes;
