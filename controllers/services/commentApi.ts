import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { secureRequest } from '@/models/authorizedRequest';

export const fetchComments = async (recipeId: string) => {
  const res = await axios.get(`${API_BASE_URL}/comments/${recipeId}`);
  return res.data;
};

export const addComment = async (recipeId: string, content: string) => {
  return secureRequest({
    method: 'post',
    url: `${API_BASE_URL}/comments`,
    data: { recipeId, content }
  });
};
