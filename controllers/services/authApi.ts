// src/services/api/authApi.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/user/login`, {
    email,
    password,
  });
  return response.data;
};
