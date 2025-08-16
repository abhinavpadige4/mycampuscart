
import { ShoppingBag, Package, BarChart3, Users } from "lucide-react";
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
      icon: <Package className="h-8 w-8 text-green-400" />,
      onClick: onSellClick,
    },
    {
      title: "Buy Items", 
      description: "Browse and purchase items from other students",
      icon: <ShoppingBag className="h-8 w-8 text-green-400" />,
      onClick: onBuyClick,
    },
    {
      title: "My Listings",
      description: "Manage your posted items and sales",
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      onClick: onMyListingsClick,
    }
  ];

  const adminActions = userRole === 'admin' ? [
    ...userActions,
    {
      title: "Admin Panel",
      description: "Manage users, block accounts, and remove items",
      icon: <Users className="h-8 w-8 text-red-400" />,
      onClick: onAdminClick,
    }
  ] : userActions;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome to your <span className="text-green-400">Dashboard</span>
        </h1>
        <p className="text-green-300">
          {userRole === 'admin' 
            ? "Manage the marketplace, block users, and monitor activity" 
            : "Start buying or selling items with your campus community"
          }
        </p>
      </div>

      <HoverEffect items={adminActions} />
    </div>
  );
};
