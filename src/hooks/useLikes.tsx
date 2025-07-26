import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export const useLikes = () => {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's likes
  const fetchUserLikes = async () => {
    if (!user) return;
    
    try {
      // Get user profile ID from user_profiles table using Clerk user ID
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      const { data, error } = await supabase
        .from('likes')
        .select('product_id')
        .eq('user_id', userProfile.id);

      if (error) throw error;

      const likesMap: Record<string, boolean> = {};
      data?.forEach((like) => {
        likesMap[like.product_id] = true;
      });
      
      setLikes(likesMap);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  // Toggle like for a product
  const toggleLike = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like products",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const isLiked = likes[productId];

    try {
      // Get user profile ID from user_profiles table using Clerk user ID
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('product_id', productId);

        if (error) throw error;

        setLikes(prev => {
          const newLikes = { ...prev };
          delete newLikes[productId];
          return newLikes;
        });

        toast({
          title: "Removed from favorites",
          description: "Product removed from your favorites",
        });
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([{
            user_id: userProfile.id,
            product_id: productId
          }]);

        if (error) throw error;

        setLikes(prev => ({
          ...prev,
          [productId]: true
        }));

        toast({
          title: "Added to favorites",
          description: "Product added to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get like count for a product
  const getLikeCount = async (productId: string) => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting like count:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchUserLikes();
  }, [user]);

  return {
    likes,
    loading,
    toggleLike,
    getLikeCount,
    isLiked: (productId: string) => !!likes[productId]
  };
};