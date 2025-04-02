import React, { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, StatusBar} from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserToken, getUserData, removeUserToken } from '../models/authHelper';


type RootStackParamList = {
  SignUp: undefined;
  HomeScreen: undefined; 
  BottomTabNavigator: { screen: string, params: { screen: string; } }; // Điều hướng đến BottomTabNavigator
};

const API_BASE_URL = 'http://192.168.31.188:3000/api/user';
// const API_BASE_URL = 'http://172.20.10.2:3000/api/user';

const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      setEmail('');
      setPassword('');
      // Lưu token để sử dụng sau này (nếu cần)
      const { token, user } = response.data;
      console.log("Token nhận được:", token, user.username); // Debug token
      await AsyncStorage.setItem('user_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify({ 
        username: user?.username, 
        userId: user?.userId 
      }));
      navigation.navigate('BottomTabNavigator', {
        screen: 'TabHome',
        params: { screen: 'Home' }
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Lỗi', error.response?.data?.message || 'Đăng nhập thất bại!');
      } else {
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra!');
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
   <> 
    <StatusBar backgroundColor={"black"} ></StatusBar>
      <ImageBackground style={tw` flex-1 justify-center items-center px-5 `}
        source={require('../Img/bg_lg.jpg')}
        resizeMode="cover" >
        <Image source={require('../Img/pen.png')} style={tw`w-40 h-40 mb-9`} />
        <View style={tw`w-full border-2 border-gray-300 bg-black/30 rounded-lg p-3 mb-4 `}>
          <Text style={tw`text-2xl font-bold text-orange-200 mb-8 text-center`}>Xin chào !</Text>
          {/* Input Email */}
          <TextInput
            style={tw`w-full border-2 border-orange-300 leading-none  rounded-lg p-3 text-base mb-4 text-white`}
            placeholder="Nhập email"
            placeholderTextColor="white"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={tw`w-full border-2 border-orange-300  leading-none  rounded-lg p-3 text-base mb-4 text-white`}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="white"
            secureTextEntry
            value={password}
            onChangeText={setPassword}/>
          <TouchableOpacity>
            <Text style={tw`text-white self-end mb-6`}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`w-full bg-orange-400 py-4 rounded-lg mb-5 items-center`}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-lg font-bold`}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>

          {/* Đăng ký */}
          <Text style={tw`text-white text-center`}>
            Bạn chưa có tài khoản?{' '}
            <Text style={tw`text-orange-500 font-bold`} onPress={() => navigation.navigate('SignUp')}>
              Đăng ký
            </Text>
          </Text>
        </View>
      </ImageBackground>
      
    
  </> 
  );
  
};

export default Login;
