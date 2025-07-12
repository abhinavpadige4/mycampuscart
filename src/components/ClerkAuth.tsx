import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";

interface ClerkAuthProps {
  publishableKey?: string;
  onSetupClick: () => void;
}

export const ClerkAuth = ({ publishableKey, onSetupClick }: ClerkAuthProps) => {
  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="marketplace-card max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Setup Authentication</CardTitle>
            <CardDescription>
              We need to configure Clerk authentication to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-warning bg-warning/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Clerk publishable key required</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>To enable authentication:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Sign up at clerk.com</li>
                <li>Create a new application</li>
                <li>Copy your publishable key</li>
                <li>Provide it to continue setup</li>
              </ol>
            </div>
            <Button 
              variant="gradient" 
              className="w-full" 
              onClick={onSetupClick}
            >
              Setup Clerk Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // When Clerk is properly configured, show the auth components
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="marketplace-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <ShoppingCart className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome to CampusCart</CardTitle>
          <CardDescription>
            Sign in to start buying and selling with your campus community
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Clerk components will be integrated here once the publishable key is provided */}
          <div className="text-center text-muted-foreground">
            Clerk authentication components will appear here once configured
          </div>
        </CardContent>
      </Card>
    </div>
  );
};