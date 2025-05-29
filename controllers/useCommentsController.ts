import { useEffect, useState } from 'react';
import { fetchComments, addComment } from '@/controllers/services/commentApi';
import { getUserData } from '@/models/authHelper';
import { useNavigation } from '@react-navigation/native';

export function useCommentsController(recipeId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments(recipeId).then(setComments);
    getUserData().then(data => {
      setIsLoggedIn(!!data?.token);
      setCurrentUserId(data?.user?.userId || null);
    });
  }, [recipeId]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await addComment(recipeId, commentText);
      setComments([res.data, ...comments]);
      setCommentText('');
    } catch (e) {
      alert('Lỗi khi gửi bình luận');
    }
  };

  return {
    comments,
    commentText,
    setCommentText,
    isLoggedIn,
    currentUserId,
    handleAddComment,
  };
}