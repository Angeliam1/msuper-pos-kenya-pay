
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, Edit, MapPin } from 'lucide-react';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  totalSales: number;
}

export const MultiStoreManagement: React.FC = () => {
  const [stores, setStores] = useState<StoreLocation[]>([
    {
      id: '1',
      name: 'Main Branch',
      address: 'Githunguri Town, Main Market',
      phone: '0725333337',
      manager: 'John Kamau',
      status: 'active',
      totalSales: 450000
    }
  ]);

  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phone: '',
    manager: ''
  });

  const handleAddStore = () => {
    if (newStore.name && newStore.address) {
      const store: StoreLocation = {
        id: Date.now().toString(),
        ...newStore,
        status: 'active',
        totalSales: 0
      };
      setStores(prev => [...prev, store]);
      setNewStore({ name: '', address: '', phone: '', manager: '' });
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
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
              <Card key={store.id} className="border-2">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                        {store.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{store.address}</span>
                      </div>
                      <p>Phone: {store.phone}</p>
                      <p>Manager: {store.manager}</p>
                      <p className="font-semibold text-green-600">
                        Sales: {formatPrice(store.totalSales)}
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
