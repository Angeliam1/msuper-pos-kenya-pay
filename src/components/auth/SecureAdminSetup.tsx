
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Crown, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useToast } from '@/hooks/use-toast';

interface SecureAdminSetupProps {
  onComplete: () => void;
}

export const SecureAdminSetup: React.FC<SecureAdminSetupProps> = ({ onComplete }) => {
  const { secureSignUp, validatePassword, loading, passwordRequirements } = useSecureAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    storeName: 'Super Admin Console',
    ownerName: 'System Administrator'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password);
    if (password.length === 0) return { strength: 0, color: 'gray', text: 'Enter password' };
    if (validation.isValid) return { strength: 4, color: 'green', text: 'Strong' };
    if (password.length >= 6) return { strength: 2, color: 'yellow', text: 'Medium' };
    return { strength: 1, color: 'red', text: 'Weak' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Administrator name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await secureSignUp(
      formData.email,
      formData.password,
      {
        storeName: formData.storeName,
        ownerName: formData.ownerName
      }
    );

    if (result.success) {
      toast({
        title: "Super Admin Created",
        description: "Super admin account has been created successfully. Please verify your email.",
      });
      onComplete();
    } else {
      setErrors({ submit: result.error || 'Failed to create super admin' });
      toast({
        title: "Setup Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-2xl">
        <CardHeader className="text-center bg-red-50 rounded-t-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-8 w-8 text-red-600" />
            <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full font-bold">
              SUPER ADMIN SETUP
            </span>
          </div>
          <CardTitle className="text-2xl text-red-800">System Administrator</CardTitle>
          <p className="text-sm text-red-600">Secure initial setup required</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              This is a one-time setup to create the system administrator account. 
              Use a strong password and keep these credentials secure.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Administrator Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yourcompany.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="ownerName">Administrator Name</Label>
              <Input
                id="ownerName"
                placeholder="System Administrator"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={errors.ownerName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
            </div>

            <div>
              <Label htmlFor="password">Master Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter a strong password"
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
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  
                  {/* Password requirements checklist */}
                  <div className="space-y-1">
                    {[
                      { check: formData.password.length >= passwordRequirements.minLength, text: `At least ${passwordRequirements.minLength} characters` },
                      { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                      { check: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
                      { check: /\d/.test(formData.password), text: 'One number' }
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.check ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={req.check ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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

            {errors.submit && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Creating Administrator...' : 'Create Super Admin Account'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              This account will have full system access. Store credentials securely.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
