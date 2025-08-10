
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
  const { products, deleteProduct, updateProduct, fetchUserProducts } = useProducts();
  const [loading, setLoading] = useState(true);

  const loadUserListings = async () => {
    if (!user?.id) return;
    
    try {
      // Use the updated hook method that doesn't take parameters
      await fetchUserProducts();
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
      // Products will be refreshed automatically by the hook
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'sold' : 'active';
    try {
      console.log('Updating product status:', { id, currentStatus, newStatus });
      const result = await updateProduct(id, { status: newStatus });
      console.log('Update result:', result);
      // Manually refresh the listings to see changes immediately
      await loadUserListings();
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
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2 text-white">
              My <span className="text-emerald-400">Listings</span>
            </h1>
            <p className="text-gray-400">
              Manage your items for sale
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800 text-center py-12">
              <CardHeader>
                <CardTitle className="text-white">No listings yet</CardTitle>
                <CardDescription className="text-gray-400">
                  You haven't listed any items for sale yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/sell')} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((listing) => (
                <Card key={listing.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="p-4">
                    <div className="relative">
                      <img 
                        src={listing.images?.[0] || "/placeholder.svg"} 
                        alt={listing.title}
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
                    <CardTitle className="text-lg mb-2 line-clamp-2 text-white">{listing.title}</CardTitle>
                    <CardDescription className="text-sm mb-3 line-clamp-2 text-gray-400">
                      {listing.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-400">
                          ₹{listing.price}
                        </span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">{listing.category}</Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Listed {getTimeAgo(listing.created_at)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(listing.id, listing.status)}
                        className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                      >
                        Mark as {listing.status === 'active' ? 'Sold' : 'Active'}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
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
