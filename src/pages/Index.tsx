import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Store, Users, Shield } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Index = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-glow">
                <Store className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              StoreRate Pro
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              The comprehensive store rating platform for businesses, customers, and administrators
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                <Users className="h-8 w-8 mb-3 mx-auto text-accent" />
                <h3 className="font-semibold mb-2">For Customers</h3>
                <p className="text-white/80">Rate and review your favorite stores</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                <Store className="h-8 w-8 mb-3 mx-auto text-accent" />
                <h3 className="font-semibold mb-2">For Store Owners</h3>
                <p className="text-white/80">Manage your store reputation and ratings</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                <Shield className="h-8 w-8 mb-3 mx-auto text-accent" />
                <h3 className="font-semibold mb-2">For Administrators</h3>
                <p className="text-white/80">Complete platform management and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto animate-slide-up">
            <Card className="shadow-lg border-0 shadow-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="signup" className="mt-6">
                    <SignupForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage store ratings and user interactions effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Star,
                title: '5-Star Rating System',
                description: 'Comprehensive rating system from 1 to 5 stars'
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Role-based access control and user administration'
              },
              {
                icon: Store,
                title: 'Store Directory',
                description: 'Complete store listings with search and filters'
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Enterprise-grade security and data protection'
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Store className="h-8 w-8 mr-2 text-accent" />
              <span className="text-xl font-bold">StoreRate Pro</span>
            </div>
            <p className="text-white/80">
              © 2024 StoreRate Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;