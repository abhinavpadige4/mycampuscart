
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
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-green-900/20 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {userRole === 'admin' 
              ? "Manage your marketplace, monitor activity, and ensure everything runs smoothly" 
              : "Connect with your campus community. Buy, sell, and discover amazing deals."
            }
          </p>
        </div>

        {/* Actions Grid */}
        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Quick Actions</h2>
          <HoverEffect items={adminActions} />
        </div>

        {/* Stats or Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Safe Trading</h3>
            <p className="text-gray-400 text-sm">Secure transactions within your campus community</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
            <p className="text-gray-400 text-sm">Connect with students from your campus</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-center sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Management</h3>
            <p className="text-gray-400 text-sm">Simple tools to manage your listings</p>
          </div>
        </div>
      </div>
    </div>
  );
};
