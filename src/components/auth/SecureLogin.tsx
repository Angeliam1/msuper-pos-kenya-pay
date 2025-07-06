
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, LogIn, Store, User } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface SecureLoginProps {
  onBack: () => void;
  userType?: 'store_owner' | 'worker';
}

export const SecureLogin: React.FC<SecureLoginProps> = ({ onBack, userType = 'store_owner' }) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setErrors({ submit: error });
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTitle = () => {
    return userType === 'worker' ? 'Employee Sign In' : 'Store Owner Sign In';
  };

  const getIcon = () => {
    return userType === 'worker' ? User : Store;
  };

  const getDescription = () => {
    return userType === 'worker' 
      ? 'Sign in with your employee credentials'
      : 'Access your store management system';
  };

  const getBgColor = () => {
    return userType === 'worker' ? 'bg-blue-500' : 'bg-green-500';
  };

  const IconComponent = getIcon();

  return (
    <div className={`min-h-screen ${getBgColor()} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-sm">
        <CardHeader className={`${getBgColor()} text-white rounded-t-lg`}>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-1"
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <IconComponent className="h-6 w-6" />
            <div>
              <CardTitle className="text-lg">{getTitle()}</CardTitle>
              <p className="text-sm opacity-90">{getDescription()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full ${getBgColor().replace('bg-', 'bg-').replace('-500', '-600')} hover:${getBgColor().replace('bg-', 'bg-').replace('-500', '-700')} text-white`}
              disabled={loading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            {userType === 'worker' 
              ? 'Contact your store manager if you need access'
              : 'Secure authentication with encrypted data storage'
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
