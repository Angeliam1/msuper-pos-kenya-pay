
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { useSecureAttendantAuth } from '@/hooks/useSecureAttendantAuth';
import { SecurityUtils } from '@/utils/security';

interface SecureLoginFormProps {
  onSuccess: (attendant: any) => void;
  showRegistration?: boolean;
}

export const SecureLoginForm: React.FC<SecureLoginFormProps> = ({ 
  onSuccess, 
  showRegistration = false 
}) => {
  const { authenticateAttendant, createAttendant, loading, lockedUntil } = useSecureAttendantAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Client-side validation
    const errors: string[] = [];
    if (!SecurityUtils.validateEmail(loginData.email)) {
      errors.push('Invalid email format');
    }
    if (!loginData.password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await authenticateAttendant(loginData.email, loginData.password);
    
    if (result.success && result.attendant) {
      onSuccess(result.attendant);
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Client-side validation
    const errors: string[] = [];
    
    if (!registerData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!SecurityUtils.validateEmail(registerData.email)) {
      errors.push('Invalid email format');
    }
    
    if (registerData.phone && !SecurityUtils.validatePhone(registerData.phone)) {
      errors.push('Invalid phone number format');
    }
    
    const passwordValidation = SecurityUtils.validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await createAttendant({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password
    });

    if (result.success && result.attendant) {
      onSuccess(result.attendant);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const isAccountLocked = lockedUntil && lockedUntil > new Date();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle>Secure POS Access</CardTitle>
        <p className="text-sm text-gray-600">
          Enhanced security with encrypted authentication
        </p>
      </CardHeader>

      <CardContent>
        {showRegistration && (
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(true)}
                disabled={loading}
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(false)}
                disabled={loading}
              >
                Register
              </Button>
            </div>
          </div>
        )}

        {isAccountLocked && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Account is locked until {lockedUntil.toLocaleString()} due to multiple failed login attempts.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationErrors.length > 0 && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ 
                  ...prev, 
                  email: SecurityUtils.sanitizeHtml(e.target.value) 
                }))}
                placeholder="Enter your email"
                disabled={loading || isAccountLocked}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                  placeholder="Enter your password"
                  disabled={loading || isAccountLocked}
                  required
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || isAccountLocked}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ 
                  ...prev, 
                  name: SecurityUtils.sanitizeHtml(e.target.value) 
                }))}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="regEmail">Email</Label>
              <Input
                id="regEmail"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ 
                  ...prev, 
                  email: SecurityUtils.sanitizeHtml(e.target.value) 
                }))}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={registerData.phone}
                onChange={(e) => setRegisterData(prev => ({ 
                  ...prev, 
                  phone: SecurityUtils.sanitizeHtml(e.target.value) 
                }))}
                placeholder="+254..."
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="regPassword">Password</Label>
              <div className="relative">
                <Input
                  id="regPassword"
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                  placeholder="Create a secure password"
                  disabled={loading}
                  required
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
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData(prev => ({ 
                  ...prev, 
                  confirmPassword: e.target.value 
                }))}
                placeholder="Confirm your password"
                disabled={loading}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Secure Account'}
            </Button>
          </form>
        )}

        <div className="text-xs text-center text-gray-500 pt-4 border-t mt-4">
          <Shield className="h-3 w-3 inline mr-1" />
          Protected by enterprise-grade security
        </div>
      </CardContent>
    </Card>
  );
};
