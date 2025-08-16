
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellForm } from "@/components/sell/SellForm";
import { CATEGORIES, LOCATIONS, CreateProductData } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";

export const Sell = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateProductData) => {
    setIsSubmitting(true);
    try {
      await createProduct(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-4xl mx-auto p-6">
          <SellHeader onBackClick={() => navigate('/dashboard')} />
          <SellForm 
            categories={CATEGORIES}
            locations={LOCATIONS}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};
