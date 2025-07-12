import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  userName?: string;
}

export const Navbar = ({ isAuthenticated, onLoginClick, onLogoutClick, userName }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <ShoppingCart className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold hero-text">CampusCart</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-muted-foreground">Welcome, {userName || 'Student'}</span>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" onClick={onLogoutClick}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="gradient" size="sm" onClick={onLoginClick}>
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="text-muted-foreground px-3 py-2">
                    Welcome, {userName || 'Student'}
                  </div>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="outline" className="w-full" onClick={onLogoutClick}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="gradient" className="w-full" onClick={onLoginClick}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};