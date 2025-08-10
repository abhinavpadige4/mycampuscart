import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Component to ensure user profile is synced between Clerk and Supabase
 * This runs automatically when the user is authenticated
 */
export const UserProfileSync = () => {
  const { user, isAuthenticated, isLoaded } = useAuth();
  const { toast } = useToast();
  const [syncAttempted, setSyncAttempted] = useState(false);

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!isLoaded || !isAuthenticated || !user || syncAttempted) return;
      
      setSyncAttempted(true);

      try {
        console.log('Syncing user profile for:', user.id);
        
        // Check if profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking profile:', checkError);
          return;
        }

        // If no profile exists, create one via edge function
        if (!existingProfile) {
          console.log('Creating user profile for:', user.id);
          
          const { error: edgeError } = await supabase.functions.invoke('clerk-auth-bridge', {
            body: {
              clerkUserId: user.id,
              action: 'getUserRole',
              data: {
                email: user.emailAddresses[0]?.emailAddress || `${user.id}@clerk.dev`,
                first_name: user.firstName,
                last_name: user.lastName
              }
            }
          });

          if (edgeError) {
            console.error('Error creating profile via edge function:', edgeError);
            toast({
              title: "Profile Setup",
              description: "There was an issue setting up your profile. Please refresh the page.",
              variant: "destructive"
            });
          } else {
            console.log('User profile created successfully');
          }
        } else {
          console.log('User profile already exists:', existingProfile.id);
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
        toast({
          title: "Sync Error", 
          description: "Failed to sync your profile. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    // Run sync when user is loaded and authenticated
    syncUserProfile();
  }, [isLoaded, isAuthenticated, user, syncAttempted, toast]);

  return null; // This component doesn't render anything
};