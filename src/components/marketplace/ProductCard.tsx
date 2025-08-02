
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star } from "lucide-react";
import { Product } from "@/types/product";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { OptimizedImage } from "@/components/OptimizedImage";
import { memo } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {

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
    <BackgroundGradient className="marketplace-card group hover:scale-[1.02] transition-all duration-300">
      <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <OptimizedImage
              src={product.images?.[0] || "/placeholder.svg"} 
              alt={product.title}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg border-0">
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
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title and Description */}
            <div>
              <CardTitle className="text-xl mb-2 line-clamp-2 font-bold group-hover:text-emerald-400 transition-colors text-white">
                {product.title}
              </CardTitle>
              <CardDescription className="text-sm mb-3 line-clamp-2 text-gray-400 leading-relaxed">
                {product.description}
              </CardDescription>
            </div>
            
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 ml-2">INR</span>
              </div>
            </div>
            
            {/* Location and Time */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-emerald-400" />
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
    </BackgroundGradient>
  );
});
