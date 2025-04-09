import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const handleRegister = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/user/register`, {
    username: name,
    email,
    password,
  });
  return response.data;
};
