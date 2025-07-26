
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
      className="mb-4 text-white hover:bg-gray-800"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
    <h1 className="text-3xl font-bold mb-2 text-white">
      Campus <span className="text-emerald-400">Marketplace</span>
    </h1>
    <p className="text-gray-400">
      Discover great deals from your fellow students
    </p>
  </div>
);
