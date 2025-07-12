import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [isAuthenticated] = useState(true); // Will be replaced with Clerk
  const [userRole] = useState<'user' | 'admin'>('user'); // Will be managed by Clerk
  const { toast } = useToast();

  const handleSellClick = () => {
    toast({
      title: "Sell Feature",
      description: "Redirecting to sell page...",
    });
    // Navigate to sell page
  };

  const handleBuyClick = () => {
    toast({
      title: "Buy Feature", 
      description: "Redirecting to marketplace...",
    });
    // Navigate to marketplace
  };

  const handleMyListingsClick = () => {
    toast({
      title: "My Listings",
      description: "Redirecting to your listings...",
    });
    // Navigate to my listings
  };

  const handleAdminClick = () => {
    toast({
      title: "Admin Panel",
      description: "Redirecting to admin dashboard...",
    });
    // Navigate to admin panel
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Handle logout with Clerk
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={isAuthenticated}
        onLogoutClick={handleLogout}
        userName="John Student"
      />
      <DashboardComponent
        userRole={userRole}
        onSellClick={handleSellClick}
        onBuyClick={handleBuyClick}
        onMyListingsClick={handleMyListingsClick}
        onAdminClick={handleAdminClick}
      />
    </div>
  );
};