
import { useUser } from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  
  const isAuthenticated = isLoaded && !!user;
  const isAdmin = user?.emailAddresses[0]?.emailAddress === "admin@campuscart.com" || 
                  user?.publicMetadata?.role === "admin";
  
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                   user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

  return {
    user,
    isLoaded,
    isAuthenticated,
    isAdmin,
    userName
  };
};
