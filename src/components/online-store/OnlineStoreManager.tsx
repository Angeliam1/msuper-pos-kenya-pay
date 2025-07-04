
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Eye,
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { OnlineStoreProducts } from './OnlineStoreProducts';
import { OnlineStoreOrders } from './OnlineStoreOrders';
import { OnlineStoreAnalytics } from './OnlineStoreAnalytics';
import { OnlineStoreSettings } from './OnlineStoreSettings';
import { OnlineStoreFrontend } from './OnlineStoreFrontend';

type OnlineStoreTab = 'overview' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings' | 'preview';

export const OnlineStoreManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OnlineStoreTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'preview', label: 'Preview Store', icon: Eye },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Store Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900">42</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600">
                      +12% this month
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900">128</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600">
                      +8% this week
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">KES 2.4M</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600">
                      +15% this month
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                      <p className="text-3xl font-bold text-gray-900">89</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600">
                      +5 new today
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('products')}
                    className="h-16 flex items-center justify-center gap-3"
                  >
                    <Plus className="h-5 w-5" />
                    Add Product
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('orders')}
                    className="h-16 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    View Orders
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('settings')}
                    className="h-16 flex items-center justify-center gap-3"
                  >
                    <Settings className="h-5 w-5" />
                    Store Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New order #DD-2024-003 received from Mike Johnson</span>
                    <Badge variant="outline" className="ml-auto">2 min ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Product "iPhone 15 Pro Max" stock updated</span>
                    <Badge variant="outline" className="ml-auto">5 min ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Order #DD-2024-002 shipped to Jane Smith</span>
                    <Badge variant="outline" className="ml-auto">1 hour ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'products':
        return <OnlineStoreProducts />;
      case 'orders':
        return <OnlineStoreOrders />;
      case 'analytics':
        return <OnlineStoreAnalytics />;
      case 'settings':
        return <OnlineStoreSettings />;
      case 'preview':
        return <OnlineStoreFrontend />;
      case 'customers':
        return (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600">Customer management features coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Store</h1>
          <p className="text-gray-600">Manage your online store products, orders, and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Store Active
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('preview')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Store
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OnlineStoreTab)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};
