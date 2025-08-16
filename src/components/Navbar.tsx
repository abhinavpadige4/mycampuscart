
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLoginClick?: () => void;
}

export const Navbar = ({ onLoginClick }: NavbarProps) => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-black border-b border-green-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Simplified Design */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center p-1 overflow-hidden">
              <img 
                src="/lovable-uploads/cfdb973e-a017-45a1-b542-e765a04f6181.png" 
                alt="MyCampusCart Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-green-400">MyCampusCart</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium border border-green-500/30 shadow-lg hover:shadow-green-500/20 transition-all">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-green-400 hover:bg-green-900/30 border border-green-500/20 hover:border-green-400/40"
              >
                Dashboard
              </Button>
              <span className="text-sm text-green-300 hidden sm:inline">
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
