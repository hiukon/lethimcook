import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import {setUserData} from '@/models/authHelper';
type RootStackParamList = {
  SignUp: undefined;
  HomeScreen: undefined;
  BottomTabNavigator: { screen: string; params: { screen: string } };
};

export const handleLogin = async (
  email: string,
  password: string,
  navigation: NavigationProp<RootStackParamList>,
  setLoading: (loading: boolean) => void,
  setEmail: (email: string) => void,
  setPassword: (password: string) => void
) => {
  if (!email || !password) {
    Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
    return;
  }
  setLoading(true);
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    Alert.alert('Thành công', 'Đăng nhập thành công!');
    setEmail('');
    setPassword('');
    const { token, refreshToken, user } = response.data;
    // Luu thong tin user vao trong asyncstorage 
    setUserData(token, refreshToken, user);
   
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
  } finally {
    setLoading(false);
  }
};
