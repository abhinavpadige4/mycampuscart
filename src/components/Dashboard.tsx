import { ShoppingBag, Package, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/card-hover-effect";

interface DashboardProps {
  userRole?: 'user' | 'admin';
  onSellClick: () => void;
  onBuyClick: () => void;
  onMyListingsClick: () => void;
  onAdminClick?: () => void;
}

export const Dashboard = ({ 
  userRole = 'user', 
  onSellClick, 
  onBuyClick, 
  onMyListingsClick,
  onAdminClick 
}: DashboardProps) => {
  const userActions = [
    {
      title: "Sell Items",
      description: "List your items for sale to other students",
      icon: <Package className="h-8 w-8 text-emerald-400" />,
      onClick: onSellClick,
    },
    {
      title: "Buy Items", 
      description: "Browse and purchase items from other students",
      icon: <ShoppingBag className="h-8 w-8 text-emerald-400" />,
      onClick: onBuyClick,
    },
    {
      title: "My Listings",
      description: "Manage your posted items and sales",
      icon: <BarChart3 className="h-8 w-8 text-emerald-400" />,
      onClick: onMyListingsClick,
    }
  ];

  const adminActions = userRole === 'admin' ? [
    ...userActions,
    {
      title: "Admin Panel",
      description: "Manage users, delete accounts, and block users",
      icon: <Users className="h-8 w-8 text-red-400" />,
      onClick: onAdminClick,
    }
  ] : userActions;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome to your <span className="text-emerald-400">Dashboard</span>
        </h1>
        <p className="text-gray-400">
          {userRole === 'admin' 
            ? "Manage the marketplace and monitor activity" 
            : "Start buying or selling items with your campus community"
          }
        </p>
      </div>

      <HoverEffect items={adminActions} />
    </div>
  );
};