
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface SecureRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}

export const SecureRegistration: React.FC<SecureRegistrationProps> = ({ onComplete, onBack }) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    currency: 'KES'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Store name validation
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.adminEmail) {
      newErrors.adminEmail = 'Administrator email is required';
    } else if (!emailRegex.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
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

    const { error } = await signUp(formData.adminEmail, formData.password, {
      storeName: formData.storeName,
      phone: formData.phone,
      currency: formData.currency
    });

    if (error) {
      setErrors({ submit: error });
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      onComplete();
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-red-600 p-1"
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">SECURE</div>
            <CardTitle className="text-lg">Secure Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                placeholder="Enter your store name"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className={errors.storeName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
            </div>

            <div>
              <Label htmlFor="adminEmail">Administrator Email *</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@yourstore.com"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className={errors.adminEmail ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, uppercase, lowercase, number"
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

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Mobile Phone</Label>
              <div className="flex">
                <div className="bg-blue-50 px-3 py-2 border border-r-0 rounded-l-md text-sm">+254</div>
                <Input
                  id="phone"
                  placeholder="712345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleInputChange('currency', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">Kenya Shilling (KES)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Secure Account'}
            </Button>
          </form>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Password must be at least 8 characters</p>
            <p>• Must contain uppercase, lowercase, and number</p>
            <p>• Email verification required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
