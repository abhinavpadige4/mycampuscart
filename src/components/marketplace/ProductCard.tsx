
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Eye, Clock, Star } from "lucide-react";
import { Product } from "@/types/product";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { useLikes } from "@/hooks/useLikes";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleLike, isLiked, loading } = useLikes();

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
    <Card className="marketplace-card group hover:scale-[1.02] transition-all duration-300 hover:shadow-elevated border-border/50 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.images?.[0] || "/placeholder.svg"} 
            alt={product.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            className={cn(
              "absolute top-3 right-3 backdrop-blur-md bg-background/20 border border-white/20 transition-all duration-300",
              isLiked(product.id) 
                ? "text-red-500 hover:text-red-600 bg-red-500/10" 
                : "text-white hover:text-red-500 hover:bg-red-500/10"
            )}
            onClick={() => toggleLike(product.id)}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all",
                isLiked(product.id) && "fill-current"
              )} 
            />
          </Button>

          {/* Premium Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-primary text-primary-foreground shadow-lg border-0">
              <Star className="h-3 w-3 mr-1" />
              {product.category}
            </Badge>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant={product.status === 'active' ? 'default' : 'secondary'}
              className="bg-background/90 text-foreground border-border/50 backdrop-blur-sm"
            >
              {product.status}
            </Badge>
          </div>

          {/* Views indicator */}
          <div className="absolute bottom-3 right-3 flex items-center text-white text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="h-3 w-3 mr-1" />
            {product.views_count || 0}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Description */}
          <div>
            <CardTitle className="text-xl mb-2 line-clamp-2 font-bold group-hover:text-primary transition-colors">
              {product.title}
            </CardTitle>
            <CardDescription className="text-sm mb-3 line-clamp-2 text-muted-foreground leading-relaxed">
              {product.description}
            </CardDescription>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground ml-2">INR</span>
            </div>
          </div>
          
          {/* Location and Time */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-primary" />
              <span className="font-medium">{product.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{getTimeAgo(product.created_at)}</span>
            </div>
          </div>

          {/* Contact Button */}
          {product.whatsapp_number && (
            <WhatsAppContact 
              phoneNumber={product.whatsapp_number}
              productName={product.title}
              productImage={product.images?.[0]}
              className="w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
