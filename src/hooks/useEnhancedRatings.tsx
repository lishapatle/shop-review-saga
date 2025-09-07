import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Rating } from '@/hooks/useSupabaseData';

export interface EnhancedRating extends Rating {
  customerName: string;
  storeName?: string;
}

// Hook to fetch ratings with customer names
export function useEnhancedRatings(storeId?: string) {
  const [ratings, setRatings] = useState<EnhancedRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnhancedRatings();
  }, [storeId]);

  const fetchEnhancedRatings = async () => {
    try {
      setLoading(true);
      
      // First get ratings
      let ratingsQuery = supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (storeId) {
        ratingsQuery = ratingsQuery.eq('store_id', storeId);
      }

      const { data: ratingsData, error: ratingsError } = await ratingsQuery;
      if (ratingsError) throw ratingsError;

      if (!ratingsData || ratingsData.length === 0) {
        setRatings([]);
        return;
      }

      // Get unique user IDs and store IDs
      const userIds = [...new Set(ratingsData.map(r => r.user_id))];
      const storeIds = [...new Set(ratingsData.map(r => r.store_id))];

      // Fetch profiles for users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Fetch store names if needed
      let storesData: any[] = [];
      if (!storeId && storeIds.length > 0) {
        const { data, error: storesError } = await supabase
          .from('stores')
          .select('id, name')
          .in('id', storeIds);
        
        if (storesError) throw storesError;
        storesData = data || [];
      }

      // Create lookup maps
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p.full_name]) || []);
      const storeMap = new Map(storesData.map(s => [s.id, s.name]));

      // Enhance ratings with customer names
      const enhancedRatings: EnhancedRating[] = ratingsData.map(rating => ({
        ...rating,
        customerName: profileMap.get(rating.user_id) || 'Anonymous User',
        storeName: storeMap.get(rating.store_id)
      }));

      setRatings(enhancedRatings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enhanced ratings');
    } finally {
      setLoading(false);
    }
  };

  return { ratings, loading, error, refetch: fetchEnhancedRatings };
}