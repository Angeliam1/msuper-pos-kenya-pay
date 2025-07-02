
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface RegistrationProps {
  onComplete: (userData: any) => void;
  onBack: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    adminEmail: '',
    password: '',
    pin: '',
    confirmPin: '',
    phone: '',
    currency: 'KES'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.storeName) newErrors.storeName = 'Store name is required';
    if (!formData.adminEmail) newErrors.adminEmail = 'Administrator email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.pin) newErrors.pin = 'PIN is required';
    if (formData.pin !== formData.confirmPin) newErrors.confirmPin = 'PINs do not match';
    if (formData.pin.length !== 4) newErrors.pin = 'PIN must be 4 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete(formData);
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
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">PRO</div>
            <CardTitle className="text-lg">Registration Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="Required"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                className={errors.storeName ? 'border-red-500' : ''}
              />
              {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
            </div>

            <div>
              <Label htmlFor="adminEmail">Administrator User ID (Email Address)</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="Required"
                value={formData.adminEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                className={errors.adminEmail ? 'border-red-500' : ''}
              />
              {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Required"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="pin">4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                placeholder="Required"
                value={formData.pin}
                onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                className={errors.pin ? 'border-red-500' : ''}
              />
              {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={4}
                placeholder="Required"
                value={formData.confirmPin}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, '') }))}
                className={errors.confirmPin ? 'border-red-500' : ''}
              />
              {errors.confirmPin && <p className="text-red-500 text-sm mt-1">{errors.confirmPin}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="phone">Mobile Phone (HP)</Label>
                <div className="flex">
                  <div className="bg-blue-50 px-3 py-2 border border-r-0 rounded-l-md text-sm">+254</div>
                  <Input
                    id="phone"
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
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

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Next
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
