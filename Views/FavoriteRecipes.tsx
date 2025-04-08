// views/favorite.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from './header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SearchController from './searchRecipe';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loadFavorites, toggleFavoriteRecipe } from '@/controllers/favoriteController';

const FavoriteRecipes: React.FC = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const fetchFavorites = async () => {
    try {
      const data = await loadFavorites();
      setFavoriteRecipes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async (recipe: any) => {
    try {
      const updated = await toggleFavoriteRecipe(recipe);
      setFavoriteRecipes(updated);

      const message = updated.some((item: { id: any; }) => item.id === recipe.id)
        ? 'Đã thêm vào danh sách yêu thích!'
        : 'Đã xóa khỏi danh sách yêu thích!';
      Alert.alert('Thông báo', message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={tw`bg-white flex-1 p-2`}>
      <View style={tw`flex-row`}>
        <Header />
        <Text style={tw`text-black text-xl p-2`}>Kho Món Ngon Của Bạn</Text>
      </View>

      <SearchController />

      <View style={tw`flex-row`}>
        <TouchableOpacity style={tw`flex-row items-center h-8 w-auto border rounded-xl px-3 mt-2 mb-5 ml-4`}>
          <Icon name="bookmark" size={20} color="black" style={tw`mr-2`} />
          <Text style={tw`text-sm`}>Đã lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center h-8 w-auto border rounded-2xl px-3 mt-2 mb-5 ml-3`}>
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
            const isFavorite = favoriteRecipes.some((r) => r.id === item.id);
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('Details', { recipe: item })}
                style={tw`bg-orange-100 p-3 mb-3 border rounded-lg flex-row items-center`}>
                <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded-lg mr-3`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-black text-lg`}>{item.name}</Text>
                  <Text style={tw`text-gray-400`}>Tác giả: {item.author}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
                  <Text style={tw`${isFavorite ? 'text-yellow-500' : 'text-gray-400'} text-3xl`}>★</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default FavoriteRecipes;
