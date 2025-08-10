import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Product, CreateProductData } from '@/types/product';

export const useProducts = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's products
  const fetchUserProducts = async () => {
    if (!user) {
      setProducts([]);
      return;
    }

    try {
      console.log('Fetching products for Clerk user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
        body: {
          clerkUserId: user.id,
          action: 'getUserProducts',
          data: {
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      setProducts(data?.products || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching user products:', error);
      setError('Failed to fetch your products');
      setProducts([]);
    }
  };

  // Fetch all products for marketplace
  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
        body: {
          clerkUserId: user?.id || 'anonymous',
          action: 'getAllProducts'
        }
      });

      if (error) {
        console.error('Error fetching all products:', error);
        throw error;
      }

      setAllProducts(data?.products || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setAllProducts([]);
    }
  };

  // Create new product
  const createProduct = async (productData: CreateProductData): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to create a product');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
        body: {
          clerkUserId: user.id,
          action: 'createProduct',
          data: {
            ...productData,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });

      if (error) {
        console.error('Error creating product:', error);
        setError('Failed to create product');
        return false;
      }

      // Refresh products after creation
      await fetchUserProducts();
      setError(null);
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product');
      return false;
    }
  };

  // Additional methods for compatibility
  const fetchProducts = async (filters?: {
    category?: string;
    location?: string;
    searchTerm?: string;
  }) => {
    await fetchAllProducts();
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh products after deletion
      await fetchUserProducts();
      await fetchAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await Promise.all([fetchUserProducts(), fetchAllProducts()]);
      setLoading(false);
    };

    loadProducts();
  }, [user]);

  return {
    products,
    allProducts,
    loading,
    error,
    createProduct,
    fetchProducts,
    fetchUserProducts,
    fetchAllProducts,
    updateProduct,
    deleteProduct
  };
};