
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnlineStoreProducts } from './OnlineStoreProducts';
import { OnlineStoreOrders } from './OnlineStoreOrders';
import { OnlineStoreSettings } from './OnlineStoreSettings';
import { OnlineStoreAnalytics } from './OnlineStoreAnalytics';
import { OnlineStoreFrontend } from './OnlineStoreFrontend';
import { 
  Globe, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Eye,
  Store,
  Zap
} from 'lucide-react';

export const OnlineStoreManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('storefront');

  // Mock online store data - this would come from a separate database table
  const storeStats = {
    totalProducts: 156,
    activeProducts: 142,
    totalOrders: 89,
    monthlyRevenue: 245000,
    pendingOrders: 12,
    domain: 'www.digitalden.co.ke',
    storeStatus: 'active' as const
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            Online Store Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your independent online store at {storeStats.domain}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={storeStats.storeStatus === 'active' ? 'default' : 'secondary'}
            className="flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            {storeStats.storeStatus === 'active' ? 'Live' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview Store
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold">{storeStats.activeProducts}</p>
                <p className="text-xs text-gray-500">{storeStats.totalProducts} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold">{storeStats.totalOrders}</p>
                <p className="text-xs text-gray-500">{storeStats.pendingOrders} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">KES {storeStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Store Status</p>
                <p className="text-2xl font-bold capitalize">{storeStats.storeStatus}</p>
                <p className="text-xs text-gray-500">{storeStats.domain}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="storefront" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Storefront
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="storefront" className="mt-6">
          <OnlineStoreFrontend />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <OnlineStoreProducts />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OnlineStoreOrders />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <OnlineStoreAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <OnlineStoreSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
