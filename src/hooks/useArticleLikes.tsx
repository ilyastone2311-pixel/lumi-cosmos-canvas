import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useArticleLikes = () => {
  const { user } = useAuth();
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLikes = useCallback(async () => {
    if (!user) {
      setLikedArticles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('article_likes')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setLikedArticles(data?.map(l => l.article_id) || []);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const isLiked = useCallback((articleId: string) => {
    return likedArticles.includes(articleId);
  }, [likedArticles]);

  const toggleLike = useCallback(async (articleId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const liked = isLiked(articleId);

    try {
      if (liked) {
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        if (error) throw error;
        setLikedArticles(prev => prev.filter(id => id !== articleId));
      } else {
        const { error } = await supabase
          .from('article_likes')
          .insert({ user_id: user.id, article_id: articleId });

        if (error) throw error;
        setLikedArticles(prev => [...prev, articleId]);
      }
      return { error: null };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { error };
    }
  }, [user, isLiked]);

  const getLikedArticlesData = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('article_likes')
        .select('article_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching liked articles:', error);
      return [];
    }
  }, [user]);

  return {
    likedArticles,
    loading,
    isLiked,
    toggleLike,
    getLikedArticlesData,
    refetch: fetchLikes
  };
};
