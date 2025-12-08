import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useArticleReads = () => {
  const { user } = useAuth();
  const [readArticles, setReadArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReads = useCallback(async () => {
    if (!user) {
      setReadArticles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('article_reads')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setReadArticles(data?.map(r => r.article_id) || []);
    } catch (error) {
      console.error('Error fetching reads:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReads();
  }, [fetchReads]);

  const isRead = useCallback((articleId: string) => {
    return readArticles.includes(articleId);
  }, [readArticles]);

  const markAsRead = useCallback(async (articleId: string) => {
    if (!user || isRead(articleId)) return { error: null };

    try {
      const { error } = await supabase
        .from('article_reads')
        .insert({ user_id: user.id, article_id: articleId });

      if (error && !error.message.includes('duplicate')) throw error;
      setReadArticles(prev => [...prev, articleId]);
      return { error: null };
    } catch (error) {
      console.error('Error marking as read:', error);
      return { error };
    }
  }, [user, isRead]);

  const getReadArticlesData = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('article_reads')
        .select('article_id, read_at')
        .eq('user_id', user.id)
        .order('read_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching read articles:', error);
      return [];
    }
  }, [user]);

  return {
    readArticles,
    loading,
    isRead,
    markAsRead,
    getReadArticlesData,
    refetch: fetchReads
  };
};
