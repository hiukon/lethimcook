import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import tw from 'twrnc';
import Header from './header';
import SearchController from '@/controllers/SearchRecipe';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


const API_BASE_URL = 'http:/192.168.1.165:3000/api';

// Định nghĩa kiểu dữ liệu cho route

// Define the type for route parameters
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const Details: React.FC = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { recipe } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState<{
    _id: string; id: number; name: string; ingredients: string[]; author: string; image: string; steps: string[] 
}[]>([]);

  useEffect(() => {
    fetchSimilarRecipes();
  }, []);

  const fetchSimilarRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      const filteredRecipes = response.data.filter(
        (item: { id: number; name: string; ingredients: any[]; author: string; image: string; steps: string[] }) =>
          item.id !== recipe.id && item.ingredients.some(ing => recipe.ingredients.includes(ing))
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
      // Kiểm tra trạng thái mạng
      const netState = await NetInfo.fetch();
  
      // Lấy dữ liệu yêu thích từ AsyncStorage
      let favoriteRecipes = JSON.parse(await AsyncStorage.getItem('favoriteRecipes') || '[]') || [];
  
      const isExist = favoriteRecipes.some((item: { id: string; }) => item.id === recipe.id.toString());
  
      if (!isExist) {
        favoriteRecipes.push({ ...recipe, id: recipe.id.toString() });
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
        Alert.alert('Thành công', 'Đã thêm vào món yêu thích!');
  
       // Nếu có mạng, lưu lên MongoDB
if (netState.isConnected) {
  try {
    // Sửa lại URL cho đúng route "/api/favorites/addFavorite"
    await axios.post(`${API_BASE_URL}/favorites/addFavorite`, {
      name: recipe.name,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      author: recipe.author,
      image: recipe.image,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    Alert.alert('Thành công', 'Dữ liệu đã được lưu lên MongoDB!');
  } catch (error) {
    console.error('Lỗi khi lưu lên MongoDB:', error);
    Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu dữ liệu lên MongoDB.');
  }
} else {
  Alert.alert('Không có kết nối mạng', 'Món ăn đã lưu offline. Hãy kết nối mạng để đồng bộ.');
}

        // Điều hướng đến trang FavoriteRecipes
        // navigation.navigate('FavoriteRecipes' as never);
      } else {
        Alert.alert('Thông báo', 'Món ăn này đã có trong danh sách yêu thích!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu món ăn:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu món ăn.');
    }
  };
  

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  

  return (
    <>
      {/* Header */}
      <View style={tw` flex-row justify-between items-center bg-white  py-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-2xl`}>← </Text>
        </TouchableOpacity>
        <Header />
        <SearchController />
        <View style={tw`flex-row items-center gap-4`}>
          <TouchableOpacity><Text style={tw`text-lg`}>📌</Text></TouchableOpacity>
          <TouchableOpacity><Text style={tw`text-lg`}>•••</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`bg-white`}>
        {/* Hình ảnh và thông tin cơ bản */}
        <Image source={{ uri: recipe.image }} style={tw`w-full h-64 my-2 rounded-lg`} />
        <Text style={tw`text-2xl font-bold px-3 mt-2`}>Tên món ăn: {recipe.name}</Text>
        <Text style={tw`text-lg px-3 mb-2 `}>Tác giả: {recipe.author}</Text>
      
        <Text style={tw`h-8 w-auto border rounded-lg px-3 mt-2 mb-5 bg-gray-100 text-sm text-center p-1`}>🕒 15 phút</Text>
       
        <Text style={tw`text-xl font-bold px-3 mt-3 mb-3`}>🛒 Nguyên liệu</Text>
        <FlatList
          data={recipe.ingredients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={tw` text-xl  border-b-2  border-orange-500  p-2`}>• {item}</Text>
          )}
          nestedScrollEnabled={true}
        />

        {/* Cách làm */}
        <Text style={tw`text-xl font-bold px-3 mt-3`}>🍳 Các bước nấu món </Text>
        <FlatList
          data={recipe.steps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={tw`flex-row items-center m-2`}>
              <View style={tw`w-8 h-8 bg-orange-300 rounded-full justify-center items-center mt-0 `}>
                <Text style={tw`text-lg font-bold `}>{index + 1}</Text>
              </View>
              <Text style={tw`px-3 text-2xl`}>{item}</Text>
            </View>
          )}
          nestedScrollEnabled={true}
        />

        <View>
          <Text style={tw`text-black text-l mr-2 px-2 mt-2 `}>Bày tỏ cảm xúc của bạn</Text>
           <View style={tw`flex-row px-4 mb-4`}>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Text style={tw`text-black text-xl mr-2`}>❤️</Text>
              <Text style={tw`text-black`}>1</Text>
            </TouchableOpacity>
            </View>
          </View>
        <View style={tw`px-4 my-4 items-center`}>
         
         <TouchableOpacity style={tw`bg-orange-100 border p-3 rounded-lg mb-3`}>
           <Text style={tw`text-black text-center `}>Gửi cooksnap đầu tiên mở hàng!</Text>
         </TouchableOpacity>
         <TouchableOpacity
          style={tw`bg-orange-100 border p-3 rounded-lg mb-3 flex-row items-center justify-center`}
          onPress={handleFavorite}
        >
          <Text style={tw`text-black`}>🔔 Thêm vào Hôm Nay</Text>
        </TouchableOpacity>
         <Text style={tw`text-black text-center mb-3`}>ID Công thức: {recipe.id} </Text>
         <Text style={tw`text-black text-center mb-3`}>Lên sóng vào ngày 22 tháng 3, 2025</Text>
         <View style={tw`flex-row items-center justify-center mb-4`}>
         
           <Text style={tw`text-black`}>Lên sóng bởi : {recipe.author}</Text>
         </View>
         <TouchableOpacity style={tw`bg-orange-100 border h-10 items-center justify-center w-50  p-2 rounded-lg`}>
           <Text style={tw` text-black  text-center`}>Kết bạn bếp</Text>
         </TouchableOpacity>

         <View style={tw`border-t w-full border-gray-500 pt-4 mt-10`}>
         <Text style={tw`text-black text-l mr-2 px-2 mt-3 mb-2`}>💬 Bình Luận</Text>
           <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-full px-2 py-1`}>
             <Header></Header>
           <TextInput placeholder="Thêm bình luận..." placeholderTextColor="black" style={tw`text-black flex-1 p-2`} />
           </View>
         </View>
       </View>

        {/* Các món có nguyên liệu tương tự */}
        <Text style={tw`text-xl font-bold px-3 mt-5 mb-2`}>Các món có nguyên liệu tương tự</Text>
        {similarRecipes.length === 0 ? (
          <Text style={tw`px-3  text-gray-500`}>Không tìm thấy công thức tương tự.</Text>
        ) : (
          <FlatList
            data={similarRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Details', { recipe: { ...item, id: Number(item.id) } })}
              > 
             <View style={tw`flex-row flex-wrap`}>
              <Image source={{ uri: item.image }} style={tw`w-40 h-30 my-2 rounded-lg px-1 bg-`} />
              <View style={tw`flex-1`}>
                <Text style={tw`px-2 text-xl flex-wrap break-words mt-4`}>• {item.name}</Text>
                <Text style={tw`px-2 text-xxl flex-wrap break-words`}>Nguyên liệu: {item.ingredients.join(', ')}</Text>
              </View>
            </View>

              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
            
          />
        )}
      </ScrollView>
    </>
  );
};

export default Details;
