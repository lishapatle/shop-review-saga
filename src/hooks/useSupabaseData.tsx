import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: 'admin' | 'store_owner' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  category: string | null;
  image_url: string | null;
  average_rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Rating {
  id: string;
  user_id: string;
  store_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

// Hook to fetch all profiles (for admin)
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data || []) as Profile[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  return { profiles, loading, error, refetch: fetchProfiles };
}

// Hook to fetch all stores
export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  return { stores, loading, error, refetch: fetchStores };
}

// Hook to fetch ratings (all or for specific store)
export function useRatings(storeId?: string) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRatings();
  }, [storeId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRatings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  return { ratings, loading, error, refetch: fetchRatings };
}

// Hook to get dashboard stats
export function useDashboardStats() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
    avgRating: number;
  }>({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [profilesResult, storesResult, ratingsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('ratings').select('rating')
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (storesResult.error) throw storesResult.error;
      if (ratingsResult.error) throw ratingsResult.error;

      const totalUsers = profilesResult.count || 0;
      const totalStores = storesResult.count || 0;
      const ratingsData = ratingsResult.data || [];
      const totalRatings = ratingsData.length;
      const avgRating = totalRatings > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;

      setStats({
        totalUsers,
        totalStores,
        totalRatings,
        avgRating: Math.round(avgRating * 10) / 10
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}

// Hook to submit rating
export function useSubmitRating() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const submitRating = async (storeId: string, rating: number, comment?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a rating.",
        variant: "destructive",
      });
      return { error: new Error('Not authenticated') };
    }

    try {
      setSubmitting(true);
      
      // Check if user already rated this store
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('id')
        .eq('user_id', user.id)
        .eq('store_id', storeId)
        .single();

      let result;
      if (existingRating) {
        // Update existing rating
        result = await supabase
          .from('ratings')
          .update({ 
            rating, 
            comment: comment || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRating.id);
      } else {
        // Insert new rating
        result = await supabase
          .from('ratings')
          .insert({
            user_id: user.id,
            store_id: storeId,
            rating,
            comment: comment || null
          });
      }

      if (result.error) throw result.error;

      toast({
        title: "Rating Submitted",
        description: existingRating ? "Your rating has been updated." : "Thank you for your rating!",
      });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit rating';
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitRating, submitting };
}

// Hook to get user's ratings
export function useUserRatings() {
  const { user } = useAuth();
  const [userRatings, setUserRatings] = useState<{ [storeId: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRatings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRatings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ratings')
        .select('store_id, rating')
        .eq('user_id', user.id);

      if (error) throw error;

      const ratingsMap: { [key: string]: number } = {};
      data?.forEach(rating => {
        ratingsMap[rating.store_id] = rating.rating;
      });

      setUserRatings(ratingsMap);
    } catch (err) {
      console.error('Failed to fetch user ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  return { userRatings, loading, refetch: fetchUserRatings };
}