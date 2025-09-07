import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Mock data - will be replaced with Supabase data
  const mockStores = [
    { 
      id: 1, 
      name: 'Tech Paradise Electronics Store', 
      address: '123 Tech Street, Silicon Valley, CA', 
      rating: 4.5, 
      userRating: 5,
      totalRatings: 234
    },
    { 
      id: 2, 
      name: 'Green Garden Organic Market', 
      address: '456 Organic Lane, Portland, OR', 
      rating: 4.8, 
      userRating: null,
      totalRatings: 189
    },
    { 
      id: 3, 
      name: 'Fashion Forward Boutique', 
      address: '789 Style Avenue, New York, NY', 
      rating: 4.2, 
      userRating: 4,
      totalRatings: 156
    },
    { 
      id: 4, 
      name: 'Coffee Corner Cafe', 
      address: '321 Bean Street, Seattle, WA', 
      rating: 4.7, 
      userRating: null,
      totalRatings: 298
    },
  ];

  const filteredStores = mockStores.filter(store => 
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

  const handleRateStore = (storeId: number, rating: number) => {
    // TODO: Implement rating submission to Supabase
    console.log('Rating store:', storeId, 'with rating:', rating);
    // Update local state or refetch data
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
                <p className="text-sm text-muted-foreground">Welcome back, John!</p>
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
                        filteredStores.map((store) => (
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
                                {renderStars(store.rating)}
                                <span className="text-sm text-muted-foreground">
                                  ({store.totalRatings})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {store.userRating ? (
                                <div className="flex items-center space-x-2">
                                  {renderStars(store.userRating)}
                                  <Badge variant="secondary">Rated</Badge>
                                </div>
                              ) : (
                                <Badge variant="outline">Not rated</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedStore(store);
                                      setUserRating(store.userRating || 0);
                                    }}
                                  >
                                    {store.userRating ? (
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
                                      {store.userRating ? 'Update Rating' : 'Rate Store'}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Rate {store.name} from 1 to 5 stars
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">{store.name}</h4>
                                        <p className="text-sm text-muted-foreground">{store.address}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Your Rating</Label>
                                        {renderStars(userRating, true, (rating) => handleRateStore(store.id, rating))}
                                        <p className="text-sm text-muted-foreground">
                                          Click on stars to rate (1-5 stars)
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      className="bg-gradient-primary hover:bg-primary-hover"
                                      disabled={userRating === 0}
                                    >
                                      Submit Rating
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
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
                    <Input value="John Smith Anderson" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value="john@example.com" disabled />
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