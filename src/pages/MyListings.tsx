import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Eye, MessageCircle, Plus } from "lucide-react";
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
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types/product";

export const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteProduct, updateProduct, fetchUserProducts } = useProducts();
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user?.id) return;
      
      try {
        const userProducts = await fetchUserProducts(user.id);
        setListings(userProducts as Product[]);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [user?.id]);

  const handleDelete = async (listingId: string, title: string) => {
    try {
      await deleteProduct(listingId);
      setListings(listings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  const handleEdit = (listingId: string) => {
    // Navigate to edit form - implement later
    console.log('Edit listing:', listingId);
  };

  const handleToggleStatus = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const newStatus = listing.status === "active" ? "sold" : "active";
    
    try {
      await updateProduct(listingId, { status: newStatus });
      setListings(listings.map(l => 
        l.id === listingId ? { ...l, status: newStatus } : l
      ));
    } catch (error) {
      console.error('Failed to update listing status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/20 text-success";
      case "sold": return "bg-primary/20 text-primary";
      case "paused": return "bg-warning/20 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const activeListings = listings.filter(l => l.status === "active");
  const soldListings = listings.filter(l => l.status === "sold");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  My <span className="hero-text">Listings</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage your posted items and track performance
                </p>
              </div>
              <Button 
                variant="gradient" 
                onClick={() => navigate('/sell')}
                className="sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="marketplace-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{listings.length}</div>
                <div className="text-sm text-muted-foreground">Total Listings</div>
              </CardContent>
            </Card>
            <Card className="marketplace-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{activeListings.length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card className="marketplace-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{soldListings.length}</div>
                <div className="text-sm text-muted-foreground">Sold</div>
              </CardContent>
            </Card>
            <Card className="marketplace-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold price-text">
                  ${soldListings.reduce((sum, listing) => sum + listing.price, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Listings */}
          {listings.length === 0 ? (
            <Card className="marketplace-card">
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start selling by creating your first listing
                </p>
                <Button variant="gradient" onClick={() => navigate('/sell')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Listings */}
              {activeListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Active Listings ({activeListings.length})</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeListings.map((listing) => (
                      <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sold Listings */}
              {soldListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sold Items ({soldListings.length})</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {soldListings.map((listing) => (
                      <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

interface ListingCardProps {
  listing: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onToggleStatus: (id: string) => void;
  getStatusColor: (status: string) => string;
}

const ListingCard = ({ 
  listing, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  getStatusColor
}: ListingCardProps) => {
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
    <Card className="marketplace-card">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={listing.image || "/placeholder.svg"} 
            alt={listing.name}
            className="w-full h-32 object-cover rounded-lg bg-muted"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardTitle className="text-lg mb-2 line-clamp-2">{listing.name}</CardTitle>
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {listing.description}
        </CardDescription>
        
        <div className="space-y-2 mb-4">
          <div className="text-2xl font-bold price-text">${listing.price}</div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              0 views
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              0 messages
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Posted {getTimeAgo(listing.created_at)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(listing.id)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          
          {listing.status !== "sold" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onToggleStatus(listing.id)}
              className="flex-1"
            >
              Mark as Sold
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-3 w-3" />
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
                  onClick={() => onDelete(listing.id, listing.name)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
