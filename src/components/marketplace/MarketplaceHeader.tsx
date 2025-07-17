
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MarketplaceHeaderProps {
  onBackClick: () => void;
}

export const MarketplaceHeader = ({ onBackClick }: MarketplaceHeaderProps) => (
  <div className="mb-6">
    <Button 
      variant="ghost" 
      onClick={onBackClick}
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
);
