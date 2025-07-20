
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const ClerkAuth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignedOut>
        <Card className="marketplace-card max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome to MyCampusCart</CardTitle>
            <CardDescription>
              Sign in to start buying and selling with your campus community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignInButton fallbackRedirectUrl="/dashboard">
              <Button variant="gradient" className="w-full">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton fallbackRedirectUrl="/dashboard">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground">You are signed in!</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
};
