import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Store, Save, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

interface StoreInformationProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const StoreInformation: React.FC<StoreInformationProps> = ({ settings, onSettingChange }) => {
  const { currentStore, updateStore } = useStore();
  const { toast } = useToast();

  // Initialize local state from current store
  const [localStoreInfo, setLocalStoreInfo] = useState({
    name: '',
    phone: '',
    address: '',
    managerId: ''
  });

  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when currentStore changes
  useEffect(() => {
    if (currentStore) {
      const newStoreInfo = {
        name: currentStore.name || '',
        phone: currentStore.phone || '',
        address: currentStore.address || '',
        managerId: currentStore.managerId || ''
      };
      setLocalStoreInfo(newStoreInfo);
      setHasUnsavedChanges(false);
    }
  }, [currentStore]);

  const handleStoreInfoChange = (field: string, value: string) => {
    setLocalStoreInfo(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!currentStore) return;
    
    try {
      await updateStore(currentStore.id, localStoreInfo);
      setHasUnsavedChanges(false);
      toast({
        title: "Store Updated",
        description: "Store information has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store information",
        variant: "destructive"
      });
    }
  };

  if (!currentStore) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Store className="mx-auto h-12 w-12 mb-4 text-gray-300" />
          <p className="text-gray-500">No store selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          {currentStore.name} - Store Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={localStoreInfo.name}
              onChange={(e) => handleStoreInfoChange('name', e.target.value)}
              placeholder="Enter store name"
            />
          </div>
          <div>
            <Label htmlFor="storePhone">Phone Number</Label>
            <Input
              id="storePhone"
              value={localStoreInfo.phone}
              onChange={(e) => handleStoreInfoChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>
        
        {/* Save Changes Button */}
        <Button 
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges}
          className="w-full"
          variant={hasUnsavedChanges ? "default" : "outline"}
        >
          <Save className="h-4 w-4 mr-2" />
          {hasUnsavedChanges ? "Save Changes" : "All Changes Saved"}
        </Button>
        
        <div>
          <Label htmlFor="storeAddress">Address</Label>
          <Input
            id="storeAddress"
            value={localStoreInfo.address}
            onChange={(e) => handleStoreInfoChange('address', e.target.value)}
            placeholder="Enter store address"
          />
        </div>
        <div>
          <Label htmlFor="storeManager">Manager ID</Label>
          <Input
            id="storeManager"
            value={localStoreInfo.managerId}
            onChange={(e) => handleStoreInfoChange('managerId', e.target.value)}
            placeholder="Enter manager ID"
          />
        </div>
        
        <Separator />
        
        <div>
          <Label htmlFor="kraPin">KRA PIN</Label>
          <Input
            id="kraPin"
            value={settings.kraPin || ''}
            onChange={(e) => onSettingChange('kraPin', e.target.value)}
            placeholder="P123456789A"
          />
        </div>
        
        <Separator />
        
        {/* Payment Options Sub-Setting */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Payment Options
              <ChevronRight className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Payment Options</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
                  <Input
                    id="mpesaPaybill"
                    value={settings.mpesaPaybill || ''}
                    onChange={(e) => onSettingChange('mpesaPaybill', e.target.value)}
                    placeholder="247247"
                  />
                </div>
                <div>
                  <Label htmlFor="mpesaAccount">M-Pesa Account</Label>
                  <Input
                    id="mpesaAccount"
                    value={settings.mpesaAccount || ''}
                    onChange={(e) => onSettingChange('mpesaAccount', e.target.value)}
                    placeholder="333337"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mpesaTill">M-Pesa Till Number</Label>
                  <Input
                    id="mpesaTill"
                    value={settings.mpesaTill || ''}
                    onChange={(e) => onSettingChange('mpesaTill', e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccount">Bank Account</Label>
                  <Input
                    id="bankAccount"
                    value={settings.bankAccount || ''}
                    onChange={(e) => onSettingChange('bankAccount', e.target.value)}
                    placeholder="Bank Account Details"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentInstructions">Payment Instructions</Label>
                <Textarea
                  id="paymentInstructions"
                  value={settings.paymentInstructions || ''}
                  onChange={(e) => onSettingChange('paymentInstructions', e.target.value)}
                  placeholder="Additional payment instructions..."
                  rows={3}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => onSettingChange('taxRate', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => onSettingChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="relative z-50 bg-white">
                <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
