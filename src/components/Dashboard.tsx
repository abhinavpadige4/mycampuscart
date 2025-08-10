import { ShoppingBag, Package, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useUserStats } from '@/hooks/useStats';

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
  const { stats, loading } = useUserStats();
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

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-4">
                <div className="animate-pulse bg-gray-700 h-8 rounded mb-2"></div>
                <div className="animate-pulse bg-gray-700 h-4 rounded mb-1"></div>
                <div className="animate-pulse bg-gray-700 h-3 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          [
            { 
              label: "Items Listed", 
              value: stats.itemsListed.toString(), 
              change: stats.itemsListed > 0 ? "Active listings" : "Start selling!" 
            },
            { 
              label: "Items Sold", 
              value: stats.itemsSold.toString(), 
              change: stats.itemsSold > 0 ? "Great work!" : "No sales yet" 
            },
            { 
              label: "Total Earnings", 
              value: `₹${stats.totalEarnings.toLocaleString()}`, 
              change: stats.totalEarnings > 0 ? "Keep it up!" : "Start earning!" 
            },
            { 
              label: "Total Likes", 
              value: stats.activeChats.toString(), 
              change: stats.activeChats > 0 ? "Popular items" : "Get noticed" 
            }
          ].map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1 text-white">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.change}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};