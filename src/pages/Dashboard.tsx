import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { AdminToggle } from "@/components/AdminToggle";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [isAuthenticated] = useState(true); // Will be replaced with Clerk
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user'); // Will be managed by Clerk
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSellClick = () => {
    navigate('/sell');
  };

  const handleBuyClick = () => {
    navigate('/marketplace');
  };

  const handleMyListingsClick = () => {
    navigate('/my-listings');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Handle logout with Clerk
  };

  const handleToggleRole = () => {
    setUserRole(userRole === 'admin' ? 'user' : 'admin');
    toast({
      title: "Role Changed", 
      description: `Switched to ${userRole === 'admin' ? 'Student' : 'Admin'} mode`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAuthenticated={isAuthenticated}
        onLogoutClick={handleLogout}
        userName="John Student"
      />
      <div className="max-w-6xl mx-auto p-6">
        <AdminToggle userRole={userRole} onToggleRole={handleToggleRole} />
        <DashboardComponent
          userRole={userRole}
          onSellClick={handleSellClick}
          onBuyClick={handleBuyClick}
          onMyListingsClick={handleMyListingsClick}
          onAdminClick={handleAdminClick}
        />
      </div>
    </div>
  );
};