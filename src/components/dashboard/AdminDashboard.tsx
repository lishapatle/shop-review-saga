import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Store, 
  Star, 
  Plus, 
  Search,
  Filter,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StatsCard from '@/components/dashboard/StatsCard';
import UserTable from '@/components/dashboard/UserTable';
import StoreTable from '@/components/dashboard/StoreTable';
import { useProfiles, useStores, useDashboardStats } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { user, profile } = useAuth();
  const { profiles, loading: profilesLoading } = useProfiles();
  const { stores, loading: storesLoading } = useStores();
  const { stats, loading: statsLoading } = useDashboardStats();

  // Transform profiles data for UserTable component
  const transformedUsers = profiles.map(profile => ({
    id: profile.id,
    name: profile.full_name || 'No name provided',
    email: `user-${profile.user_id.slice(0, 8)}@example.com`, // Simplified since we don't have email in profiles
    address: 'Address not available', // Address not in current schema
    role: profile.role === 'store_owner' ? 'Store Owner' : 
          profile.role === 'admin' ? 'System Admin' : 'Normal User'
  }));

  // Transform stores data for StoreTable component  
  const transformedStores = stores.map(store => ({
    id: store.id,
    name: store.name,
    email: store.email || `${store.name.toLowerCase().replace(/\s+/g, '')}@store.com`,
    address: store.address,
    rating: store.average_rating
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name || 'Administrator'}
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
            title="Total Users"
            value={statsLoading ? '...' : stats.totalUsers.toLocaleString()}
            icon={Users}
            trend="+12%"
            trendUp={true}
            description="Active users on platform"
          />
          <StatsCard
            title="Total Stores"
            value={statsLoading ? '...' : stats.totalStores.toLocaleString()}
            icon={Store}
            trend="+5%"
            trendUp={true}
            description="Registered stores"
          />
          <StatsCard
            title="Total Ratings"
            value={statsLoading ? '...' : stats.totalRatings.toLocaleString()}
            icon={Star}
            trend="+18%"
            trendUp={true}
            description="Submitted ratings"
          />
          <StatsCard
            title="Average Rating"
            value={statsLoading ? '...' : stats.avgRating.toString()}
            icon={BarChart3}
            trend="+0.2"
            trendUp={true}
            description="Platform average"
          />
        </div>

        {/* Management Tabs */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platform Management</CardTitle>
                <CardDescription>
                  Manage users, stores, and view detailed analytics
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="stores">Stores</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Search and Filter Bar */}
              <div className="flex items-center space-x-4 my-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">System Admin</SelectItem>
                    <SelectItem value="user">Normal User</SelectItem>
                    <SelectItem value="owner">Store Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="users" className="space-y-4">
                {profilesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <UserTable users={transformedUsers} searchTerm={searchTerm} roleFilter={roleFilter} />
                )}
              </TabsContent>

              <TabsContent value="stores" className="space-y-4">
                {storesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <StoreTable stores={transformedStores} searchTerm={searchTerm} />
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Charts will be implemented with real data
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Rating analytics coming soon
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;