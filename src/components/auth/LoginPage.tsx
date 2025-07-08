import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, UserPlus, LogIn, Shield, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const { user, userRole, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  // Check for email confirmation on mount
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      
      if (type === 'email') {
        console.log('Email confirmation detected');
        setEmailConfirmed(true);
        toast({
          title: "Email Confirmed",
          description: "Your email has been successfully verified. You can now sign in.",
        });
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkEmailConfirmation();
  }, [toast]);

  // Redirect authenticated users based on their role
  useEffect(() => {
    console.log('Auth state in LoginPage:', { user: !!user, userRole, loading });
    
    if (user && !loading) {
      console.log('User is authenticated, redirecting...');
      
      // If user exists but no role, redirect to POS (they can set up later)
      if (!userRole) {
        console.log('User exists but no role, redirecting to POS');
        navigate('/pos', { replace: true });
      } else {
        // Auto-redirect based on role
        if (userRole.role === 'super_admin') {
          console.log('Redirecting super admin to /super-admin');
          navigate('/super-admin', { replace: true });
        } else if (['owner', 'admin', 'manager'].includes(userRole.role)) {
          console.log('Redirecting admin/manager to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Redirecting to /pos');
          navigate('/pos', { replace: true });
        }
      }
    }
  }, [user, userRole, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Attempting login...');
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      console.error('Login error:', error);
      if (error.includes('Email not confirmed') || error.includes('email not confirmed')) {
        setShowEmailConfirmation(true);
        toast({
          title: "Email Verification Required",
          description: "Please check your email and click the verification link before signing in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign In Error",
          description: error,
          variant: "destructive"
        });
      }
      setIsLoading(false);
    } else {
      console.log('Login successful, auth state will handle redirect');
    }
    // Don't set loading to false on success - let the auth flow handle it
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Attempting registration...');
    
    const { error } = await signUp(registerData.email, registerData.password, {
      store_name: registerData.storeName,
      owner_name: registerData.ownerName,
      phone: registerData.phone,
      address: registerData.address,
      kra_pin: registerData.kraPin,
      mpesa_paybill: registerData.mpesaPaybill
    });

    if (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: error,
        variant: "destructive"
      });
      setIsLoading(false);
    } else {
      console.log('Registration successful');
      setShowEmailConfirmation(true);
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account before signing in.",
      });
      setIsLoading(false);
    }
  };

  if (loading && !showEmailConfirmation && !emailConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
          {emailConfirmed ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600">Email Confirmed!</h3>
              <p className="text-gray-600 text-sm">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <Button 
                onClick={() => setEmailConfirmed(false)}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </div>
          ) : showEmailConfirmation ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent you a verification link. Please check your email and click the link to verify your account before signing in.
              </p>
              <Alert>
                <AlertDescription>
                  After clicking the verification link in your email, you can return here to sign in.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => setShowEmailConfirmation(false)}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
