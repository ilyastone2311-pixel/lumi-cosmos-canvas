import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  username: string | null;
  avatar_url: string | null;
  roles: string[];
}

interface UserStats {
  favorites_count: number;
  categories_read: number;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data && !error);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    if (!isAdmin) return;
    
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_for_admin');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const getUserStats = async (userId: string): Promise<UserStats | null> => {
    try {
      const { data, error } = await supabase.rpc('get_user_stats_for_admin', {
        _user_id: userId
      });
      
      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) throw error;
      
      await fetchAllUsers();
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const removeRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
      
      await fetchAllUsers();
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    isAdmin,
    loading,
    users,
    usersLoading,
    fetchAllUsers,
    getUserStats,
    assignRole,
    removeRole,
  };
};
