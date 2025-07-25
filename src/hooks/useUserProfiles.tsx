import { useState, useEffect } from 'react';

import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return { success: false, error };
      }

      await fetchProfiles();
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error };
    }
  };

  const blockUser = async (userId: string) => {
    return updateUserRole(userId, 'blocked');
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return { success: false, error };
      }

      await fetchProfiles();
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    users: profiles, // Alias for backward compatibility
    loading,
    updateUserRole,
    refetch: fetchProfiles,
    fetchUsers: fetchProfiles, // Alias for backward compatibility
    blockUser,
    deleteUser
  };
};