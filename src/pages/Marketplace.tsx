
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowLeft, Heart, MapPin } from "lucide-react";
import { CATEGORIES, LOCATIONS } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";

export const Marketplace = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    fetchProducts({
      category: selectedCategory,
      location: selectedLocation,
      searchTerm: searchTerm
    });
  }, [searchTerm, selectedCategory, selectedLocation]);

  const categories = [
    { value: "all", label: "All Categories" },
    ...CATEGORIES.map(cat => ({ value: cat.toLowerCase(), label: cat }))
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    ...LOCATIONS.map(loc => ({ value: loc, label: loc }))
  ];

  const handleLike = (productId: string) => {
    // Implement like functionality with Supabase in future
    console.log("Like product:", productId);
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
              Campus <span className="hero-text">Marketplace</span>
            </h1>
            <p className="text-muted-foreground">
              Discover great deals from your fellow students
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="marketplace-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-48">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'item' : 'items'} found`}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="marketplace-card group hover:scale-105 transition-all">
                  <CardHeader className="p-4">
                    <div className="relative">
                      <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg bg-muted"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                        onClick={() => handleLike(product.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Badge className="absolute bottom-2 left-2 bg-primary/20 text-primary">
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="text-sm mb-3 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold price-text">${product.price}</span>
                        <Badge variant="outline" className="text-xs">
                          {product.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {product.location}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        by {product.seller_name} • {getTimeAgo(product.created_at)}
                      </div>
                    </div>

                    <WhatsAppContact 
                      phoneNumber={product.whatsapp_number}
                      productName={product.name}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};
