import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

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
      // Security checks
      if (!isAdmin) {
        const errorMsg = 'Only administrators can update user roles';
        toast({ title: "Access Denied", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      if (!user || !userId || !role) {
        const errorMsg = 'Invalid parameters provided';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      // Get current user's profile ID
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      // Prevent self-modification
      if (currentUserProfile?.id === userId) {
        const errorMsg = 'Cannot modify your own role';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      // Get target user profile
      const { data: targetProfile } = await supabase
        .from('user_profiles')
        .select('role, email')
        .eq('id', userId)
        .single();

      // Prevent modifying other admins (unless you're a super admin)
      if (targetProfile?.role === 'admin' && role !== 'admin') {
        const errorMsg = 'Cannot demote other administrators';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      // Validate role value
      const validRoles = ['user', 'admin', 'blocked'];
      if (!validRoles.includes(role)) {
        const errorMsg = 'Invalid role specified';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
        return { success: false, error };
      }

      // Log the action for security audit
      console.log(`Admin ${user.id} updated role for user ${targetProfile?.email} to ${role}`);
      
      toast({ 
        title: "Success", 
        description: `User role updated to ${role}`,
        variant: "default"
      });

      await fetchProfiles();
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
      return { success: false, error };
    }
  };

  const blockUser = async (userId: string) => {
    if (!isAdmin) {
      const errorMsg = 'Only administrators can block users';
      toast({ title: "Access Denied", description: errorMsg, variant: "destructive" });
      return { success: false, error: errorMsg };
    }
    return updateUserRole(userId, 'blocked');
  };

  const deleteUser = async (userId: string) => {
    try {
      // Security checks
      if (!isAdmin) {
        const errorMsg = 'Only administrators can delete users';
        toast({ title: "Access Denied", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      if (!user || !userId) {
        const errorMsg = 'Invalid parameters provided';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      // Get current user's profile ID
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      // Prevent self-deletion
      if (currentUserProfile?.id === userId) {
        const errorMsg = 'Cannot delete your own account';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      // Get target user profile
      const { data: targetProfile } = await supabase
        .from('user_profiles')
        .select('role, email')
        .eq('id', userId)
        .single();

      // Prevent deleting other admins
      if (targetProfile?.role === 'admin') {
        const errorMsg = 'Cannot delete administrator accounts';
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        return { success: false, error: errorMsg };
      }

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
        return { success: false, error };
      }

      // Log the action for security audit
      console.log(`Admin ${user.id} deleted user ${targetProfile?.email}`);
      
      toast({ 
        title: "Success", 
        description: "User deleted successfully",
        variant: "default"
      });

      await fetchProfiles();
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
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