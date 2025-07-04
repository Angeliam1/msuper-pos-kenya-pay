
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineStoreConfig {
  storeName: string;
  storeDescription: string;
  logo: string;
  theme: 'default' | 'dark' | 'blue' | 'green' | 'purple';
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  enableWhatsApp: boolean;
  whatsAppNumber: string;
  enableSMS: boolean;
  smsApiKey: string;
  paymentMethods: string[];
  deliveryOptions: string[];
  taxRate: number;
  enableInventoryTracking: boolean;
  lowStockAlert: number;
}

export const OnlineStoreSettings: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<OnlineStoreConfig>({
    storeName: 'Digital Den',
    storeDescription: 'Your trusted electronics store with quality products and excellent service',
    logo: '',
    theme: 'default',
    primaryColor: '#FF6B35',
    secondaryColor: '#2D5A87',
    contactEmail: 'info@digitalden.co.ke',
    contactPhone: '+254725333337',
    address: 'Nairobi, Kenya',
    currency: 'KES',
    enableWhatsApp: true,
    whatsAppNumber: '+254725333337',
    enableSMS: true,
    smsApiKey: '',
    paymentMethods: ['mpesa', 'cash', 'card'],
    deliveryOptions: ['pickup', 'delivery', 'express'],
    taxRate: 16,
    enableInventoryTracking: true,
    lowStockAlert: 10
  });

  const themes = [
    { value: 'default', label: 'Digital Den Orange', colors: { primary: '#FF6B35', secondary: '#2D5A87' } },
    { value: 'dark', label: 'Dark Mode', colors: { primary: '#1F2937', secondary: '#374151' } },
    { value: 'blue', label: 'Ocean Blue', colors: { primary: '#3B82F6', secondary: '#1E40AF' } },
    { value: 'green', label: 'Forest Green', colors: { primary: '#10B981', secondary: '#047857' } },
    { value: 'purple', label: 'Royal Purple', colors: { primary: '#8B5CF6', secondary: '#6D28D9' } }
  ];

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('onlineStoreConfig', JSON.stringify(config));
    toast({
      title: "Settings Saved",
      description: "Your online store settings have been updated successfully",
    });
  };

  const handleThemeChange = (themeValue: string) => {
    const theme = themes.find(t => t.value === themeValue);
    if (theme) {
      setConfig(prev => ({
        ...prev,
        theme: themeValue as any,
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Online Store Settings</h2>
          <p className="text-gray-600">Configure your online store appearance and functionality</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={config.storeName}
                onChange={(e) => setConfig(prev => ({ ...prev, storeName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={config.storeDescription}
                onChange={(e) => setConfig(prev => ({ ...prev, storeDescription: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={config.logo}
                onChange={(e) => setConfig(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={config.theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        {theme.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={config.contactPhone}
                onChange={(e) => setConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={config.address}
                onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableWhatsApp">WhatsApp Support</Label>
                <p className="text-sm text-gray-500">Enable WhatsApp chat widget</p>
              </div>
              <Switch
                id="enableWhatsApp"
                checked={config.enableWhatsApp}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableWhatsApp: checked }))}
              />
            </div>
            {config.enableWhatsApp && (
              <div>
                <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                <Input
                  id="whatsAppNumber"
                  value={config.whatsAppNumber}
                  onChange={(e) => setConfig(prev => ({ ...prev, whatsAppNumber: e.target.value }))}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableSMS">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Send order updates via SMS</p>
              </div>
              <Switch
                id="enableSMS"
                checked={config.enableSMS}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableSMS: checked }))}
              />
            </div>
            {config.enableSMS && (
              <div>
                <Label htmlFor="smsApiKey">SMS API Key</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={config.smsApiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, smsApiKey: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment & Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Payment Methods</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['mpesa', 'cash', 'card', 'bank'].map(method => (
                  <Badge
                    key={method}
                    variant={config.paymentMethods.includes(method) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const methods = config.paymentMethods.includes(method)
                        ? config.paymentMethods.filter(m => m !== method)
                        : [...config.paymentMethods, method];
                      setConfig(prev => ({ ...prev, paymentMethods: methods }));
                    }}
                  >
                    {method.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Delivery Options</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['pickup', 'delivery', 'express', 'nationwide'].map(option => (
                  <Badge
                    key={option}
                    variant={config.deliveryOptions.includes(option) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const options = config.deliveryOptions.includes(option)
                        ? config.deliveryOptions.filter(o => o !== option)
                        : [...config.deliveryOptions, option];
                      setConfig(prev => ({ ...prev, deliveryOptions: options }));
                    }}
                  >
                    {option.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={config.taxRate}
                onChange={(e) => setConfig(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Inventory Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableInventoryTracking">Inventory Tracking</Label>
                <p className="text-sm text-gray-500">Track stock levels automatically</p>
              </div>
              <Switch
                id="enableInventoryTracking"
                checked={config.enableInventoryTracking}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableInventoryTracking: checked }))}
              />
            </div>
            <div>
              <Label htmlFor="lowStockAlert">Low Stock Alert Level</Label>
              <Input
                id="lowStockAlert"
                type="number"
                value={config.lowStockAlert}
                onChange={(e) => setConfig(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div 
              className="bg-white rounded-lg p-4 shadow-sm"
              style={{ borderColor: config.primaryColor }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: config.primaryColor }}>
                  {config.storeName}
                </h3>
                <Button 
                  size="sm"
                  style={{ backgroundColor: config.primaryColor }}
                  className="text-white"
                >
                  Add to Cart
                </Button>
              </div>
              <div className="space-y-2">
                <div className="h-32 bg-gray-200 rounded"></div>
                <h4 className="font-medium">Sample Product</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: config.primaryColor }}>KES 25,000</span>
                  <span className="text-sm text-gray-500 line-through">KES 30,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
