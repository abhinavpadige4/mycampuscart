import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      if (!isLoaded) return;
      
      if (user) {
        try {
          // Call our edge function to get/create user role
          const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
            body: {
              clerkUserId: user.id,
              action: 'getUserRole',
              data: {
                email: user.emailAddresses[0]?.emailAddress,
                first_name: user.firstName,
                last_name: user.lastName
              }
            }
          });

          if (error) {
            console.error('Error getting user role:', error);
          } else {
            setUserRole(data?.role || 'user');
          }
        } catch (error) {
          console.error('Error in getUserRole:', error);
        }
      }
      setLoading(false);
    };

    getUserRole();
  }, [user, isLoaded]);

  const userName = user ? 
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 
     user.firstName || 
     user.emailAddresses[0]?.emailAddress?.split('@')[0] || 
     'User') : null;

  return {
    user,
    isLoaded,
    loading: !isLoaded || loading,
    isAuthenticated: isSignedIn,
    isAdmin: userRole === 'admin',
    userName,
    userRole,
    profile: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      first_name: user.firstName,
      last_name: user.lastName,
      role: userRole
    } as Profile : null
  };
};