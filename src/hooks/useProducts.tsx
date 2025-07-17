
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Product, CreateProductData } from '@/types/product'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchProducts = async (filters?: {
    category?: string
    location?: string
    searchTerm?: string
  }) => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      if (filters?.location && filters.location !== 'all') {
        query = query.eq('location', filters.location)
      }

      if (filters?.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      
      const typedProducts: Product[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'sold'
      }))
      
      setProducts(typedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: CreateProductData): Promise<Product> => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id,
          seller_name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                      user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      })

      return {
        ...data,
        status: data.status as 'active' | 'sold'
      } as Product
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Product updated successfully.",
      })

      return {
        ...data,
        status: data.status as 'active' | 'sold'
      } as Product
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success!",
        description: "Product deleted successfully.",
      })

      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      })
      throw error
    }
  }

  const fetchUserProducts = async (userId: string): Promise<Product[]> => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const typedProducts: Product[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'sold'
      }))
      
      return typedProducts
    } catch (error) {
      console.error('Error fetching user products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your listings",
        variant: "destructive"
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchUserProducts
  }
}
