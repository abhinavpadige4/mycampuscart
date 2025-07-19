import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export const useUserProfiles = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedUsers: UserProfile[] = (data || []).map(item => ({
        ...item,
        role: item.role as 'user' | 'admin'
      }));
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateUserProfile = async (): Promise<UserProfile | undefined> => {
    if (!user) return;

    try {
      const profileData = {
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        role: (user.emailAddresses[0]?.emailAddress === 'admin@campuscart.com' || 
               user.emailAddresses[0]?.emailAddress === 'abhinavpadige06@gmail.com' ||
               user.publicMetadata?.role === 'admin') ? 'admin' as const : 'user' as const
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { 
          onConflict: 'clerk_user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        role: data.role as 'user' | 'admin'
      } as UserProfile;
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
    }
  };

  useEffect(() => {
    if (user && isLoaded) {
      createOrUpdateUserProfile();
    }
  }, [user, isLoaded]);

  return {
    users,
    loading,
    fetchUsers,
    createOrUpdateUserProfile
  };
};