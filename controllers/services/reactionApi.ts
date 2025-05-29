import { secureRequest } from '@/models/authorizedRequest';
import { API_BASE_URL } from '@/config';

export const toggleReaction = async (recipeId: string, userId: string, reactionType: string) => {
  return secureRequest({
    method: 'post',
    url: `${API_BASE_URL}/recipes/reaction`,
    data: { recipeId, userId, reactionType }
  });
};