
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SellHeaderProps {
  onBackClick: () => void;
}

export const SellHeader = ({ onBackClick }: SellHeaderProps) => (
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
      Sell Your <span className="text-emerald-400">Item</span>
    </h1>
    <p className="text-gray-400">
      List your item for sale to other students on campus
    </p>
  </div>
);
