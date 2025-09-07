import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Star, 
  Users,
  LogOut,
  Settings,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatsCard from '@/components/dashboard/StatsCard';
import { useAuth } from '@/hooks/useAuth';
import { useStores } from '@/hooks/useSupabaseData';
import { useEnhancedRatings } from '@/hooks/useEnhancedRatings';

const StoreOwnerDashboard = () => {
  const { user, profile } = useAuth();
  const { stores, loading: storesLoading } = useStores();
  const [userStore, setUserStore] = useState<any>(null);
  
  // Get the store owned by current user
  useEffect(() => {
    if (user && stores.length > 0) {
      const ownedStore = stores.find(store => store.owner_id === user.id);
      setUserStore(ownedStore);
    }
  }, [user, stores]);

  const { ratings, loading: ratingsLoading } = useEnhancedRatings(userStore?.id);

  // Calculate stats from real data
  const storeStats = {
    averageRating: userStore?.average_rating || 0,
    totalRatings: userStore?.total_ratings || 0,
    totalCustomers: ratings.length, // Unique ratings = unique customers for this store
    monthlyGrowth: 12 // This would need more complex calculation with historical data
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-accent fill-current' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="ml-2 font-medium text-foreground">
          {rating}
        </span>
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating - 1]++;
      }
    });
    return distribution.reverse(); // 5 stars first
  };

  const ratingDistribution = getRatingDistribution();
  const totalRatings = ratings.length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Store Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {userStore?.name || 'No store found'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-success text-success-foreground">
              Online
            </Badge>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Average Rating"
            value={storeStats.averageRating.toString()}
            icon={Star}
            trend="+0.2"
            trendUp={true}
            description="Overall store rating"
          />
          <StatsCard
            title="Total Ratings"
            value={storeStats.totalRatings.toLocaleString()}
            icon={BarChart3}
            trend="+18"
            trendUp={true}
            description="Customer reviews"
          />
          <StatsCard
            title="Unique Customers"
            value={storeStats.totalCustomers.toLocaleString()}
            icon={Users}
            trend="+23"
            trendUp={true}
            description="Customers who rated"
          />
          <StatsCard
            title="Monthly Growth"
            value={`${storeStats.monthlyGrowth}%`}
            icon={TrendingUp}
            trend="+5%"
            trendUp={true}
            description="Rating increase"
          />
        </div>

        <Tabs defaultValue="ratings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ratings">Customer Ratings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Store Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Customer Ratings</CardTitle>
                <CardDescription>
                  View all customers who have rated your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ratingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
                    <span>Loading ratings...</span>
                  </div>
                ) : ratings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p>No ratings yet</p>
                    <p className="text-sm">Your store hasn't received any ratings yet.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Comment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ratings.map((rating) => (
                          <TableRow key={rating.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {rating.customerName}
                            </TableCell>
                            <TableCell>
                              {renderStars(rating.rating)}
                            </TableCell>
                            <TableCell>
                              {new Date(rating.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="text-sm text-muted-foreground truncate" title={rating.comment || undefined}>
                                {rating.comment || 'No comment provided'}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Breakdown of your ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map((stars, index) => {
                      const count = ratingDistribution[index];
                      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 w-16">
                            <span className="text-sm font-medium">{stars}</span>
                            <Star className="h-4 w-4 text-accent fill-current" />
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Trends</CardTitle>
                  <CardDescription>Rating performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p>Rating trends chart</p>
                      <p className="text-sm">Coming soon with real data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Manage your store profile and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <p className="p-2 bg-muted rounded">{userStore?.name || 'No store configured'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <p className="p-2 bg-muted rounded">{userStore?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <p className="p-2 bg-muted rounded">{userStore?.address || 'Not provided'}</p>
                </div>
                <div className="pt-4">
                  <Button className="bg-gradient-primary hover:bg-primary-hover">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;