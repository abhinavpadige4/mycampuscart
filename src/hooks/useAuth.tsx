import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { getUserRoleSecurely } from "@/lib/auth-bridge";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'blocked'>('user');
  const [roleLoading, setRoleLoading] = useState(true);
  
  const isAuthenticated = isLoaded && !!user;
  
  // Fetch user role from database instead of hardcoded logic
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      try {
        const result = await getUserRoleSecurely(user.id);
        setUserRole(result.role as 'user' | 'admin' | 'blocked');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setRoleLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user, isAuthenticated]);

  const isAdmin = userRole === 'admin';
  const isBlocked = userRole === 'blocked';
  
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                   user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
  };

  return {
    user,
    isLoaded,
    isAuthenticated,
    isAdmin,
    isBlocked,
    userRole,
    roleLoading,
    userName,
    signOut: handleSignOut
  };
};