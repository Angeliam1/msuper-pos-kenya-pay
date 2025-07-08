
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  transactions: any[];
  products: any[];
  customers: any[];
  lastSync: string;
}

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "Syncing offline data...",
      });
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Working Offline",
        description: "Data will be synced when connection is restored",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending sync data on mount
    checkPendingSyncData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = (key: string, data: any) => {
    try {
      const offlineData = getOfflineData();
      offlineData[key] = Array.isArray(offlineData[key]) ? [...offlineData[key], data] : [data];
      offlineData.lastSync = new Date().toISOString();
      
      localStorage.setItem('offline_data', JSON.stringify(offlineData));
      setPendingSyncCount(getTotalPendingItems(offlineData));
      
      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  };

  const getOfflineData = (): OfflineData => {
    try {
      const data = localStorage.getItem('offline_data');
      return data ? JSON.parse(data) : {
        transactions: [],
        products: [],
        customers: [],
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return {
        transactions: [],
        products: [],
        customers: [],
        lastSync: new Date().toISOString()
      };
    }
  };

  const getTotalPendingItems = (data: OfflineData) => {
    return data.transactions.length + data.products.length + data.customers.length;
  };

  const checkPendingSyncData = () => {
    const offlineData = getOfflineData();
    const pendingCount = getTotalPendingItems(offlineData);
    setPendingSyncCount(pendingCount);
    
    if (pendingCount > 0 && isOnline) {
      toast({
        title: "Pending Data Found",
        description: `${pendingCount} items waiting to sync`,
      });
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline) return;

    const offlineData = getOfflineData();
    const totalItems = getTotalPendingItems(offlineData);
    
    if (totalItems === 0) return;

    try {
      // Simulate API sync - replace with actual API calls
      console.log('Syncing offline data:', offlineData);
      
      // In a real implementation, you would:
      // 1. Send transactions to server
      // 2. Send new products to server
      // 3. Send new customers to server
      // 4. Handle conflicts and merge data
      
      // Clear offline data after successful sync
      localStorage.removeItem('offline_data');
      setPendingSyncCount(0);
      
      toast({
        title: "Sync Complete",
        description: `${totalItems} items synced successfully`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Will retry when connection is stable",
        variant: "destructive"
      });
    }
  };

  const cacheData = (key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  const getCachedData = (key: string, maxAge: number = 30 * 60 * 1000) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      return age < maxAge ? data : null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  return {
    isOnline,
    pendingSyncCount,
    saveOfflineData,
    getOfflineData,
    syncOfflineData,
    cacheData,
    getCachedData
  };
};
