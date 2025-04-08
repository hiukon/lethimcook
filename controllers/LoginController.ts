import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    username: string;
    userId: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  if (!email || !password) {
    return { success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });

    const { token, user } = response.data;

    await AsyncStorage.setItem('user_token', token);
    await AsyncStorage.setItem(
      'user_data',
      JSON.stringify({
        username: user?.username,
        userId: user?.userId,
      })
    );

    return {
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        username: user?.username,
        userId: user?.userId,
      },
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại!';
      return { success: false, message };
    } else {
      return { success: false, message: 'Đã có lỗi xảy ra!' };
    }
  }
};
