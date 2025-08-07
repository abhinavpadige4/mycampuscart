import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Component to ensure user profile is synced between Clerk and Supabase
 * This runs automatically when the user is authenticated
 */
export const UserProfileSync = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        // If no profile exists, create one via edge function
        if (!existingProfile) {
          console.log('Creating user profile for:', user.id);
          await supabase.functions.invoke('clerk-auth-bridge', {
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
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
      }
    };

    // Run sync with a small delay to ensure Clerk is fully loaded
    const timeout = setTimeout(syncUserProfile, 1000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, user]);

  return null; // This component doesn't render anything
};