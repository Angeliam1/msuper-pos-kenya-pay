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
import { Store, Plus, Edit, MapPin, Package, ArrowRight, Users } from 'lucide-react';
import { StoreLocation, Product, Attendant } from '@/types';

interface MultiStoreManagementProps {
  stores?: StoreLocation[];
  products?: Product[];
  attendants?: Attendant[];
  onAddStore?: (store: Omit<StoreLocation, 'id'>) => void;
  onUpdateStore?: (id: string, store: Partial<StoreLocation>) => void;
  onImportProducts?: (fromStoreId: string, toStoreId: string, productIds: string[]) => void;
  onAssignStaff?: (attendantId: string, storeId: string) => void;
}

export const MultiStoreManagement: React.FC<MultiStoreManagementProps> = ({
  stores = [],
  products = [],
  attendants = [],
  onAddStore,
  onUpdateStore,
  onImportProducts,
  onAssignStaff
}) => {
  const [defaultStores] = useState<StoreLocation[]>([
    {
      id: '1',
      name: 'Main Branch',
      address: 'Githunguri Town, Main Market',
      phone: '0725333337',
      managerId: '1',  // Use managerId instead of manager
      manager: 'John Kamau',  // Keep for display
      status: 'active',
      totalSales: 450000,
      isActive: true,  // Required property
      createdAt: new Date()  // Required property
    }
  ]);

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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [fromStoreId, setFromStoreId] = useState('');
  const [toStoreId, setToStoreId] = useState('');
  const [selectedAttendant, setSelectedAttendant] = useState('');
  const [assignToStore, setAssignToStore] = useState('');

  const allStores = stores.length > 0 ? stores : defaultStores;

  const handleAddStore = () => {
    if (newStore.name && newStore.address && onAddStore) {
      onAddStore({
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

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Multi-Store Management</h2>
        <div className="flex gap-2">
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
                        {allStores.map(store => (
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
                        {allStores.filter(store => store.id !== fromStoreId).map(store => (
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
                          {products.map(product => (
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
                              <TableCell>{formatPrice(product.price)}</TableCell>
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

          <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Assign Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Staff to Store</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Staff Member</Label>
                  <Select value={selectedAttendant} onValueChange={setSelectedAttendant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {attendants.map(attendant => (
                        <SelectItem key={attendant.id} value={attendant.id}>
                          {attendant.name} - {attendant.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assign to Store</Label>
                  <Select value={assignToStore} onValueChange={setAssignToStore}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStores.map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowStaffDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAssignStaff}
                    disabled={!selectedAttendant || !assignToStore}
                  >
                    Assign Staff
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStores.map(store => (
              <Card key={store.id} className="border-2">
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
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
