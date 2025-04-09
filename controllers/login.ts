// controllers/login.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

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
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.setItem('userData', JSON.stringify({ token, user }));

    Alert.alert('Thành công', 'Đăng nhập thành công!');
    
    // ✅ CHỖ NÀY PHẢI NAVIGATE RA TRANG CHỦ
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabNavigator', params: { screen: 'Trang chủ' } }],
    });

    setEmail('');
    setPassword('');
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Đăng nhập thất bại!');
    } else {
      Alert.alert('Lỗi', 'Có lỗi xảy ra!');
    }
  } finally {
    setLoading(false);
  }
};
