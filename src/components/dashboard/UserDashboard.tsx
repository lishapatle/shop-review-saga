import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Store, 
  Star, 
  Search,
  MapPin,
  LogOut,
  Settings,
  Eye,
  Edit2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useStores, useSubmitRating, useUserRatings } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user, profile } = useAuth();
  const { stores, loading: storesLoading, refetch: refetchStores } = useStores();
  const { userRatings, loading: ratingsLoading, refetch: refetchUserRatings } = useUserRatings();
  const { submitRating, submitting } = useSubmitRating();

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= (interactive ? hoveredRating || userRating : rating) 
                ? 'text-accent fill-current' 
                : 'text-muted-foreground'
            }`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => {
              if (interactive && onStarClick) {
                setUserRating(star);
                onStarClick(star);
              }
            }}
          />
        ))}
        {!interactive && (
          <span className="ml-2 font-medium text-foreground">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  const handleRateStore = async (storeId: string, rating: number) => {
    const { error } = await submitRating(storeId, rating, comment);
    if (!error) {
      setDialogOpen(false);
      setComment('');
      setUserRating(0);
      refetchStores();
      refetchUserRatings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">User Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile?.full_name || user?.email}!
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
        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stores">Browse Stores</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle>Find Stores</CardTitle>
                <CardDescription>Search for stores by name or address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Store Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Store Directory</CardTitle>
                <CardDescription>
                  Browse all registered stores and submit your ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {storesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
                    <span>Loading stores...</span>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Store Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Overall Rating</TableHead>
                          <TableHead>Your Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStores.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No stores found matching your search
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStores.map((store) => {
                            const hasUserRating = userRatings[store.id];
                            return (
                              <TableRow key={store.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{store.name}</TableCell>
                                <TableCell>
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="max-w-xs truncate" title={store.address}>
                                      {store.address}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {renderStars(store.average_rating)}
                                    <span className="text-sm text-muted-foreground">
                                      ({store.total_ratings})
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {hasUserRating ? (
                                    <div className="flex items-center space-x-2">
                                      {renderStars(hasUserRating)}
                                      <Badge variant="secondary">Rated</Badge>
                                    </div>
                                  ) : (
                                    <Badge variant="outline">Not rated</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedStore(store);
                                          setUserRating(userRatings[store.id] || 0);
                                          setComment('');
                                          setDialogOpen(true);
                                        }}
                                      >
                                        {hasUserRating ? (
                                          <>
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Edit Rating
                                          </>
                                        ) : (
                                          <>
                                            <Star className="h-4 w-4 mr-1" />
                                            Rate Store
                                          </>
                                        )}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          {hasUserRating ? 'Update Rating' : 'Rate Store'}
                                        </DialogTitle>
                                        <DialogDescription>
                                          Rate {selectedStore?.name} from 1 to 5 stars
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="py-6">
                                        <div className="space-y-4">
                                          <div>
                                            <h4 className="font-medium mb-2">{selectedStore?.name}</h4>
                                            <p className="text-sm text-muted-foreground">{selectedStore?.address}</p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Your Rating</Label>
                                            {renderStars(userRating, true, (rating) => setUserRating(rating))}
                                            <p className="text-sm text-muted-foreground">
                                              Click on stars to rate (1-5 stars)
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Comment (optional)</Label>
                                            <Textarea
                                              placeholder="Share your experience..."
                                              value={comment}
                                              onChange={(e) => setComment(e.target.value)}
                                              className="resize-none"
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                          Cancel
                                        </Button>
                                        <Button 
                                          className="bg-gradient-primary hover:bg-primary-hover"
                                          disabled={userRating === 0 || submitting}
                                          onClick={() => selectedStore && handleRateStore(selectedStore.id, userRating)}
                                        >
                                          {submitting ? 'Submitting...' : 'Submit Rating'}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your account information and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile?.full_name || 'Not provided'} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || 'Not available'} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value="123 Main Street, New York, NY 10001" disabled />
                </div>
                <div className="pt-4">
                  <Button className="bg-gradient-primary hover:bg-primary-hover">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
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

export default UserDashboard;