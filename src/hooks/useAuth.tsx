import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [userRole, setUserRole] = useState<string>('user');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      if (!user || !clerkLoaded) {
        setIsLoaded(clerkLoaded);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
          body: {
            clerkUserId: user.id,
            action: 'getUserRole',
            data: {
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName
            }
          }
        });

        if (error) {
          console.error('Error getting user role:', error);
        } else {
          setUserRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error getting user role:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    getUserRole();
  }, [user, clerkLoaded]);

  const userName = user ? 
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 
     user.firstName || 
     user.emailAddresses[0]?.emailAddress?.split('@')[0] || 
     'User') : null;

  return {
    user,
    isLoaded,
    loading: !isLoaded,
    isAuthenticated: !!user,
    isAdmin: userRole === 'admin',
    userName,
    userRole
  };
};