
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Eye,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export const AdvancedMultiStoreDashboard: React.FC = () => {
  const { 
    stores, 
    currentStore, 
    switchStore,
    getStoreProducts, 
    getStoreTransactions, 
    getStoreCustomers,
    getStoreCashBalance 
  } = useStore();
  
  const { toast } = useToast();
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');

  const getStoreMetrics = (storeId: string) => {
    const products = getStoreProducts(storeId);
    const transactions = getStoreTransactions(storeId);
    const customers = getStoreCustomers(storeId);
    const totalRevenue = getStoreCashBalance(storeId);

    const today = new Date();
    const todayTransactions = transactions.filter(t => 
      new Date(t.timestamp).toDateString() === today.toDateString()
    );
    
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5));
    
    return {
      totalProducts: products.length,
      totalCustomers: customers.length,
      totalTransactions: transactions.length,
      totalRevenue,
      todayRevenue,
      todayTransactions: todayTransactions.length,
      lowStockCount: lowStockProducts.length,
      activeProducts: products.filter(p => p.stock > 0).length,
      avgTransactionValue: transactions.length ? totalRevenue / transactions.length : 0
    };
  };

  const getStoreStatus = (store: any) => {
    const metrics = getStoreMetrics(store.id);
    if (metrics.lowStockCount > 5) return { status: 'warning', color: 'bg-yellow-500' };
    if (metrics.totalProducts === 0) return { status: 'inactive', color: 'bg-gray-500' };
    if (metrics.todayRevenue > 0) return { status: 'active', color: 'bg-green-500' };
    return { status: 'idle', color: 'bg-blue-500' };
  };

  const handleStoreSwitch = (storeId: string) => {
    switchStore(storeId);
    toast({
      title: "Store Switched",
      description: `Now managing ${stores.find(s => s.id === storeId)?.name}`,
    });
  };

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const totalSystemMetrics = stores.reduce((acc, store) => {
    const metrics = getStoreMetrics(store.id);
    return {
      totalStores: acc.totalStores + 1,
      totalRevenue: acc.totalRevenue + metrics.totalRevenue,
      totalProducts: acc.totalProducts + metrics.totalProducts,
      totalCustomers: acc.totalCustomers + metrics.totalCustomers,
      totalTransactions: acc.totalTransactions + metrics.totalTransactions,
      todayRevenue: acc.todayRevenue + metrics.todayRevenue
    };
  }, {
    totalStores: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalTransactions: 0,
    todayRevenue: 0
  });

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stores</p>
                <p className="text-2xl font-bold">{totalSystemMetrics.totalStores}</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSystemMetrics.totalRevenue)}</p>
                <p className="text-xs text-green-600">Today: {formatCurrency(totalSystemMetrics.todayRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{totalSystemMetrics.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{totalSystemMetrics.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList>
          <TabsTrigger value="stores">Store Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Store Management</h3>
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => {
              const metrics = getStoreMetrics(store.id);
              const status = getStoreStatus(store);
              const isCurrentStore = currentStore?.id === store.id;

              return (
                <Card key={store.id} className={`transition-all hover:shadow-md ${isCurrentStore ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        {isCurrentStore && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStore(store);
                          setShowStoreDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {store.address}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Today's Sales</p>
                        <p className="font-semibold text-green-600">{formatCurrency(metrics.todayRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Transactions</p>
                        <p className="font-semibold">{metrics.todayTransactions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Products</p>
                        <p className="font-semibold">{metrics.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Customers</p>
                        <p className="font-semibold">{metrics.totalCustomers}</p>
                      </div>
                    </div>

                    {metrics.lowStockCount > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          {metrics.lowStockCount} low stock items
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {!isCurrentStore && (
                        <Button
                          size="sm"
                          onClick={() => handleStoreSwitch(store.id)}
                          className="flex-1"
                        >
                          Switch to Store
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map(store => {
              const metrics = getStoreMetrics(store.id);
              const revenueProgress = totalSystemMetrics.totalRevenue > 0 
                ? (metrics.totalRevenue / totalSystemMetrics.totalRevenue) * 100 
                : 0;

              return (
                <Card key={store.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {store.name}
                      {metrics.todayRevenue > metrics.avgTransactionValue && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Contribution</span>
                        <span>{revenueProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={revenueProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600">Avg. Transaction</p>
                        <p className="font-semibold text-sm">{formatCurrency(metrics.avgTransactionValue)}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-600">Active Products</p>
                        <p className="font-semibold text-sm">{metrics.activeProducts}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <p className="text-xs text-gray-600">Customer Base</p>
                        <p className="font-semibold text-sm">{metrics.totalCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stores.filter(store => getStoreMetrics(store.id).lowStockCount > 0).map(store => {
                  const metrics = getStoreMetrics(store.id);
                  return (
                    <div key={store.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-gray-600">{metrics.lowStockCount} products low on stock</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  );
                })}
                
                {stores.filter(store => getStoreMetrics(store.id).lowStockCount === 0).length === stores.length && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No alerts at this time</p>
                    <p className="text-sm">All stores are operating normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Store Details Modal */}
      <Dialog open={showStoreDetails} onOpenChange={setShowStoreDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedStore?.name} - Store Details</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedStore.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedStore.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedStore.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Store Status</h4>
                  <div className="space-y-2">
                    <Badge variant={selectedStore.isActive ? 'default' : 'secondary'}>
                      {selectedStore.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {new Date(selectedStore.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      View Inventory
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      Store Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
