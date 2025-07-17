
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
    <Card className="marketplace-card mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
            
            <Select value={selectedLocation} onValueChange={onLocationChange}>
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
  );
};
