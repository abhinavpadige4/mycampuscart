
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2, MapPin, DollarSign } from "lucide-react";
import { Product } from "@/types/product";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

export const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteProduct, updateProduct, fetchUserProducts } = useProducts();
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserListings = async () => {
    if (!user?.id) return;
    
    try {
      // Use clerk user ID for fetching products
      const userProducts = await fetchUserProducts(user.id);
      setListings(userProducts);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setListings(listings.filter(listing => listing.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'sold' : 'active';
    try {
      await updateProduct(id, { status: newStatus });
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ));
    } catch (error) {
      console.error('Error updating listing status:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <ProtectedRoute>
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
              My <span className="hero-text">Listings</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your items for sale
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : listings.length === 0 ? (
            <Card className="marketplace-card text-center py-12">
              <CardHeader>
                <CardTitle>No listings yet</CardTitle>
                <CardDescription>
                  You haven't listed any items for sale yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/sell')} variant="gradient">
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="marketplace-card">
                  <CardHeader className="p-4">
                    <div className="relative">
                      <img 
                        src={listing.image || "/placeholder.svg"} 
                        alt={listing.name}
                        className="w-full h-48 object-cover rounded-lg bg-muted"
                      />
                      <Badge 
                        className={`absolute top-2 left-2 ${
                          listing.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{listing.name}</CardTitle>
                    <CardDescription className="text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold price-text">
                          ₹{listing.price}
                        </span>
                        <Badge variant="outline">{listing.category}</Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Listed {getTimeAgo(listing.created_at)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(listing.id, listing.status)}
                        className="flex-1"
                      >
                        Mark as {listing.status === 'active' ? 'Sold' : 'Active'}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this listing? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};
