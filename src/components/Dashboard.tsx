import { ShoppingBag, Package, BarChart3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      icon: Package,
      action: onSellClick,
      variant: "gradient" as const
    },
    {
      title: "Buy Items", 
      description: "Browse and purchase items from other students",
      icon: ShoppingBag,
      action: onBuyClick,
      variant: "marketplace" as const
    },
    {
      title: "My Listings",
      description: "Manage your posted items and sales",
      icon: BarChart3,
      action: onMyListingsClick,
      variant: "outline" as const
    }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userActions.map((action, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 group hover:scale-105 transition-all cursor-pointer" onClick={action.action}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                <action.icon className="h-8 w-8 text-emerald-400" />
              </div>
              <CardTitle className="text-xl text-white">{action.title}</CardTitle>
              <CardDescription className="text-gray-400">{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
              >
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Admin Panel Access */}
        {userRole === 'admin' && (
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 group hover:scale-105 transition-all cursor-pointer" onClick={onAdminClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                <Users className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-white">Admin Panel</CardTitle>
              <CardDescription className="text-gray-400">Manage users, listings, and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdminClick?.();
                }}
              >
                Admin Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Items Listed", value: "12", change: "+2 this week" },
          { label: "Items Sold", value: "8", change: "+1 this week" },
          { label: "Total Earnings", value: "$245", change: "+$45 this week" },
          { label: "Active Chats", value: "3", change: "2 new messages" }
        ].map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.value}</div>
              <div className="text-sm font-medium mb-1 text-white">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};