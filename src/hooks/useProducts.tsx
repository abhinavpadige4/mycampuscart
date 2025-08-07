import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product, CreateProductData } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async (filters?: {
    category?: string;
    location?: string;
    searchTerm?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.location && filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }

      if (filters?.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductData): Promise<{ data: Product | null; error: string | null }> => {
    if (authLoading) {
      return { data: null, error: 'Authentication loading...' };
    }
    
    if (!isAuthenticated || !user) {
      return { data: null, error: 'User must be authenticated' };
    }

    try {
      // Use the clerk-auth-bridge edge function to create products
      const { data, error } = await supabase.functions.invoke('clerk-auth-bridge', {
        body: {
          clerkUserId: user.id,
          action: 'createProduct',
          data: productData
        }
      });

      if (error) throw error;

      setProducts(current => [data, ...current]);
      
      toast({
        title: "Success!",
        description: "Your product has been listed successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      });
      return { data: null, error: error.message };
    }
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

      toast({
        title: "Success!",
        description: "Product updated successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive"
      });
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

      toast({
        title: "Success!",
        description: "Product deleted successfully.",
      });

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const fetchUserProducts = async (clerkUserId: string): Promise<Product[]> => {
    setLoading(true);
    try {
      // First get the user's UUID from user_profiles table with retry logic
      let retryCount = 0;
      let userProfile = null;
      
      while (retryCount < 3) {
        const { data, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }

        if (data) {
          userProfile = data;
          break;
        }

        // If no profile found, try to create one using the edge function
        if (retryCount === 0) {
          console.log('No user profile found, attempting to create one...');
          try {
            await supabase.functions.invoke('clerk-auth-bridge', {
              body: {
                clerkUserId,
                action: 'getUserRole',
                data: {}
              }
            });
            // Wait a bit for the profile to be created
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (edgeError) {
            console.error('Error calling edge function:', edgeError);
          }
        }

        retryCount++;
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!userProfile) {
        console.warn('No user profile found for Clerk user ID after retries:', clerkUserId);
        return [];
      }

      // Now fetch products using the UUID
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your listings",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if products array is empty to avoid unnecessary refetches
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchUserProducts,
  };
};