import { useState } from 'react';
import { toggleReaction } from '@/controllers/services/reactionApi';
import { getUserData } from '@/models/authHelper';

export function useReactionController(recipe: any) {
  const [reactions, setReactions] = useState(recipe.reactions || []);

  const handleReaction = async (reactionType: string) => {
    const { user } = await getUserData();
    if (!user?.userId) return;
    try {
      const updated = await toggleReaction(recipe._id, user.userId, reactionType);
      setReactions(updated.data); // API trả về mảng reactions mới
    } catch (e) {
      alert('Lỗi khi thả biểu cảm');
    }
  };

  const getReactionCount = (type: string) => {
    const reaction = reactions.find((r: any) => r.type === type);
    return reaction ? reaction.user_ids.length : 0;
  };

  const isReacted = (type: string, userId: string) => {
    const reaction = reactions.find((r: any) => r.type === type);
    return reaction ? reaction.user_ids.includes(userId) : false;
  };

  return { reactions, handleReaction, getReactionCount, isReacted };
}