
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, UserPlus, LogIn, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const LoginPage: React.FC = () => {
  const { user, userRole, signIn, signUp, loading } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    ownerName: '',
    phone: '',
    address: '',
    kraPin: '',
    mpesaPaybill: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users based on their role
  useEffect(() => {
    if (user && userRole && !loading) {
      // Auto-redirect based on role
      if (userRole.role === 'super_admin') {
        window.location.href = '/super-admin';
      } else if (['owner', 'admin', 'manager'].includes(userRole.role)) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/pos';
      }
    }
  }, [user, userRole, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(loginData.email, loginData.password);
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await signUp(registerData.email, registerData.password, {
      store_name: registerData.storeName,
      owner_name: registerData.ownerName,
      phone: registerData.phone,
      address: registerData.address,
      kra_pin: registerData.kraPin,
      mpesa_paybill: registerData.mpesaPaybill
    });
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
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
          <CardTitle className="text-2xl">M-Super POS</CardTitle>
          <p className="text-gray-600">Point of Sale System</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register Store
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Shield className="h-4 w-4 mr-2" />
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      value={registerData.storeName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, storeName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={registerData.ownerName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, ownerName: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={registerData.address}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kraPin">KRA PIN</Label>
                    <Input
                      id="kraPin"
                      value={registerData.kraPin}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, kraPin: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
                  <Input
                    id="mpesaPaybill"
                    value={registerData.mpesaPaybill}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, mpesaPaybill: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="regEmail">Email *</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regPassword">Password *</Label>
                    <Input
                      id="regPassword"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Registering...' : 'Register Store'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
