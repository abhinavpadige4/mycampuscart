
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { Product } from "@/types/product";
import { WhatsAppContact } from "@/components/WhatsAppContact";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const handleLike = (productId: string) => {
    // TODO: Implement like functionality with Supabase
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
    <Card className="marketplace-card group hover:scale-105 transition-all">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={product.images?.[0] || "/placeholder.svg"} 
            alt={product.title}
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
        <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {product.description}
        </CardDescription>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold price-text">₹{product.price}</span>
            <Badge variant="outline" className="text-xs">
              {product.status}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {product.location}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {getTimeAgo(product.created_at)}
          </div>
        </div>

        <WhatsAppContact 
          phoneNumber={product.whatsapp_number}
          productName={product.title}
          productImage={product.images?.[0]}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};
