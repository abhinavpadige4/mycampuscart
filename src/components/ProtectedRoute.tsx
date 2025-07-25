import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, Loader2 } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { loading, isAuthenticated, isAdmin, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="marketplace-card max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignInButton fallbackRedirectUrl="/dashboard">
              <Button>Sign In</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="marketplace-card max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle className="text-2xl">Account Suspended</CardTitle>
            <CardDescription>
              Your account has been suspended. Please contact support for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="marketplace-card max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Admin access required.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};