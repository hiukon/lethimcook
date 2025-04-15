import React, { useState, useEffect, useRef } from 'react';
import {
  View,Text,Image,FlatList,TouchableOpacity,Alert,Animated,
} from 'react-native';
import tw from 'twrnc';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from './header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SearchController from './searchRecipe';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loadFavorites, toggleFavoriteRecipe } from '@/controllers/favoriteController';

type Props = {
  onPress: () => void;
  isFavorite: boolean;
};

const FallingStarButton: React.FC<Props> = ({ onPress, isFavorite }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const [animating, setAnimating] = useState(false);

  const startFall = () => {
    setAnimating(true);
    Animated.sequence([
      Animated.timing(fallAnim, {
        toValue: 150,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fallAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimating(false));
  };

  const handlePress = () => {
    onPress();
    startFall();
  };

  return (
    <Animated.View style={{ transform: [{ translateY: fallAnim }] }}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={tw`${isFavorite ? 'text-yellow-500' : 'text-gray-400'} text-3xl`}>
          ★
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
      const data = await loadFavorites(navigation);
      setFavoriteRecipes(data.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async (recipe: any) => {
    try {
      const updated = await toggleFavoriteRecipe(recipe);
      setFavoriteRecipes(updated);
  
      const message = updated.some((item: { id: any }) => item.id === recipe.id)
        ? 'Đã thêm vào danh sách yêu thích!'
        : 'Đã xóa khỏi danh sách yêu thích!';
  
      // Delay hiển thị thông báo 2 giây
      setTimeout(() => {
        Alert.alert('Thông báo', message);
      }, 1000);
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
                style={tw`bg-orange-100 p-3 mb-3 border rounded-lg flex-row items-center`}
              >
                <Image source={{ uri: item.image }} style={tw`w-16 h-16 rounded-lg mr-3`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-black text-lg`}>{item.name}</Text>
                  <Text style={tw`text-gray-400`}>Tác giả: {item.author}</Text>
                </View>
                <FallingStarButton
                  onPress={() => handleToggleFavorite(item)}
                  isFavorite={isFavorite}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default FavoriteRecipes;
