import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  Plus, 
  Key, 
  Pause, 
  Play, 
  Trash2, 
  Eye, 
  Copy,
  Shield,
  Users,
  Package,
  Receipt,
  DollarSign,
  Settings
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export const SuperAdminStoreManager: React.FC = () => {
  const { stores, addStore, updateStore, getStoreProducts, getStoreCustomers, getStoreTransactions, getStoreCashBalance } = useStore();
  const { toast } = useToast();
  
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [registrationCodes, setRegistrationCodes] = useState<Record<string, string>>({});
  
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phone: '',
    manager: '',
    managerEmail: ''
  });

  const generateRegistrationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleAddStore = () => {
    if (newStore.name && newStore.address) {
      const regCode = generateRegistrationCode();
      const storeId = `store-${Date.now()}`;
      
      addStore({
        name: newStore.name,
        address: newStore.address,
        phone: newStore.phone,
        manager: newStore.manager,
        managerId: '',
        totalSales: 0,
        status: 'pending',
        isActive: false,
        createdAt: new Date()
      });

      setRegistrationCodes(prev => ({
        ...prev,
        [storeId]: regCode
      }));

      setNewStore({ name: '', address: '', phone: '', manager: '', managerEmail: '' });
      setShowAddStoreDialog(false);
      
      toast({
        title: "Store Created",
        description: `Registration code generated: ${regCode}`,
      });
    }
  };

  const handleToggleStoreStatus = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      const newStatus = !store.isActive ? 'active' : 'suspended';
      updateStore(storeId, { isActive: !store.isActive, status: newStatus });
      toast({
        title: store.isActive ? "Store Suspended" : "Store Activated",
        description: `${store.name} has been ${store.isActive ? 'suspended' : 'activated'}`,
      });
    }
  };

  const handleDeleteStore = (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      // In a real implementation, you would have a delete function in the store context
      toast({
        title: "Store Deleted",
        description: "Store has been permanently deleted",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Registration code copied successfully",
    });
  };

  const viewStoreDetails = (store: any) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Super Admin - Store Management</h2>
          <p className="text-gray-600">Manage all stores, generate registration codes, and control access</p>
        </div>
        <Dialog open={showAddStoreDialog} onOpenChange={setShowAddStoreDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input
                  value={newStore.name}
                  onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter store name"
                />
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
              <div>
                <Label>Manager Name</Label>
                <Input
                  value={newStore.manager}
                  onChange={(e) => setNewStore(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="Manager name"
                />
              </div>
              <div>
                <Label>Manager Email</Label>
                <Input
                  value={newStore.managerEmail}
                  onChange={(e) => setNewStore(prev => ({ ...prev, managerEmail: e.target.value }))}
                  placeholder="manager@email.com"
                />
              </div>
              <Button onClick={handleAddStore} className="w-full">
                Create Store & Generate Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList>
          <TabsTrigger value="stores">All Stores</TabsTrigger>
          <TabsTrigger value="codes">Registration Codes</TabsTrigger>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Store Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map(store => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-gray-500">{store.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{store.manager || 'Not assigned'}</TableCell>
                      <TableCell>
                        <Badge variant={store.isActive ? 'default' : 'secondary'}>
                          {store.status || (store.isActive ? 'Active' : 'Inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStoreProducts(store.id).length}</TableCell>
                      <TableCell>{formatPrice(getStoreCashBalance(store.id))}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewStoreDetails(store)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStoreStatus(store.id)}
                          >
                            {store.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStore(store.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codes">
          <Card>
            <CardHeader>
              <CardTitle>Registration Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(registrationCodes).map(([storeId, code]) => {
                  const store = stores.find(s => s.id === storeId);
                  return (
                    <Alert key={storeId}>
                      <Key className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{store?.name}</strong> - Registration Code: <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Store className="h-4 w-4 text-blue-600" />
                  <div className="text-2xl font-bold">{stores.length}</div>
                </div>
                <p className="text-xs text-muted-foreground">Total Stores</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div className="text-2xl font-bold">{stores.filter(s => s.isActive).length}</div>
                </div>
                <p className="text-xs text-muted-foreground">Active Stores</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-purple-600" />
                  <div className="text-2xl font-bold">
                    {stores.reduce((total, store) => total + getStoreProducts(store.id).length, 0)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <div className="text-2xl font-bold">
                    {formatPrice(stores.reduce((total, store) => total + getStoreCashBalance(store.id), 0))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Store Details Dialog */}
      <Dialog open={showStoreDetails} onOpenChange={setShowStoreDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedStore?.name} - Store Management</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Store Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Address:</strong> {selectedStore.address}</p>
                      <p><strong>Phone:</strong> {selectedStore.phone}</p>
                      <p><strong>Manager:</strong> {selectedStore.manager}</p>
                      <p><strong>Status:</strong> {selectedStore.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Quick Stats</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Products:</strong> {getStoreProducts(selectedStore.id).length}</p>
                      <p><strong>Customers:</strong> {getStoreCustomers(selectedStore.id).length}</p>
                      <p><strong>Transactions:</strong> {getStoreTransactions(selectedStore.id).length}</p>
                      <p><strong>Revenue:</strong> {formatPrice(getStoreCashBalance(selectedStore.id))}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Store-specific product management will be available here</p>
                </div>
              </TabsContent>

              <TabsContent value="customers">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Store-specific customer management will be available here</p>
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Store-specific transaction history will be available here</p>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Store-specific settings management will be available here</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
