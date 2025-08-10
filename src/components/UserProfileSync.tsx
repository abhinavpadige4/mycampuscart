import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const UserProfileSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!user || !isLoaded) return;

      try {
        console.log('Syncing user profile for:', user.id);
        
        const userData = {
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName
        };

        const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
          body: {
            clerkUserId: user.id,
            action: 'createProfile',
            data: userData
          }
        });

        if (error) {
          console.error('Error syncing profile:', error);
        } else {
          console.log('Profile synced successfully:', data);
        }
      } catch (error) {
        console.error('Error in profile sync:', error);
      }
    };

    syncUserProfile();
  }, [user, isLoaded]);

  return null;
};