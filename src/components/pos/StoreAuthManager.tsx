
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Store, UserPlus, Key, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    storeName: store.name,
    ownerName: '',
    email: '',
    phone: store.phone,
    address: store.address,
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = () => {
    // Simple demo authentication - in real app, this would be server-side
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      onAuthenticated();
      toast({
        title: "Login Successful",
        description: `Welcome to ${store.name}`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use admin/admin for demo",
        variant: "destructive"
      });
    }
  };

  const handleRegister = () => {
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!registerData.ownerName || !registerData.email || !registerData.username || !registerData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onRegisterStore({
      ...registerData,
      storeId: store.id,
      registeredAt: new Date()
    });

    toast({
      title: "Store Registered",
      description: `${store.name} has been registered successfully`,
    });

    onAuthenticated();
  };

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
            Independent Store Access
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
              >
                <Key className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(false)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            </div>
          </div>

          {isLogin ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                Demo credentials: admin / admin
              </div>
              <Button onClick={handleLogin} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Access Store
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
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={registerData.ownerName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="Your name"
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
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regUsername">Username</Label>
                  <Input
                    id="regUsername"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose username"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254..."
                  />
                </div>
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
                  />
                </div>
              </div>
              <Button onClick={handleRegister} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Register Independent Store
              </Button>
            </div>
          )}
          
          <div className="text-xs text-center text-gray-500 pt-4 border-t">
            This store operates independently with its own settings, products, and data
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
