import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowLeft, MessageCircle, Heart, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  image: string;
  seller: string;
  location: string;
  posted: string;
  liked: boolean;
}

export const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Mock data - replace with real Supabase data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        title: "Calculus Textbook - 3rd Edition",
        price: 85,
        description: "Excellent condition calculus textbook. Barely used, no highlighting or writing inside.",
        category: "books",
        condition: "like-new",
        image: "/placeholder.svg",
        seller: "Sarah M.",
        location: "North Campus",
        posted: "2 hours ago",
        liked: false
      },
      {
        id: "2", 
        title: "MacBook Air M1 2020",
        price: 650,
        description: "13-inch MacBook Air in great condition. Includes charger and original box.",
        category: "electronics",
        condition: "good",
        image: "/placeholder.svg",
        seller: "Mike K.",
        location: "South Dorms",
        posted: "1 day ago",
        liked: true
      },
      {
        id: "3",
        title: "Desk Lamp - IKEA",
        price: 25,
        description: "White desk lamp, perfect for studying. Still in excellent working condition.",
        category: "furniture",
        condition: "good",
        image: "/placeholder.svg",
        seller: "Emma L.",
        location: "West Campus",
        posted: "3 days ago",
        liked: false
      },
      {
        id: "4",
        title: "Nintendo Switch",
        price: 200,
        description: "Includes console, dock, and 2 controllers. Some minor wear but works perfectly.",
        category: "electronics",
        condition: "fair",
        image: "/placeholder.svg",
        seller: "Alex R.",
        location: "East Campus",
        posted: "5 days ago",
        liked: false
      },
      {
        id: "5",
        title: "Chemistry Lab Coat",
        price: 15,
        description: "Size Medium lab coat, used for one semester. Clean and ready to use.",
        category: "accessories",
        condition: "good",
        image: "/placeholder.svg",
        seller: "Jordan P.",
        location: "Science Building",
        posted: "1 week ago",
        liked: false
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "books", label: "Books" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
    { value: "accessories", label: "Accessories" },
    { value: "clothing", label: "Clothing" },
    { value: "sports", label: "Sports & Recreation" },
    { value: "miscellaneous", label: "Miscellaneous" }
  ];

  const handleLike = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, liked: !product.liked } : product
    ));
  };

  const handleContact = (seller: string, productTitle: string) => {
    toast({
      title: "Contact Seller",
      description: `Message sent to ${seller} about "${productTitle}"`,
    });
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="marketplace-card group hover:scale-105 transition-all">
              <CardHeader className="p-4">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg bg-muted"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 ${product.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={() => handleLike(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${product.liked ? 'fill-current' : ''}`} />
                  </Button>
                  <Badge className={`absolute bottom-2 left-2 ${getConditionColor(product.condition)}`}>
                    {product.condition.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
                <CardDescription className="text-sm mb-3 line-clamp-2">
                  {product.description}
                </CardDescription>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold price-text">${product.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === product.category)?.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.location}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    by {product.seller} • {product.posted}
                  </div>
                </div>

                <Button 
                  variant="gradient" 
                  className="w-full"
                  onClick={() => handleContact(product.seller, product.title)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};