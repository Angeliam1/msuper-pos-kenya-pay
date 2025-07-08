
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Wifi, WifiOff, RefreshCw, Scan, Gift, Printer, Store, Package } from 'lucide-react';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { useStore } from '@/contexts/StoreContext';

interface POSHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setShowBarcodeScanner: (show: boolean) => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setActiveTab,
  setShowBarcodeScanner
}) => {
  const { currentStore } = useStore();
  const { 
    isOnline, 
    pendingSyncCount, 
    syncOfflineData
  } = useOfflineSupport();

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">M-Super POS</h1>
          {currentStore && (
            <Badge variant="outline">{currentStore.name}</Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Offline Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
          
          {pendingSyncCount > 0 && (
            <Badge variant="secondary">
              {pendingSyncCount} pending
            </Badge>
          )}
        </div>

        {/* Sync Button */}
        {isOnline && pendingSyncCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={syncOfflineData}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Sync
          </Button>
        )}

        {/* Quick Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBarcodeScanner(true)}
        >
          <Scan className="h-4 w-4 mr-1" />
          Scanner
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('stores')}
        >
          <Store className="h-4 w-4 mr-1" />
          Stores
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('inventory')}
        >
          <Package className="h-4 w-4 mr-1" />
          Inventory
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('loyalty')}
        >
          <Gift className="h-4 w-4 mr-1" />
          Loyalty
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('printer')}
        >
          <Printer className="h-4 w-4 mr-1" />
          Print
        </Button>
      </div>
    </header>
  );
};
