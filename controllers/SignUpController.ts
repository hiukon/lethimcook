import axios from 'axios';
import { API_BASE_URL } from '../config';

export const handleUserSignUp = async (
  username: string,
  email: string,
  password: string,
  onSuccess: () => void,
  onError: (message: string) => void,
  setLoading: (loading: boolean) => void
) => {
  if (!username || !email || !password) {
    onError('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  setLoading(true);
  try {
    // Gọi API trực tiếp tại đây (service gộp vào luôn)
    await axios.post(`${API_BASE_URL}/user/register`, {
      username,
      email,
      password,
    });
    onSuccess();
  } catch (error: any) {
    const message = error.response?.data?.message || 'Có lỗi xảy ra!';
    onError(message);
  } finally {
    setLoading(false);
  }
};
