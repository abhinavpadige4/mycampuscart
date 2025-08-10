import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GlobalStats {
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  citiesServed: number;
}

interface UserStats {
  itemsListed: number;
  itemsSold: number;
  totalEarnings: number;
  activeChats: number;
}

export const useGlobalStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    citiesServed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: usersCount, error: usersError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching users count:', usersError);
        }

        // Get total products
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) {
          console.error('Error fetching products count:', productsError);
        }

        // Get unique cities from products
        const { data: cities } = await supabase
          .from('products')
          .select('location')
          .not('location', 'is', null);

        const uniqueCities = new Set(cities?.map(item => item.location)).size;

        // Calculate total views as proxy for transactions
        const { data: viewsData } = await supabase
          .from('products')
          .select('views_count');

        const totalViews = viewsData?.reduce((sum, item) => sum + (item.views_count || 0), 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          totalProducts: productsCount || 0,
          totalTransactions: totalViews,
          citiesServed: uniqueCities
        });
      } catch (error) {
        console.error('Error fetching global stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    itemsListed: 0,
    itemsSold: 0,
    totalEarnings: 0,
    activeChats: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile ID
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .single();

        if (!userProfile) {
          setLoading(false);
          return;
        }

        // Get user's products
        const { data: userProducts, count: itemsListed } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('user_id', userProfile.id);

        // Calculate sold items (products with status 'sold' - we'll need to add this status)
        const soldItems = userProducts?.filter(product => product.status === 'sold').length || 0;

        // Calculate total earnings (sum of prices for sold items)
        const totalEarnings = userProducts
          ?.filter(product => product.status === 'sold')
          .reduce((sum, product) => sum + (parseFloat(product.price?.toString() || '0')), 0) || 0;

        // Get user's likes as proxy for active chats
        const { count: activeChats } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userProfile.id);

        setStats({
          itemsListed: itemsListed || 0,
          itemsSold: soldItems,
          totalEarnings: totalEarnings,
          activeChats: activeChats || 0
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return { stats, loading };
};