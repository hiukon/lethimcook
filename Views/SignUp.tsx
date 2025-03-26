import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';


const API_BASE_URL = 'http:/192.168.1.165:3000/api/user';

type RootStackParamList = {
  Login: undefined;
};

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username: name,
        email,
        password,
      });
      Alert.alert('Thành công', 'Đăng ký thành công! Hãy đăng nhập.');
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra!');
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra!');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ImageBackground style={tw` flex-1 justify-center items-center  px-5`}
            source={require('../Img/ca.jpg')}
            resizeMode="cover" > 
      <Image source={require('../Img/pen.png')} style={tw`w-40 h-40 mb-5`} />
      <View style={tw`w-full border-2 border-gray-300 bg-black/30 rounded-lg p-3 mb-4 text-black`}>
          <Text style={tw`text-2xl font-bold text-orange-200 text-center mb-8`}>Đăng ký tài khoản</Text>
          <TextInput
            style={tw`w-full border-2 border-orange-300 rounded-lg p-3 text-base mb-4`}
            placeholder="Tên của bạn"
            value={name}
            onChangeText={setName}
            placeholderTextColor="white"
          />
          <TextInput
            style={tw`w-full border-2 border-orange-300 rounded-lg p-3 text-base mb-4`}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="white"
          />
          <TextInput
            style={tw`w-full border-2 border-orange-300 rounded-lg p-3 text-base mb-4`}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="white"
          />
          <TouchableOpacity
            style={tw`w-full bg-orange-400 py-4 rounded-lg mb-5 items-center`}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={tw`text-white text-lg font-bold`}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
          </TouchableOpacity>
          <Text style={tw`text-white text-center`}>
            Bạn đã có tài khoản?{' '}
            <Text style={tw`text-orange-500 font-bold`} onPress={() => navigation.navigate('Login')}>
              Đăng nhập
            </Text>
          </Text>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
