import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useArticleViews = () => {
  const { user } = useAuth();

  const trackView = useCallback(async (articleId: string, category: string) => {
    if (!user) return;

    try {
      await supabase
        .from('article_views')
        .insert({ 
          user_id: user.id, 
          article_id: articleId,
          category 
        });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [user]);

  const getTopCategories = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('article_views')
        .select('category')
        .eq('user_id', user.id);

      if (error) throw error;

      // Count category occurrences
      const counts: Record<string, number> = {};
      data?.forEach(v => {
        counts[v.category] = (counts[v.category] || 0) + 1;
      });

      // Sort by count
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([category]) => category);
    } catch (error) {
      console.error('Error getting top categories:', error);
      return [];
    }
  }, [user]);

  return {
    trackView,
    getTopCategories
  };
};
