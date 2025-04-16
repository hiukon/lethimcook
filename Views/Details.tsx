import React, { useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput,
  Animated, ImageBackground
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';

import Header from './header';
import { useDetailsController } from '@/controllers/detailsController';
import CustomLoading from './CustomLoading';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const Details: React.FC = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { recipe } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const {
    currentStep, similarRecipes, loading,
    startCooking, nextStep, prevStep,
    handleFavorite, setCurrentStep
  } = useDetailsController(recipe);

  const INITIAL_HEIGHT = 300;
  const HEADER_HEIGHT = 64;

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

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    startShake();
    handleFavorite();
  };

  if (loading) return <CustomLoading />;

  return (
    <>
      <AnimatedImageBackground
        source={{ uri: recipe.image }}
        style={[tw`w-full`, { height: imageHeight }]}>
        <Animated.View style={tw`absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={tw`text-2xl text-white`}>←</Text>
          </TouchableOpacity>
          <Animated.Text style={[tw`text-lg font-bold text-white`, { opacity: titleOpacity }]}>
            {recipe.name}
          </Animated.Text>
          <TouchableOpacity>
            <Icon name="filter" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </AnimatedImageBackground>

      <ScrollView
        style={tw`bg-white`}
        contentContainerStyle={tw`pt-4 pb-8`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Text style={tw`text-2xl font-bold px-3`}>Tên món ăn: {recipe.name}</Text>
        <Text style={tw`text-lg px-3 mb-2`}>Tác giả: {recipe.author}</Text>
        <Text style={tw`h-8 border rounded-xl px-3 mt-2 mb-5 bg-gray-100 text-sm text-center p-1`}>🕒 15 phút</Text>

        <Text style={tw`text-xl font-bold px-3 mt-3 mb-3`}>🛒 Nguyên liệu</Text>
        {recipe.ingredients.map((item, index) => (
          <Text key={index} style={tw`text-xl border-b-2 border-orange-200 p-2`}>• {item}</Text>
        ))}

        <View style={tw`flex-1 bg-white p-4`}>
          {currentStep !== null ? (
            <View style={tw`items-center`}>
              <Text style={tw`text-2xl font-bold`}>Bước {currentStep + 1}</Text>
              <Text style={tw`text-lg text-gray-600 text-center mt-2`}>{recipe.steps[currentStep]}</Text>

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
              {recipe.steps.map((item, index) => (
                <View key={index} style={tw`flex-row items-center m-2`}>
                  <View style={tw`w-8 h-8 bg-orange-300 rounded-full justify-center items-center`}>
                    <Text style={tw`text-lg font-bold`}>{index + 1}</Text>
                  </View>
                  <Text style={tw`px-3 text-xl`}>{item}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={tw`bg-orange-500 p-3 rounded-lg mt-4`}
                onPress={startCooking}
              >
                <Text style={tw`text-white text-lg text-center`}>Bắt đầu nấu</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={tw`flex-row px-4 mt-2`}>
          <Text style={tw`text-black text-l`}>Bày tỏ cảm xúc của bạn</Text>
          {['❤️', '😋', '👏'].map((icon, i) => (
            <TouchableOpacity key={i} style={tw`flex-row items-center bg-gray-100 ml-2 border rounded-xl`}>
              <Text style={tw`text-black text-l m-0.5`}> {icon} </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`flex-row px-4 my-4`}>
          <TouchableOpacity style={tw`bg-orange-100 flex-row border p-1 rounded-2xl mr-6`}>
            <Icon name="camera" size={15} color="black" style={tw`ml-1 mt-0.5`} />
            <Text style={tw`text-black`}> Gửi cooksnap đầu tiên! </Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <TouchableOpacity
              style={tw`bg-orange-100 flex-row border p-1 rounded-2xl`}
              onPress={handlePress}>
              <Text style={tw`text-black text-l`}> ⭐ Thêm món ngon </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={tw`items-center`}>
          <Text style={tw`text-black mb-3`}>ID Công thức: {recipe.id}</Text>
          <Text style={tw`text-black mb-3`}>Lên sóng vào ngày 22 tháng 3, 2025</Text>
          <Header />
          <Text style={tw`text-black mb-4`}>Lên sóng bởi: {recipe.author}</Text>

          <TouchableOpacity style={tw`bg-orange-100 border h-10 items-center justify-center w-50 p-2 rounded-lg`}>
            <Text style={tw`text-black text-center`}>Kết bạn bếp</Text>
          </TouchableOpacity>

          <View style={tw`border-t w-full border-gray-500 pt-4 mt-10`}>
            <Text style={tw`text-black text-l px-2 mb-2`}>💬 Bình Luận</Text>
            <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-full px-2 py-1`}>
              <Header />
              <TextInput
                placeholder="Thêm bình luận..."
                placeholderTextColor="black"
                style={tw`text-black flex-1 p-2`}
              />
            </View>
          </View>
        </View>

        <Text style={tw`text-xl font-bold px-3 mt-5 mb-2`}>Các món có nguyên liệu tương tự</Text>
        {similarRecipes.length === 0 ? (
          <Text style={tw`px-3 text-gray-500`}>Không tìm thấy công thức tương tự.</Text>
        ) : (
          similarRecipes.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.push('Details', { recipe: { ...item, id: Number(item.id) } })}
            >
              <View style={tw`flex-row flex-wrap mb-4 px-2`}>
                <Image
                  source={{ uri: item.image }}
                  style={tw`w-40 h-30 rounded-lg`}
                />
                <View style={tw`flex-1 px-2`}>
                  <Text style={tw`text-xl`}>• {item.name}</Text>
                  <Text>Nguyên liệu: {item.ingredients.join(', ')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );
};

export default Details;
