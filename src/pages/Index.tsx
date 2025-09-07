import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, LogOut } from "lucide-react";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import StoreOwnerDashboard from "@/components/dashboard/StoreOwnerDashboard";

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect to auth
  }

  const renderDashboard = () => {
    switch (profile.role) {
      case "admin":
        return <AdminDashboard />;
      case "user":
        return <UserDashboard />;
      case "store_owner":
        return <StoreOwnerDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-primary fill-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                StoreRate
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                Welcome, {profile.full_name || user.email}
              </span>
              <Badge variant={profile.role === 'admin' ? 'default' : profile.role === 'store_owner' ? 'secondary' : 'outline'}>
                {profile.role === 'store_owner' ? 'Store Owner' : profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
              <Button 
                onClick={signOut}
                variant="outline" 
                size="sm"
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      {renderDashboard()}
    </div>
  );
};

export default Index;