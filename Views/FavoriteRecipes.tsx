import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from './header';
import SearchController from '@/controllers/SearchRecipe';
import useFavoriteRecipesController from '@/controllers/FavoriteRecipesController';

const FavoriteRecipes: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const {
    favoriteRecipes,
    loadFavoriteRecipes,
    toggleFavorite,
    isRecipeFavorite,
  } = useFavoriteRecipesController();

  useEffect(() => {
    if (isFocused) loadFavoriteRecipes();
  }, [isFocused]);

  return (
    <View style={tw`bg-white flex-1 p-2`}>
      <View style={tw`flex-row`}>
        <Header />
        <Text style={tw`text-black text-xl p-2`}>Kho Món Ngon Của Bạn</Text>
      </View>

      <SearchController />

      <View style={tw`flex-row`}>
        <TouchableOpacity style={tw`flex-row items-center border rounded-xl px-3 ml-4 mt-2 mb-5`}>
          <Icon name="bookmark" size={20} color="black" style={tw`mr-2`} />
          <Text>Đã lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center border rounded-xl px-3 ml-3 mt-2 mb-5`}>
          <Icon name="heart" size={20} color="black" style={tw`mr-2`} />
          <Text>Món Tủ</Text>
        </TouchableOpacity>
      </View>

      {favoriteRecipes.length === 0 ? (
        <Text style={tw`text-gray-400`}>Chưa có món ăn yêu thích nào.</Text>
      ) : (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Details', { recipe: item })}
              style={tw`bg-orange-100 p-3 mb-3 border rounded-lg flex-row items-center`}>
              <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded-lg mr-3`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-black text-lg`}>{item.name}</Text>
                <Text style={tw`text-gray-400`}>Tác giả: {item.author}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Text style={tw`${isRecipeFavorite(item.id) ? 'text-yellow-500' : 'text-gray-400'} text-3xl`}>
                  ★
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default FavoriteRecipes;
