
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <MarketplaceHeader onBackClick={() => navigate('/dashboard')} />
            
            <MarketplaceFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onLocationChange={setSelectedLocation}
            />

            <div className="mb-6">
              <p className="text-gray-300 text-sm sm:text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Loading products...
                  </span>
                ) : (
                  `${products.length} ${products.length === 1 ? 'item' : 'items'} found`
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ProductGrid 
                products={products}
                onClearFilters={handleClearFilters}
              />
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};
