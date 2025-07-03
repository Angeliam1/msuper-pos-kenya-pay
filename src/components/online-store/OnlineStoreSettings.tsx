
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Store, 
  CreditCard, 
  Truck, 
  Mail, 
  Palette,
  Settings,
  Shield,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OnlineStoreSettings: React.FC = () => {
  const { toast } = useToast();

  // Mock store settings
  const [storeSettings, setStoreSettings] = useState({
    // Store Information
    storeName: 'Digital Den Electronics',
    storeDescription: 'Your trusted online electronics store in Kenya',
    domain: 'www.digitalden.co.ke',
    contactEmail: 'info@digitalden.co.ke',
    contactPhone: '+254 700 000 000',
    address: 'Westlands, Nairobi, Kenya',
    
    // Business Settings
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    taxRate: 16, // VAT percentage
    
    // Shipping
    freeShippingThreshold: 2000,
    standardShippingFee: 200,
    expressShippingFee: 500,
    
    // Payment
    mpesaEnabled: true,
    mpesaPaybill: '174379',
    mpesaAccount: '9951109',
    cardPaymentsEnabled: false,
    
    // Notifications
    orderNotifications: true,
    lowStockAlerts: true,
    emailNotifications: true,
    smsNotifications: true,
    
    // Store Status
    storeActive: true,
    maintenanceMode: false,
    maintenanceMessage: 'Store is temporarily under maintenance. Please check back soon!'
  });

  const handleSaveSettings = () => {
    // Save settings logic would go here
    toast({
      title: "Settings Saved",
      description: "Your store settings have been updated successfully",
    });
  };

  const handleToggleSetting = (key: string) => {
    setStoreSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleInputChange = (key: string, value: string | number) => {
    setStoreSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
          <p className="text-gray-600">Configure your online store settings</p>
        </div>
        <Button onClick={handleSaveSettings}>
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={storeSettings.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={storeSettings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={storeSettings.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={storeSettings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={storeSettings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={storeSettings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taxRate">VAT Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">M-Pesa Payments</h4>
                    <p className="text-sm text-gray-500">Accept M-Pesa payments from customers</p>
                  </div>
                  <Switch
                    checked={storeSettings.mpesaEnabled}
                    onCheckedChange={() => handleToggleSetting('mpesaEnabled')}
                  />
                </div>

                {storeSettings.mpesaEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-green-200">
                    <div>
                      <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
                      <Input
                        id="mpesaPaybill"
                        value={storeSettings.mpesaPaybill}
                        onChange={(e) => handleInputChange('mpesaPaybill', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mpesaAccount">Account Number</Label>
                      <Input
                        id="mpesaAccount"
                        value={storeSettings.mpesaAccount}
                        onChange={(e) => handleInputChange('mpesaAccount', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Card Payments</h4>
                    <p className="text-sm text-gray-500">Accept credit/debit card payments</p>
                  </div>
                  <Switch
                    checked={storeSettings.cardPaymentsEnabled}
                    onCheckedChange={() => handleToggleSetting('cardPaymentsEnabled')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KES)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value))}
                />
                <p className="text-sm text-gray-500 mt-1">Orders above this amount get free shipping</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="standardShippingFee">Standard Shipping Fee (KES)</Label>
                  <Input
                    id="standardShippingFee"
                    type="number"
                    value={storeSettings.standardShippingFee}
                    onChange={(e) => handleInputChange('standardShippingFee', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="expressShippingFee">Express Shipping Fee (KES)</Label>
                  <Input
                    id="expressShippingFee"
                    type="number"
                    value={storeSettings.expressShippingFee}
                    onChange={(e) => handleInputChange('expressShippingFee', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    checked={storeSettings.orderNotifications}
                    onCheckedChange={() => handleToggleSetting('orderNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-500">Get alerts when products are running low</p>
                  </div>
                  <Switch
                    checked={storeSettings.lowStockAlerts}
                    onCheckedChange={() => handleToggleSetting('lowStockAlerts')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={storeSettings.emailNotifications}
                    onCheckedChange={() => handleToggleSetting('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={storeSettings.smsNotifications}
                    onCheckedChange={() => handleToggleSetting('smsNotifications')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Store Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Store theme and appearance settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Store Active</h4>
                    <p className="text-sm text-gray-500">Your store is live and accepting orders</p>
                  </div>
                  <Switch
                    checked={storeSettings.storeActive}
                    onCheckedChange={() => handleToggleSetting('storeActive')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500">Temporarily disable the store for maintenance</p>
                  </div>
                  <Switch
                    checked={storeSettings.maintenanceMode}
                    onCheckedChange={() => handleToggleSetting('maintenanceMode')}
                  />
                </div>

                {storeSettings.maintenanceMode && (
                  <div className="pl-4 border-l-2 border-yellow-200">
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={storeSettings.maintenanceMessage}
                      onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
