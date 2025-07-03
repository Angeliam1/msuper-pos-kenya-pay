
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from '@/types';
import { ArrowLeft, User, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, addCustomer } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface CustomerAuthProps {
  currentCustomer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
  onBack: () => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({
  currentCustomer,
  onCustomerChange,
  onBack,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [loginData, setLoginData] = useState({
    phone: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const registerMutation = useMutation({
    mutationFn: async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
      const result = await addCustomer(customerData);
      if (!result) {
        throw new Error('Failed to register customer');
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Account Created",
        description: "Your account has been created successfully"
      });
      onCustomerChange(data);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    // Find customer by phone number
    const customer = customers.find(c => c.phone === loginData.phone);
    
    if (customer) {
      onCustomerChange(customer);
      toast({
        title: "Welcome back!",
        description: `Hello ${customer.name}`
      });
    } else {
      toast({
        title: "Customer Not Found",
        description: "No account found with this phone number. Please register first.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name.trim() || !registerData.phone.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if customer already exists
    const existingCustomer = customers.find(c => c.phone === registerData.phone);
    if (existingCustomer) {
      toast({
        title: "Account Exists",
        description: "An account with this phone number already exists. Please login instead.",
        variant: "destructive"
      });
      return;
    }

    registerMutation.mutate({
      ...registerData,
      creditLimit: 0,
      outstandingBalance: 0,
      loyaltyPoints: 0,
    });
  };

  const handleLogout = () => {
    onCustomerChange(null);
    setLoginData({ phone: '' });
    setRegisterData({ name: '', phone: '', email: '', address: '' });
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  if (currentCustomer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium">{currentCustomer.name}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="font-medium">{currentCustomer.phone}</p>
              </div>
              {currentCustomer.email && (
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{currentCustomer.email}</p>
                </div>
              )}
              {currentCustomer.address && (
                <div>
                  <Label>Address</Label>
                  <p className="font-medium">{currentCustomer.address}</p>
                </div>
              )}
              <div>
                <Label>Loyalty Points</Label>
                <p className="font-medium text-primary">{currentCustomer.loyaltyPoints} points</p>
              </div>
              <div>
                <Label>Credit Limit</Label>
                <p className="font-medium">KES {currentCustomer.creditLimit.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="text-center mb-4">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Welcome Back</h2>
                <p className="text-gray-600">Login to your account</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-phone">Phone Number</Label>
                  <Input
                    id="login-phone"
                    type="tel"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({ phone: e.target.value })}
                    placeholder="0700 000 000"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="text-center mb-4">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Create Account</h2>
                <p className="text-gray-600">Join our store today</p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Full Name *</Label>
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({
                      ...registerData,
                      name: e.target.value
                    })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-phone">Phone Number *</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({
                      ...registerData,
                      phone: e.target.value
                    })}
                    placeholder="0700 000 000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-email">Email (Optional)</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({
                      ...registerData,
                      email: e.target.value
                    })}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-address">Address (Optional)</Label>
                  <Input
                    id="register-address"
                    value={registerData.address}
                    onChange={(e) => setRegisterData({
                      ...registerData,
                      address: e.target.value
                    })}
                    placeholder="Your address"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
