
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoAdminLoginProps {
  onAdminLogin: () => void;
  onBack: () => void;
}

export const DemoAdminLogin: React.FC<DemoAdminLoginProps> = ({ onAdminLogin, onBack }) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Demo admin credentials
  const DEMO_ADMIN = {
    username: 'admin',
    password: 'demo123'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === DEMO_ADMIN.username && 
        credentials.password === DEMO_ADMIN.password) {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin panel!",
      });
      onAdminLogin();
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials. Use: admin / demo123",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="bg-red-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-red-600 p-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-6 w-6" />
            <div>
              <CardTitle className="text-lg">Demo Admin Login</CardTitle>
              <p className="text-sm opacity-90">System Administrator</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-blue-800 text-sm font-medium">Demo Credentials:</p>
            <p className="text-blue-700 text-sm">Username: <code>admin</code></p>
            <p className="text-blue-700 text-sm">Password: <code>demo123</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter admin password"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Shield className="h-4 w-4 mr-2" />
              Login as Admin
            </Button>
          </form>

          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Demo mode - No real authentication required
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
