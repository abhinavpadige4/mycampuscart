
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Trash2,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  totalListings: number;
  totalSales: number;
}

export const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real Supabase data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Student",
        email: "john@university.edu",
        created_at: "2024-01-15T10:00:00Z",
        totalListings: 5,
        totalSales: 3
      },
      {
        id: "2",
        name: "Sarah Mitchell",
        email: "sarah@university.edu", 
        created_at: "2024-02-20T14:30:00Z",
        totalListings: 8,
        totalSales: 5
      },
      {
        id: "3",
        name: "Admin User",
        email: "admin@campuscart.com",
        created_at: "2024-01-01T00:00:00Z",
        totalListings: 0,
        totalSales: 0
      }
    ];

    const mockListings: Product[] = [
      {
        id: "1",
        name: "Calculus Textbook - 3rd Edition",
        price: 85,
        description: "Excellent condition",
        seller_id: "2",
        seller_name: "Sarah Mitchell",
        category: "books",
        location: "North Campus",
        whatsapp_number: "+1234567890",
        created_at: "2024-01-15T10:00:00Z",
        status: "active"
      },
      {
        id: "2",
        name: "MacBook Air M1 2020",
        price: 650,
        description: "Great condition laptop",
        seller_id: "1",
        seller_name: "John Student",
        category: "electronics",
        location: "South Campus", 
        whatsapp_number: "+1234567891",
        created_at: "2024-01-14T15:30:00Z",
        status: "sold"
      }
    ];

    setUsers(mockUsers);
    setListings(mockListings);
  }, []);

  const handleDeleteListing = (listingId: string, title: string) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    toast({
      title: "Listing Deleted",
      description: `"${title}" has been removed from the marketplace.`,
    });
  };

  const totalUsers = users.length;
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === "active").length;
  const totalSales = listings.filter(l => l.status === "sold").length;
  const totalRevenue = listings.filter(l => l.status === "sold").reduce((sum, listing) => sum + listing.price, 0);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">
              Admin <span className="hero-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage users, listings, and monitor marketplace activity
            </p>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="marketplace-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                    <p className="text-sm text-success">All registered</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="marketplace-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Listings</p>
                    <p className="text-2xl font-bold">{totalListings}</p>
                    <p className="text-sm text-success">+{activeListings} active</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="marketplace-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Sales</p>
                    <p className="text-2xl font-bold">{totalSales}</p>
                    <p className="text-sm text-success">Completed</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="marketplace-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Revenue</p>
                    <p className="text-2xl font-bold price-text">${totalRevenue}</p>
                    <p className="text-sm text-success">Total volume</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full lg:w-96 grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="marketplace-card">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts and view activity</CardDescription>
                    </div>
                    <div className="relative lg:w-96">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {user.email === "admin@campuscart.com" && (
                              <Badge className="bg-destructive/20 text-destructive">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                            <span>Listings: {user.totalListings}</span>
                            <span>Sales: {user.totalSales}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <Card className="marketplace-card">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Listing Management</CardTitle>
                      <CardDescription>Monitor and manage all marketplace listings</CardDescription>
                    </div>
                    <div className="relative lg:w-96">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{listing.name}</h3>
                            <Badge 
                              className={
                                listing.status === "active" ? "bg-success/20 text-success" :
                                "bg-primary/20 text-primary"
                              }
                            >
                              {listing.status}
                            </Badge>
                            <span className="text-sm price-text font-semibold">${listing.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">by {listing.seller_name}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Location: {listing.location}</span>
                            <span>Category: {listing.category}</span>
                            <span>Posted: {new Date(listing.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{listing.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteListing(listing.id, listing.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="marketplace-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Marketplace Analytics
                  </CardTitle>
                  <CardDescription>Detailed insights and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">User Growth</h4>
                      <div className="text-2xl font-bold text-primary">+12.5%</div>
                      <p className="text-sm text-muted-foreground">vs last month</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Listing Activity</h4>
                      <div className="text-2xl font-bold text-primary">+18.3%</div>
                      <p className="text-sm text-muted-foreground">vs last month</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Sales Conversion</h4>
                      <div className="text-2xl font-bold text-primary">34.2%</div>
                      <p className="text-sm text-muted-foreground">avg conversion rate</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Popular Category</h4>
                      <div className="text-lg font-bold">Electronics</div>
                      <p className="text-sm text-muted-foreground">42% of all listings</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Avg. Item Price</h4>
                      <div className="text-2xl font-bold price-text">$127</div>
                      <p className="text-sm text-muted-foreground">across all categories</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Popular Location</h4>
                      <div className="text-lg font-bold">North Campus</div>
                      <p className="text-sm text-muted-foreground">Most active area</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};
