
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Store, Package, Users, Truck, Receipt, Plus, Edit, Trash2, Eye, ChevronRight, Save } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

interface StoreSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ settings, onSettingChange }) => {
  const { 
    currentStore, 
    updateStore, 
    getStoreProducts, 
    addProductToStore,
    getStoreCustomers,
    getStoreSuppliers,
    addSupplierToStore,
    getStoreTransactions
  } = useStore();
  const { toast } = useToast();

  const [showQuickAddProduct, setShowQuickAddProduct] = useState(false);
  const [quickProduct, setQuickProduct] = useState({
    name: '',
    category: '',
    buyingCost: 0,
    retailPrice: 0,
    stock: 0,
    description: ''
  });

  // Initialize local state from current store
  const [localStoreInfo, setLocalStoreInfo] = useState({
    name: '',
    phone: '',
    address: '',
    manager: ''
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
        manager: currentStore.manager || ''
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

  const handleQuickAddProduct = () => {
    if (!currentStore || !quickProduct.name || !quickProduct.retailPrice) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and price)",
        variant: "destructive"
      });
      return;
    }

    addProductToStore(currentStore.id, {
      name: quickProduct.name,
      category: quickProduct.category || 'General',
      buyingCost: quickProduct.buyingCost,
      wholesalePrice: quickProduct.buyingCost,
      retailPrice: quickProduct.retailPrice,
      price: quickProduct.retailPrice,
      stock: quickProduct.stock,
      supplierId: '',
      description: quickProduct.description,
      barcode: `${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setQuickProduct({
      name: '',
      category: '',
      buyingCost: 0,
      retailPrice: 0,
      stock: 0,
      description: ''
    });
    setShowQuickAddProduct(false);
    
    toast({
      title: "Product Added",
      description: `${quickProduct.name} has been added to ${currentStore.name}`,
    });
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

  const storeProducts = getStoreProducts(currentStore.id);
  const storeCustomers = getStoreCustomers(currentStore.id);
  const storeSuppliers = getStoreSuppliers(currentStore.id);
  const storeTransactions = getStoreTransactions(currentStore.id);

  return (
    <div className="w-full space-y-6">
      {/* Store Information */}
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
            <Label htmlFor="storeManager">Manager</Label>
            <Input
              id="storeManager"
              value={localStoreInfo.manager}
              onChange={(e) => handleStoreInfoChange('manager', e.target.value)}
              placeholder="Enter manager name"
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

      {/* Products Management */}
      <Sheet>
        <SheetTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products ({storeProducts.length})
                </div>
                <ChevronRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Store Products ({storeProducts.length})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog open={showQuickAddProduct} onOpenChange={setShowQuickAddProduct}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="relative z-50 bg-white">
                  <DialogHeader>
                    <DialogTitle>Quick Add Product to {currentStore.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        value={quickProduct.name}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={quickProduct.category}
                          onChange={(e) => setQuickProduct(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Product category"
                        />
                      </div>
                      <div>
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          value={quickProduct.stock}
                          onChange={(e) => setQuickProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Buying Cost</Label>
                        <Input
                          type="number"
                          value={quickProduct.buyingCost}
                          onChange={(e) => setQuickProduct(prev => ({ ...prev, buyingCost: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label>Retail Price *</Label>
                        <Input
                          type="number"
                          value={quickProduct.retailPrice}
                          onChange={(e) => setQuickProduct(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={quickProduct.description}
                        onChange={(e) => setQuickProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleQuickAddProduct} className="w-full">
                      Add Product to Store
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {storeProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No products in this store yet</p>
                <Button onClick={() => setShowQuickAddProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock < 10 ? "destructive" : "default"}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>KES {product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Other sections following the same pattern */}
      <Sheet>
        <SheetTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customers ({storeCustomers.length})
                </div>
                <ChevronRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Store Customers ({storeCustomers.length})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {storeCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-gray-500">No customers registered for this store yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead>Outstanding Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeCustomers.filter(c => c.id !== 'walk-in').map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.loyaltyPoints}</TableCell>
                      <TableCell>
                        <Badge variant={customer.outstandingBalance > 0 ? "destructive" : "default"}>
                          KES {customer.outstandingBalance.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Suppliers ({storeSuppliers.length})
                </div>
                <ChevronRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Store Suppliers ({storeSuppliers.length})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {storeSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-gray-500">No suppliers added for this store yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeSuppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Sales History ({storeTransactions.length})
                </div>
                <ChevronRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Store Transactions ({storeTransactions.length})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {storeTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-gray-500">No transactions recorded for this store yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeTransactions.slice(0, 10).map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.timestamp.toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.items.length} items</TableCell>
                      <TableCell>KES {transaction.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
