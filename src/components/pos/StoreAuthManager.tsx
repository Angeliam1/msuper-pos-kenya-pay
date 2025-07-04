
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Store, UserPlus, Key, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { StoreLocation } from '@/types';

interface StoreAuthManagerProps {
  store: StoreLocation;
  onAuthenticated: () => void;
  onRegisterStore: (storeData: any) => void;
}

export const StoreAuthManager: React.FC<StoreAuthManagerProps> = ({
  store,
  onAuthenticated,
  onRegisterStore
}) => {
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    storeName: store.name,
    ownerName: '',
    email: '',
    phone: store.phone,
    address: store.address,
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive"
      });
    } else {
      onAuthenticated();
      toast({
        title: "Login Successful",
        description: `Welcome to ${store.name}`,
      });
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!registerData.ownerName || !registerData.email || !registerData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(registerData.email, registerData.password, {
      storeName: registerData.storeName,
      ownerName: registerData.ownerName,
      phone: registerData.phone,
      address: registerData.address
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive"
      });
    } else {
      onRegisterStore({
        ...registerData,
        storeId: store.id,
        registeredAt: new Date()
      });

      toast({
        title: "Store Registered",
        description: `${store.name} has been registered successfully. Please check your email to verify your account.`,
      });

      onAuthenticated();
    }
    setLoading(false);
  };

  // If user is already authenticated, show authenticated state
  if (user) {
    onAuthenticated();
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-blue-100 rounded-full">
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">{store.name}</CardTitle>
          <p className="text-sm text-gray-600">{store.address}</p>
          <Badge variant="outline" className="w-fit mx-auto mt-2">
            Secure Store Access
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(true)}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Key className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(false)}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            </div>
          </div>

          {isLogin ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? 'Signing In...' : 'Access Store'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={registerData.storeName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, storeName: e.target.value }))}
                    placeholder="Store name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={registerData.ownerName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254..."
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regPassword">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Password"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button onClick={handleRegister} className="w-full" disabled={loading}>
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Creating Account...' : 'Register Secure Store'}
              </Button>
            </div>
          )}
          
          <div className="text-xs text-center text-gray-500 pt-4 border-t">
            This store uses secure authentication with encrypted data storage
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
