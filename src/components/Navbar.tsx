
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  onLoginClick?: () => void;
}

export const Navbar = ({ onLoginClick }: NavbarProps) => {
  const { userName } = useAuth();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold hero-text">CampusCart</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {userName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
