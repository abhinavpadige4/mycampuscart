import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Eye, MessageCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  image: string;
  status: "active" | "sold" | "paused";
  views: number;
  messages: number;
  posted: string;
}

export const MyListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);

  // Mock data - replace with real Supabase data
  useEffect(() => {
    const mockListings: Listing[] = [
      {
        id: "1",
        title: "Physics Textbook - 4th Edition",
        price: 75,
        description: "Comprehensive physics textbook in excellent condition.",
        category: "books",
        condition: "like-new",
        image: "/placeholder.svg",
        status: "active",
        views: 24,
        messages: 3,
        posted: "3 days ago"
      },
      {
        id: "2",
        title: "Wireless Headphones",
        price: 45,
        description: "Sony WH-CH720N headphones with noise canceling.",
        category: "electronics",
        condition: "good",
        image: "/placeholder.svg",
        status: "sold",
        views: 18,
        messages: 5,
        posted: "1 week ago"
      },
      {
        id: "3",
        title: "Study Desk",
        price: 120,
        description: "IKEA study desk with drawers, perfect for dorm room.",
        category: "furniture",
        condition: "good",
        image: "/placeholder.svg",
        status: "paused",
        views: 12,
        messages: 1,
        posted: "2 weeks ago"
      }
    ];
    setListings(mockListings);
  }, []);

  const handleDelete = (listingId: string, title: string) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    toast({
      title: "Listing Deleted",
      description: `"${title}" has been removed from the marketplace.`,
    });
  };

  const handleEdit = (listingId: string) => {
    toast({
      title: "Edit Listing",
      description: "Redirecting to edit form...",
    });
    // Navigate to edit form
  };

  const handleToggleStatus = (listingId: string) => {
    setListings(listings.map(listing => {
      if (listing.id === listingId) {
        const newStatus = listing.status === "active" ? "paused" : "active";
        return { ...listing, status: newStatus };
      }
      return listing;
    }));
    
    const listing = listings.find(l => l.id === listingId);
    toast({
      title: listing?.status === "active" ? "Listing Paused" : "Listing Activated",
      description: `Your listing is now ${listing?.status === "active" ? "paused" : "active"}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/20 text-success";
      case "sold": return "bg-primary/20 text-primary";
      case "paused": return "bg-warning/20 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "brand-new": return "bg-success/20 text-success";
      case "like-new": return "bg-primary/20 text-primary";
      case "good": return "bg-warning/20 text-warning";
      case "fair": return "bg-orange-500/20 text-orange-500";
      case "poor": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const activeListings = listings.filter(l => l.status === "active");
  const soldListings = listings.filter(l => l.status === "sold");
  const pausedListings = listings.filter(l => l.status === "paused");

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userName="John Student" />
      
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
                ${listings.reduce((sum, listing) => listing.status === "sold" ? sum + listing.price : sum, 0)}
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
                      getConditionColor={getConditionColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Paused Listings */}
            {pausedListings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Paused Listings ({pausedListings.length})</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pausedListings.map((listing) => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      getStatusColor={getStatusColor}
                      getConditionColor={getConditionColor}
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
                      getConditionColor={getConditionColor}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ListingCardProps {
  listing: Listing;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onToggleStatus: (id: string) => void;
  getStatusColor: (status: string) => string;
  getConditionColor: (condition: string) => string;
}

const ListingCard = ({ 
  listing, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  getStatusColor, 
  getConditionColor 
}: ListingCardProps) => (
  <Card className="marketplace-card">
    <CardHeader className="p-4">
      <div className="relative">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-32 object-cover rounded-lg bg-muted"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={getStatusColor(listing.status)}>
            {listing.status}
          </Badge>
          <Badge className={getConditionColor(listing.condition)}>
            {listing.condition.replace('-', ' ')}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <CardTitle className="text-lg mb-2 line-clamp-2">{listing.title}</CardTitle>
      <CardDescription className="text-sm mb-3 line-clamp-2">
        {listing.description}
      </CardDescription>
      
      <div className="space-y-2 mb-4">
        <div className="text-2xl font-bold price-text">${listing.price}</div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {listing.views} views
          </span>
          <span className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            {listing.messages} messages
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Posted {listing.posted}
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
            {listing.status === "active" ? "Pause" : "Activate"}
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
                Are you sure you want to delete "{listing.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(listing.id, listing.title)}
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