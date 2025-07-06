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
import { Store, Plus, Edit, MapPin, Package, ArrowRight, Users, Settings, Receipt, Building, CreditCard, Printer, Phone, Mail, DollarSign } from 'lucide-react';
import { StoreLocation, Product, Attendant } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export const MultiStoreManagement: React.FC = () => {
  const { 
    stores, 
    addStore, 
    updateStore, 
    getStoreProducts, 
    getStoreCustomers,
    getStoreTransactions,
    getStoreCashBalance,
    currentStore, 
    setCurrentStore 
  } = useStore();
  const { toast } = useToast();
  
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phone: '',
    managerId: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    isActive: true,
    createdAt: new Date()
  });

  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [selectedStoreForDetails, setSelectedStoreForDetails] = useState<StoreLocation | null>(null);

  const handleAddStore = () => {
    if (newStore.name && newStore.address) {
      addStore({
        name: newStore.name,
        address: newStore.address,
        phone: newStore.phone,
        managerId: newStore.managerId,
        status: newStore.status,
        isActive: newStore.isActive,
        createdAt: new Date()
      });
      setNewStore({
        name: '',
        address: '',
        phone: '',
        managerId: '',
        status: 'active',
        isActive: true,
        createdAt: new Date()
      });
      setShowAddStoreDialog(false);
      toast({
        title: "Store Added",
        description: "New independent store has been created successfully.",
      });
    }
  };

  const handleStoreSelection = (storeId: string) => {
    const selected = stores.find(store => store.id === storeId);
    if (selected) {
      setCurrentStore(selected);
      toast({
        title: "Store Selected",
        description: `Now managing ${selected.name} with its independent data`,
      });
    }
  };

  const openStoreDetails = (store: StoreLocation) => {
    setSelectedStoreForDetails(store);
    setShowStoreDetails(true);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Independent Store Management</h2>
          <p className="text-gray-600">Each store operates independently with its own data</p>
        </div>
        <Dialog open={showAddStoreDialog} onOpenChange={setShowAddStoreDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Independent Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Independent Store</DialogTitle>
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
                    value={newStore.managerId}
                    onChange={(e) => setNewStore(prev => ({ ...prev, managerId: e.target.value }))}
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
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This store will be completely independent with its own:
                  products, customers, transactions, cash management, receipt settings, and printer configuration.
                </p>
              </div>
              <Button onClick={handleAddStore} className="w-full">
                Create Independent Store
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-blue-600">Products: </span>
                  <span className="font-semibold">{getStoreProducts(currentStore.id).length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Customers: </span>
                  <span className="font-semibold">{getStoreCustomers(currentStore.id).length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Transactions: </span>
                  <span className="font-semibold">{getStoreTransactions(currentStore.id).length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Cash: </span>
                  <span className="font-semibold">{formatPrice(getStoreCashBalance(currentStore.id))}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Independent Stores Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Independent Store Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => {
              const storeProducts = getStoreProducts(store.id);
              const storeCustomers = getStoreCustomers(store.id);
              const storeTransactions = getStoreTransactions(store.id);
              const storeCash = getStoreCashBalance(store.id);
              
              return (
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
                          <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                          <span>{store.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span>Manager ID: {store.managerId || 'Not assigned'}</span>
                        </div>
                      </div>
                      
                      {/* Independent Store Stats */}
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3 text-blue-500" />
                            <span>{storeProducts.length} Products</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-green-500" />
                            <span>{storeCustomers.length} Customers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Receipt className="h-3 w-3 text-purple-500" />
                            <span>{storeTransactions.length} Sales</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-orange-500" />
                            <span>{formatPrice(storeCash)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openStoreDetails(store)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Details
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Store Details Dialog */}
      <Dialog open={showStoreDetails} onOpenChange={setShowStoreDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStoreForDetails?.name} - Independent Store Details
            </DialogTitle>
          </DialogHeader>
          {selectedStoreForDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Store Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedStoreForDetails.name}</p>
                    <p><strong>Address:</strong> {selectedStoreForDetails.address}</p>
                    <p><strong>Phone:</strong> {selectedStoreForDetails.phone}</p>
                    <p><strong>Manager ID:</strong> {selectedStoreForDetails.managerId}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Independent Data</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Products:</strong> {getStoreProducts(selectedStoreForDetails.id).length}</p>
                    <p><strong>Customers:</strong> {getStoreCustomers(selectedStoreForDetails.id).length}</p>
                    <p><strong>Transactions:</strong> {getStoreTransactions(selectedStoreForDetails.id).length}</p>
                    <p><strong>Cash Balance:</strong> {formatPrice(getStoreCashBalance(selectedStoreForDetails.id))}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Independent Features</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Separate product inventory</li>
                  <li>✓ Independent customer database</li>
                  <li>✓ Own transaction history</li>
                  <li>✓ Separate cash management</li>
                  <li>✓ Individual receipt settings</li>
                  <li>✓ Independent printer configuration</li>
                  <li>✓ Separate SMS settings</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
