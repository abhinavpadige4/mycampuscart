
import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useUserProfiles } from "./useUserProfiles";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { createOrUpdateUserProfile } = useUserProfiles();
  
  const isAuthenticated = isLoaded && !!user;
  const isAdmin = user?.emailAddresses[0]?.emailAddress === "admin@campuscart.com" || 
                  user?.publicMetadata?.role === "admin";
  
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                   user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

  // Auto-create user profile when user is loaded
  useEffect(() => {
    if (user && isLoaded) {
      createOrUpdateUserProfile();
    }
  }, [user, isLoaded, createOrUpdateUserProfile]);

  const handleSignOut = async () => {
    await signOut();
  };

  return {
    user,
    isLoaded,
    isAuthenticated,
    isAdmin,
    userName,
    signOut: handleSignOut
  };
};
