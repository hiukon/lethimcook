import AsyncStorage from '@react-native-async-storage/async-storage';


export interface UserData {
  token?: string;
  user?: {
    username: string;
    userId: string;
  };
}

// Set toàn bộ thông tin user
const setUserData = async (token: string, refreshToken: string, user: { username: string, userId: string }) => {
  await AsyncStorage.setItem('user_token', token);
  await AsyncStorage.setItem('refresh_token', refreshToken);
  await AsyncStorage.setItem('user_data', JSON.stringify({
      username: user?.username,
      userId: user?.userId,
    })
  );
};

// Get toàn bộ thông tin user
const getUserData = async () => {
  const token = await AsyncStorage.getItem('user_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  const userData = await AsyncStorage.getItem('user_data');

  return {
    token,
    refreshToken,
    user: userData ? JSON.parse(userData) : { username: null, userId: null },
  };
};

// Xoá toàn bộ thông tin user
const removeUserData = async () => {
  await AsyncStorage.removeItem('user_token');
  await AsyncStorage.removeItem('refresh_token');
  await AsyncStorage.removeItem('user_data');
};

export { setUserData, getUserData, removeUserData };
