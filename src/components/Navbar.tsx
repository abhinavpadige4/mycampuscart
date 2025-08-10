
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLoginClick?: () => void;
}

export const Navbar = ({ onLoginClick }: NavbarProps) => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <HoverBorderGradient
            containerClassName="rounded-full cursor-pointer"
            className="bg-background hover:bg-background/90 transition-colors"
            onClick={() => navigate('/')}
            duration={2}
          >
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/cfdb973e-a017-45a1-b542-e765a04f6181.png" 
                alt="MyCampusCart Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold text-emerald-400">MyCampusCart</span>
            </div>
          </HoverBorderGradient>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-gray-800"
              >
                Dashboard
              </Button>
              <span className="text-sm text-gray-400 hidden sm:inline">
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
