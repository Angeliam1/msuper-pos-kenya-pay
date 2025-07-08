
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionManager } from './SubscriptionManager';
import { StoreOverviewStats } from './store-admin/StoreOverviewStats';
import { StoreManagementTable } from './store-admin/StoreManagementTable';
import { AddStoreDialog } from './store-admin/AddStoreDialog';
import { StoreDetailsDialog } from './store-admin/StoreDetailsDialog';
import { RegistrationCodesPanel } from './store-admin/RegistrationCodesPanel';

export const SuperAdminStoreManager: React.FC = () => {
  const { stores, addStore, updateStore, getStoreProducts, getStoreCustomers, getStoreTransactions, getStoreCashBalance } = useStore();
  const { toast } = useToast();
  
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [registrationCodes, setRegistrationCodes] = useState<Record<string, string>>({});

  const generateRegistrationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleAddStore = (newStore: any) => {
    const regCode = generateRegistrationCode();
    const storeId = `store-${Date.now()}`;
    
    addStore({
      name: newStore.name,
      address: newStore.address,
      phone: newStore.phone,
      managerId: '',
      status: 'inactive',
      isActive: false,
      createdAt: new Date()
    });

    setRegistrationCodes(prev => ({
      ...prev,
      [storeId]: regCode
    }));
    
    toast({
      title: "Store Created",
      description: `Registration code generated: ${regCode}`,
    });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Super Admin - Store Management</h2>
          <p className="text-gray-600">Manage all stores, subscriptions, and generate registration codes</p>
        </div>
        <AddStoreDialog onAddStore={handleAddStore} />
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList>
          <TabsTrigger value="stores">All Stores</TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="codes">Registration Codes</TabsTrigger>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <StoreManagementTable
            stores={stores}
            getStoreProducts={getStoreProducts}
            getStoreCashBalance={getStoreCashBalance}
            onViewStoreDetails={viewStoreDetails}
            onToggleStoreStatus={handleToggleStoreStatus}
            onDeleteStore={handleDeleteStore}
          />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="codes">
          <RegistrationCodesPanel
            registrationCodes={registrationCodes}
            stores={stores}
            onCopyToClipboard={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="overview">
          <StoreOverviewStats
            stores={stores}
            getStoreProducts={getStoreProducts}
            getStoreCashBalance={getStoreCashBalance}
          />
        </TabsContent>
      </Tabs>

      <StoreDetailsDialog
        store={selectedStore}
        isOpen={showStoreDetails}
        onClose={() => setShowStoreDetails(false)}
        getStoreProducts={getStoreProducts}
        getStoreCustomers={getStoreCustomers}
        getStoreTransactions={getStoreTransactions}
        getStoreCashBalance={getStoreCashBalance}
      />
    </div>
  );
};
