
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Store, Package, Users, Truck, Receipt, Plus, Edit, Trash2, Eye } from 'lucide-react';
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

  const handleStoreInfoUpdate = (field: string, value: string) => {
    if (currentStore) {
      updateStore(currentStore.id, { [field]: value });
      toast({
        title: "Store Updated",
        description: `${field} has been updated successfully`,
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
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="info">Store Info</TabsTrigger>
        <TabsTrigger value="products">Products ({storeProducts.length})</TabsTrigger>
        <TabsTrigger value="customers">Customers ({storeCustomers.length})</TabsTrigger>
        <TabsTrigger value="suppliers">Suppliers ({storeSuppliers.length})</TabsTrigger>
        <TabsTrigger value="transactions">Sales ({storeTransactions.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
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
                  value={currentStore.name}
                  onChange={(e) => handleStoreInfoUpdate('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  value={currentStore.phone}
                  onChange={(e) => handleStoreInfoUpdate('phone', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                value={currentStore.address}
                onChange={(e) => handleStoreInfoUpdate('address', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storeManager">Manager</Label>
              <Input
                id="storeManager"
                value={currentStore.manager}
                onChange={(e) => handleStoreInfoUpdate('manager', e.target.value)}
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
            
            <div className="space-y-4">
              <h4 className="font-medium">Payment Options</h4>
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
                  <SelectContent>
                    <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Store Products ({storeProducts.length})
              </CardTitle>
              <Dialog open={showQuickAddProduct} onOpenChange={setShowQuickAddProduct}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customers">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Store Customers ({storeCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="suppliers">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Store Suppliers ({storeSuppliers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Store Transactions ({storeTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
