
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Store, Plus, Edit, MapPin, Package, ArrowRight, Users, Settings, Receipt, Building, CreditCard, Printer, Phone, Mail } from 'lucide-react';
import { StoreLocation, Product, Attendant } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

interface MultiStoreManagementProps {
  products?: Product[];
  attendants?: Attendant[];
  onImportProducts?: (fromStoreId: string, toStoreId: string, productIds: string[]) => void;
  onAssignStaff?: (attendantId: string, storeId: string) => void;
}

export const MultiStoreManagement: React.FC<MultiStoreManagementProps> = ({
  products = [],
  attendants = [],
  onImportProducts,
  onAssignStaff
}) => {
  const { stores, addStore, updateStore, getStoreProducts, currentStore, setCurrentStore } = useStore();
  const { toast } = useToast();
  
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phone: '',
    managerId: '',
    manager: '',
    status: 'active' as 'active' | 'inactive',
    totalSales: 0,
    isActive: true,
    createdAt: new Date()
  });

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showStoreSettings, setShowStoreSettings] = useState(false);
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [selectedStoreForSettings, setSelectedStoreForSettings] = useState<StoreLocation | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [fromStoreId, setFromStoreId] = useState('');
  const [toStoreId, setToStoreId] = useState('');
  const [selectedAttendant, setSelectedAttendant] = useState('');
  const [assignToStore, setAssignToStore] = useState('');

  // Complete store settings form state
  const [storeSettings, setStoreSettings] = useState({
    // Basic store info
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    kraPin: '',
    
    // Payment settings
    mpesaPaybill: '',
    mpesaAccount: '',
    mpesaTill: '',
    bankAccount: '',
    paymentInstructions: '',
    
    // Receipt settings
    receiptSettings: {
      header: '',
      footer: '',
      showLogo: true,
      showAddress: true,
      showPhone: true,
      size: '80mm' as '58mm' | '80mm',
      autoprint: false
    },
    
    // Pricing settings
    pricingSettings: {
      allowPriceBelowWholesale: false,
      defaultPriceType: 'retail' as 'retail' | 'wholesale',
      taxRate: 16
    }
  });

  const handleAddStore = () => {
    if (newStore.name && newStore.address) {
      addStore({
        name: newStore.name,
        address: newStore.address,
        phone: newStore.phone,
        managerId: newStore.managerId,
        manager: newStore.manager,
        status: newStore.status,
        totalSales: newStore.totalSales,
        isActive: newStore.isActive,
        createdAt: new Date()
      });
      setNewStore({
        name: '',
        address: '',
        phone: '',
        managerId: '',
        manager: '',
        status: 'active',
        totalSales: 0,
        isActive: true,
        createdAt: new Date()
      });
      setShowAddStoreDialog(false);
      toast({
        title: "Store Added",
        description: "New store has been added successfully.",
      });
    }
  };

  const handleImportProducts = () => {
    if (fromStoreId && toStoreId && selectedProducts.length > 0 && onImportProducts) {
      onImportProducts(fromStoreId, toStoreId, selectedProducts);
      setShowImportDialog(false);
      setSelectedProducts([]);
      setFromStoreId('');
      setToStoreId('');
    }
  };

  const handleAssignStaff = () => {
    if (selectedAttendant && assignToStore && onAssignStaff) {
      onAssignStaff(selectedAttendant, assignToStore);
      setShowStaffDialog(false);
      setSelectedAttendant('');
      setAssignToStore('');
    }
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const openStoreSettings = (store: StoreLocation) => {
    setSelectedStoreForSettings(store);
    setStoreSettings({
      name: store.name,
      address: store.address,
      phone: store.phone,
      email: '',
      manager: store.manager,
      kraPin: '',
      mpesaPaybill: '',
      mpesaAccount: '',
      mpesaTill: '',
      bankAccount: '',
      paymentInstructions: '',
      receiptSettings: {
        header: store.receiptSettings?.header || 'Thank you for shopping with us!',
        footer: store.receiptSettings?.footer || 'Visit us again soon!',
        showLogo: store.receiptSettings?.showLogo ?? true,
        showAddress: store.receiptSettings?.showAddress ?? true,
        showPhone: store.receiptSettings?.showPhone ?? true,
        size: store.receiptSettings?.size || '80mm',
        autoprint: store.receiptSettings?.autoprint ?? false
      },
      pricingSettings: store.pricingSettings || {
        allowPriceBelowWholesale: false,
        defaultPriceType: 'retail',
        taxRate: 16
      }
    });
    setShowStoreSettings(true);
  };

  const saveStoreSettings = () => {
    if (selectedStoreForSettings) {
      updateStore(selectedStoreForSettings.id, {
        name: storeSettings.name,
        address: storeSettings.address,
        phone: storeSettings.phone,
        manager: storeSettings.manager,
        receiptSettings: storeSettings.receiptSettings,
        pricingSettings: storeSettings.pricingSettings
      });
      setShowStoreSettings(false);
      setSelectedStoreForSettings(null);
      toast({
        title: "Store Settings Saved",
        description: "Store settings have been updated successfully.",
      });
    }
  };

  const handleStoreSelection = (storeId: string) => {
    const selected = stores.find(store => store.id === storeId);
    if (selected) {
      setCurrentStore(selected);
      toast({
        title: "Store Selected",
        description: `Now managing ${selected.name}`,
      });
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Store Management</h2>
        <div className="flex gap-2">
          <Dialog open={showAddStoreDialog} onOpenChange={setShowAddStoreDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Store Name</Label>
                    <Input
                      value={newStore.name}
                      onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <Label>Manager</Label>
                    <Input
                      value={newStore.manager}
                      onChange={(e) => setNewStore(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="Manager name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={newStore.address}
                    onChange={(e) => setNewStore(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Store address"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newStore.phone}
                    onChange={(e) => setNewStore(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <Button onClick={handleAddStore} className="w-full">
                  Add Store
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Import Products
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Import Products Between Stores</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Store</Label>
                    <Select value={fromStoreId} onValueChange={setFromStoreId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map(store => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Store</Label>
                    <Select value={toStoreId} onValueChange={setToStoreId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.filter(store => store.id !== fromStoreId).map(store => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {fromStoreId && toStoreId && (
                  <div>
                    <Label className="text-lg font-medium">Select Products to Import</Label>
                    <div className="max-h-60 overflow-y-auto border rounded-lg mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getStoreProducts(fromStoreId).map(product => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedProducts.includes(product.id)}
                                  onCheckedChange={(checked) => 
                                    handleProductSelection(product.id, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>{formatPrice(product.retailPrice)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImportProducts}
                    disabled={!fromStoreId || !toStoreId || selectedProducts.length === 0}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Import Selected Products
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Store Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Select Active Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label>Currently Managing:</Label>
            <Select value={currentStore?.id || ''} onValueChange={handleStoreSelection}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select a store to manage" />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <span>{store.name}</span>
                      <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                        {store.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentStore && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">{currentStore.name}</h4>
              <p className="text-blue-700">{currentStore.address}</p>
              <p className="text-sm text-blue-600">Products: {getStoreProducts(currentStore.id).length}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stores Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => (
              <Card key={store.id} className={`border-2 ${currentStore?.id === store.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                        {store.status || (store.isActive ? 'active' : 'inactive')}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{store.address}</span>
                      </div>
                      <p>Phone: {store.phone}</p>
                      <p>Manager: {store.manager || 'Not assigned'}</p>
                      <p className="font-semibold text-green-600">
                        Sales: {formatPrice(store.totalSales || 0)}
                      </p>
                      <p className="text-xs text-blue-600">
                        Products: {getStoreProducts(store.id).length}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openStoreSettings(store)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                      <Button 
                        size="sm" 
                        variant={currentStore?.id === store.id ? "default" : "outline"}
                        onClick={() => handleStoreSelection(store.id)}
                      >
                        {currentStore?.id === store.id ? 'Active' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Store Settings Dialog */}
      <Dialog open={showStoreSettings} onOpenChange={setShowStoreSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Store Settings - {selectedStoreForSettings?.name}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="receipt">Receipt</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Store Name</Label>
                    <Input
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Manager</Label>
                    <Input
                      value={storeSettings.manager}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, manager: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={storeSettings.phone}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>KRA PIN</Label>
                  <Input
                    value={storeSettings.kraPin}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, kraPin: e.target.value }))}
                    placeholder="P123456789A"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Options
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>M-Pesa Paybill</Label>
                    <Input
                      value={storeSettings.mpesaPaybill}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, mpesaPaybill: e.target.value }))}
                      placeholder="247247"
                    />
                  </div>
                  <div>
                    <Label>M-Pesa Account</Label>
                    <Input
                      value={storeSettings.mpesaAccount}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, mpesaAccount: e.target.value }))}
                      placeholder="333337"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>M-Pesa Till Number</Label>
                    <Input
                      value={storeSettings.mpesaTill}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, mpesaTill: e.target.value }))}
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <Label>Bank Account</Label>
                    <Input
                      value={storeSettings.bankAccount}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, bankAccount: e.target.value }))}
                      placeholder="Bank Account Details"
                    />
                  </div>
                </div>
                <div>
                  <Label>Payment Instructions</Label>
                  <Textarea
                    value={storeSettings.paymentInstructions}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, paymentInstructions: e.target.value }))}
                    placeholder="Additional payment instructions..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="receipt" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Receipt Configuration
                </h4>
                <div>
                  <Label>Receipt Header</Label>
                  <Textarea
                    value={storeSettings.receiptSettings.header}
                    onChange={(e) => setStoreSettings(prev => ({
                      ...prev,
                      receiptSettings: { ...prev.receiptSettings, header: e.target.value }
                    }))}
                    placeholder="Thank you for shopping with us!"
                  />
                </div>
                <div>
                  <Label>Receipt Footer</Label>
                  <Textarea
                    value={storeSettings.receiptSettings.footer}
                    onChange={(e) => setStoreSettings(prev => ({
                      ...prev,
                      receiptSettings: { ...prev.receiptSettings, footer: e.target.value }
                    }))}
                    placeholder="Visit us again soon!"
                  />
                </div>
                <div>
                  <Label>Receipt Size</Label>
                  <Select 
                    value={storeSettings.receiptSettings.size} 
                    onValueChange={(value: '58mm' | '80mm') => setStoreSettings(prev => ({
                      ...prev,
                      receiptSettings: { ...prev.receiptSettings, size: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showLogo"
                      checked={storeSettings.receiptSettings.showLogo}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        receiptSettings: { ...prev.receiptSettings, showLogo: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="showLogo">Show Logo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showAddress"
                      checked={storeSettings.receiptSettings.showAddress}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        receiptSettings: { ...prev.receiptSettings, showAddress: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="showAddress">Show Address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoprint"
                      checked={storeSettings.receiptSettings.autoprint}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        receiptSettings: { ...prev.receiptSettings, autoprint: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="autoprint">Auto Print Receipt</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Pricing Configuration</h4>
                <div>
                  <Label>Default Price Type</Label>
                  <Select 
                    value={storeSettings.pricingSettings.defaultPriceType} 
                    onValueChange={(value: 'retail' | 'wholesale') => setStoreSettings(prev => ({
                      ...prev,
                      pricingSettings: { ...prev.pricingSettings, defaultPriceType: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail Price</SelectItem>
                      <SelectItem value="wholesale">Wholesale Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={storeSettings.pricingSettings.taxRate}
                    onChange={(e) => setStoreSettings(prev => ({
                      ...prev,
                      pricingSettings: { ...prev.pricingSettings, taxRate: parseFloat(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowPriceBelowWholesale"
                    checked={storeSettings.pricingSettings.allowPriceBelowWholesale}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({
                      ...prev,
                      pricingSettings: { ...prev.pricingSettings, allowPriceBelowWholesale: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="allowPriceBelowWholesale">Allow Price Below Wholesale</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowStoreSettings(false)}>
              Cancel
            </Button>
            <Button onClick={saveStoreSettings}>
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
