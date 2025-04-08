import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, FlatList, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Animated, ImageBackground
} from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from './header'; // UI component
import { fetchSimilarRecipes, handleFavorite } from '../controllers/detailsController';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const Details: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DetailsScreenRouteProp>();
  const { recipe } = route.params;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const INITIAL_HEIGHT = 300;
  const HEADER_HEIGHT = 64;

  // Scroll animations
  const imageHeight = animatedValue.interpolate({
    inputRange: [0, 200],
    outputRange: [INITIAL_HEIGHT, HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const titleOpacity = animatedValue.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const result = await fetchSimilarRecipes(recipe);
        setSimilarRecipes(result);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const startCooking = () => setCurrentStep(0);
  const nextStep = () => setCurrentStep((prev) => (prev !== null && prev < recipe.steps.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

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
          <TouchableOpacity style={tw`flex-row items-center h-8 px-3 p-1 rounded-lg`}>
            <Icon name="filter" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </AnimatedImageBackground>

      <ScrollView
        style={tw`bg-white`}
        contentContainerStyle={tw`pt-4`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Text style={tw`text-2xl font-bold px-3`}>Tên món ăn: {recipe.name}</Text>
        <Text style={tw`text-lg px-3 mb-2`}>Tác giả: {recipe.author}</Text>
        <Text style={tw`h-8 border rounded-lg px-3 mt-2 mb-5 bg-gray-100 text-sm text-center p-1`}>🕒 15 phút</Text>

        <Text style={tw`text-xl font-bold px-3 mt-3 mb-3`}>🛒 Nguyên liệu</Text>
        <FlatList
          data={recipe.ingredients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={tw`text-xl border-b-2 border-orange-500 p-2`}>• {item}</Text>
          )}
        />

        <View style={tw`flex-1 bg-white p-4`}>
          {currentStep !== null ? (
            <View style={tw`items-center`}>
              <Text style={tw`text-2xl font-bold`}>Bước {currentStep + 1}</Text>
              <Text style={tw`text-lg text-gray-600 text-center mt-2`}>
                {recipe.steps[currentStep]}
              </Text>
              <View style={tw`flex-row mt-6`}>
                <TouchableOpacity
                  onPress={prevStep}
                  disabled={currentStep === 0}
                  style={tw`px-4 py-2 bg-gray-300 rounded-lg mx-2 ${currentStep === 0 ? 'opacity-50' : ''}`}
                >
                  <Text style={tw`text-lg`}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={nextStep}
                  disabled={currentStep === recipe.steps.length - 1}
                  style={tw`px-4 py-2 bg-orange-500 rounded-lg mx-2 ${currentStep === recipe.steps.length - 1 ? 'opacity-50' : ''}`}
                >
                  <Text style={tw`text-lg text-white`}>Tiếp theo</Text>
                </TouchableOpacity>
              </View>
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
              <TouchableOpacity
                style={tw`bg-orange-500 p-3 rounded-lg mt-4`}
                onPress={startCooking}
              >
                <Text style={tw`text-white text-lg text-center`}>Bắt đầu nấu</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={tw`px-4 my-4 items-center`}>
          <TouchableOpacity style={tw`bg-orange-100 border p-3 rounded-lg mb-3`}>
            <Text style={tw`text-black text-center`}>Gửi cooksnap đầu tiên mở hàng!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-orange-100 border p-3 rounded-lg mb-3 flex-row items-center justify-center`}
            onPress={() => handleFavorite(recipe)}
          >
            <Text style={tw`text-black`}>🔔 Thêm vào Hôm Nay</Text>
          </TouchableOpacity>

          <Text style={tw`text-black text-center mb-3`}>ID Công thức: {recipe.id}</Text>
          <Text style={tw`text-black text-center mb-3`}>Lên sóng vào ngày 22 tháng 3, 2025</Text>
          <Text style={tw`text-black text-center mb-3`}>Lên sóng bởi: {recipe.author}</Text>

          <TouchableOpacity style={tw`bg-orange-100 border h-10 w-50 p-2 rounded-lg items-center justify-center`}>
            <Text style={tw`text-black text-center`}>Kết bạn bếp</Text>
          </TouchableOpacity>

          <View style={tw`border-t w-full border-gray-500 pt-4 mt-10`}>
            <Text style={tw`text-black text-l mr-2 px-2 mt-3 mb-2`}>💬 Bình Luận</Text>
            <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-full px-2 py-1`}>
              <Header />
              <TextInput placeholder="Thêm bình luận..." placeholderTextColor="black" style={tw`text-black flex-1 p-2`} />
            </View>
          </View>
        </View>

        {/* Công thức tương tự */}
        <Text style={tw`text-xl font-bold px-3 mt-5 mb-2`}>Các món có nguyên liệu tương tự</Text>
        {similarRecipes.length === 0 ? (
          <Text style={tw`px-3 text-gray-500`}>Không tìm thấy công thức tương tự.</Text>
        ) : (
          <FlatList
            data={similarRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Details', { recipe: { ...item, id: Number(item.id) } })}>
                <View style={tw`flex-row flex-wrap`}>
                  <Image source={{ uri: item.image }} style={tw`w-40 h-30 my-2 rounded-lg px-1`} />
                  <View style={tw`flex-1`}>
                    <Text style={tw`px-2 text-xl`}>• {item.name}</Text>
                    <Text style={tw`px-2 text-base`}>Nguyên liệu: {item.ingredients.join(', ')}</Text>
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
