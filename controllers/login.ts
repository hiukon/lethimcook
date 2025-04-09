// src/controllers/login.ts
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { setUserData } from '@/models/authHelper';
import { loginUser } from './services/authApi';

export const handleLogin = async (
  email: string,
  password: string,
  navigation: NavigationProp<any>,
  setLoading: (loading: boolean) => void,
  setEmail: (email: string) => void,
  setPassword: (password: string) => void
) => {
  if (!email || !password) {
    Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu!');
    return;
  }

  setLoading(true);
  try {
    const { token, refreshToken, user } = await loginUser(email, password);

    setUserData(token, refreshToken, user);

    Alert.alert('Thành công', 'Đăng nhập thành công!');

    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator', params: { screen: 'Trang chủ' } }],
    });

    setEmail('');
    setPassword('');
  } catch (error: any) {
    if (error?.response?.data?.message) {
      Alert.alert('Lỗi', error.response.data.message);
    } else {
      Alert.alert('Lỗi', 'Đăng nhập thất bại!');
    }
  } finally {
    setLoading(false);
  }
};
