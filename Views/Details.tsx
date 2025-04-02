import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Animated, ImageBackground } from 'react-native';
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import tw from 'twrnc';
import Header from './header';
import SearchController from '@/controllers/SearchRecipe';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_BASE_URL = 'http://192.168.31.188:3000/api';
// const API_BASE_URL = 'http://172.20.10.2:3000/api';

// Định nghĩa kiểu dữ liệu cho route

// Define the type for route parameters
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const Details: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const route = useRoute<DetailsScreenRouteProp>();
  const { recipe } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const animatedValue = useRef(new Animated.Value(0)).current; 
  const startCooking = () => setCurrentStep(0);
  // Điều hướng giữa các bước
  const nextStep = () => setCurrentStep((prev) => (prev !== null && prev < recipe.steps.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  const [loading, setLoading] = useState(false);
  const INITIAL_HEIGHT = 300; 
  const HEADER_HEIGHT = 64; 

  
  const imageHeight = animatedValue.interpolate({
    inputRange: [0, 200], 
    outputRange: [INITIAL_HEIGHT, HEADER_HEIGHT], 
    extrapolate: "clamp",
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 200],
    outputRange: [0, (HEADER_HEIGHT - INITIAL_HEIGHT) / 2], // Đẩy ảnh lên để giữ giữa
    extrapolate: "clamp",
  });
  const titleOpacity = animatedValue.interpolate({
    inputRange: [100, 200], // Bắt đầu hiện dần từ 100px cuộn
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
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
      <AnimatedImageBackground
      
        source={{ uri: recipe.image }} 
        style={[tw`w-full`, { height: imageHeight }]}
      >
        
        <Animated.View style={tw`absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={tw`text-2xl text-white`}>←</Text>
          </TouchableOpacity>
          <Animated.Text style={[tw`text-lg font-bold text-white`, { opacity: titleOpacity }]}>
          {recipe.name}
          </Animated.Text>
          <View style={tw`flex-row items-center gap-4`}>
            <TouchableOpacity style={tw`flex-row items-center h-8 px-3  p-1 rounded-lg`}>
              <Icon name="filter" size={20} color="white"  />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </AnimatedImageBackground>

      {/* Nội dung cuộn */}
      <ScrollView
        style={tw`bg-white`}
        contentContainerStyle={tw`pt-4`} 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        <Text style={tw`text-2xl font-bold px-3 `}>Tên món ăn: {recipe.name}</Text>
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
        <View style={tw`flex-1 bg-white p-4`}>
          {/* Nếu đang ở chế độ từng bước */}
          {currentStep !== null ? (
            <View style={tw`items-center`}>
              {/*<Image
                source={{ uri: recipe.imagesteps }}
                style={tw`w-full h-64 rounded-lg mb-4`}/> */}
              <Text style={tw`text-2xl font-bold`}>Bước {currentStep + 1}</Text>
              <Text style={tw`text-lg text-gray-600 text-center mt-2`}>{recipe.steps[currentStep]}</Text>
              {/* Nút điều hướng */}
              <View style={tw`flex-row mt-6`}>
                <TouchableOpacity
                  onPress={prevStep}
                  disabled={currentStep === 0}
                  style={tw`px-4 py-2 bg-gray-300 rounded-lg mx-2 ${currentStep === 0 ? "opacity-50" : ""}`}
                >
                  <Text style={tw`text-lg`}>Quay lại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={nextStep}
                  disabled={currentStep === recipe.steps.length - 1}
                  style={tw`px-4 py-2 bg-orange-500 rounded-lg mx-2 ${currentStep === recipe.steps.length - 1 ? "opacity-50" : ""}`}
                >
                  <Text style={tw`text-lg text-white`}>Tiếp theo</Text>
                </TouchableOpacity>
              </View>

              {/* Nút thoát khỏi chế độ từng bước */}
              <TouchableOpacity
            onPress={() => setCurrentStep(null)}
            style={tw`mt-6 px-4 py-2 bg-red-500 rounded-lg`}
          >
            <Text style={tw`text-lg text-white`}>Thoát</Text>
          </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={tw`text-xl font-bold px-3 mt-3`}>🍳 Các bước nấu món</Text>
              <FlatList
                data={recipe.steps}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={tw`flex-row items-center m-2`}>
                    <View style={tw`w-8 h-8 bg-orange-300 rounded-full justify-center items-center`}>
                      <Text style={tw`text-lg font-bold`}>{index + 1}</Text>
                    </View>
                    <Text style={tw`px-3 text-2xl`}>{item}</Text>
                  </View>
                )}
              />

              {/* Nút Bắt đầu nấu */}
              <TouchableOpacity
                style={tw`bg-orange-500 p-3 rounded-lg mt-4`}
                onPress={startCooking}
              >
                <Text style={tw`text-white text-lg text-center`}>Bắt đầu nấu</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

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
                onPress={() => navigation.navigate('Details', { recipe: { ...item, id: Number(item.id) } })}> 
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


