
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin } from "lucide-react";
import { CATEGORIES, LOCATIONS } from "@/types/product";

interface MarketplaceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export const MarketplaceFilters = ({
  searchTerm,
  selectedCategory,
  selectedLocation,
  onSearchChange,
  onCategoryChange,
  onLocationChange
}: MarketplaceFiltersProps) => {
  const categories = [
    { value: "all", label: "All Categories" },
    ...CATEGORIES.map(cat => ({ value: cat.toLowerCase(), label: cat }))
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    ...LOCATIONS.map(loc => ({ value: loc, label: loc }))
  ];

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-green-500/20 mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
            <Input
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-black/60 border-green-500/30 text-white placeholder:text-gray-400 focus:border-green-400 text-sm sm:text-base"
            />
          </div>
          
          {/* Location Search Bar */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
            <Input
              placeholder="Search by location (e.g., Mumbai, Delhi, Bangalore)..."
              value={selectedLocation === "all" ? "" : selectedLocation}
              onChange={(e) => onLocationChange(e.target.value || "all")}
              className="pl-10 bg-black/60 border-green-500/30 text-white placeholder:text-gray-400 focus:border-green-400 text-sm sm:text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-48 bg-black/60 border-green-500/30 text-white focus:border-green-400">
                <Filter className="h-4 w-4 mr-2 text-green-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-green-500/30">
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-green-500/10 focus:bg-green-500/20">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Quick Location Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onLocationChange("all")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition-all ${
                  selectedLocation === "all" 
                    ? "bg-green-500 text-black border-green-500" 
                    : "bg-black/60 text-green-400 border-green-500/30 hover:border-green-400"
                }`}
              >
                All Cities
              </button>
              <button
                onClick={() => onLocationChange("Mumbai")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition-all ${
                  selectedLocation.includes("Mumbai") 
                    ? "bg-green-500 text-black border-green-500" 
                    : "bg-black/60 text-green-400 border-green-500/30 hover:border-green-400"
                }`}
              >
                Mumbai
              </button>
              <button
                onClick={() => onLocationChange("Delhi")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition-all ${
                  selectedLocation.includes("Delhi") 
                    ? "bg-green-500 text-black border-green-500" 
                    : "bg-black/60 text-green-400 border-green-500/30 hover:border-green-400"
                }`}
              >
                Delhi
              </button>
              <button
                onClick={() => onLocationChange("Bangalore")}
                className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition-all ${
                  selectedLocation.includes("Bangalore") 
                    ? "bg-green-500 text-black border-green-500" 
                    : "bg-black/60 text-green-400 border-green-500/30 hover:border-green-400"
                }`}
              >
                Bangalore
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
