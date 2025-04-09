import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '@/models/authHelper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    BottomTabNavigator: { screen: string };
    login: undefined;
  };
  
type NavigationProps = NavigationProp<RootStackParamList>;

export const secureRequest = async (axiosConfig: any) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, refreshToken } = await getUserData();
  
  try {
    const response = await axios({
      ...axiosConfig,
      headers: {
        ...(axiosConfig.headers || {}),
        Authorization: `Bearer ${token}`,
        'x-refresh-token': refreshToken,
      },
    });

    // Nếu server trả về access token mới => cập nhật
    const newToken = response.headers['x-access-token'];
    if (newToken) {
      await AsyncStorage.setItem('user_token', newToken);
    }

    // Nếu có refresh token mới => cũng cập nhật
    const newRefreshToken = response.headers['x-refresh-token'];
    if (newRefreshToken) {
      await AsyncStorage.setItem('refresh_token', newRefreshToken);
    }

    return response;
  } catch (error: any) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // 👉 Điều hướng về màn hình login nếu token/refresh token không hợp lệ
      // navigation.navigate('BottomTabNavigator', { screen: 'login' }); // hoặc NavigationService.navigate nếu bạn dùng custom điều hướng
    //  throw new Error('Phiên đăng nhập đã hết, vui lòng đăng nhập lại');
    }

    throw error;
  }
};
