
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  Store,
  Settings,
  Globe,
  BarChart3,
  CreditCard
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleOpenPOS = () => {
    navigate('/pos');
  };

  const handleManageInventory = () => {
    navigate('/pos?view=products');
  };

  const handleOpenSettings = () => {
    navigate('/pos?view=settings');
  };

  const handleOpenOnlineStore = () => {
    navigate('/pos?view=online-store');
  };

  const handleOpenReports = () => {
    navigate('/pos?view=reports');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">M-Super POS</h1>
          <p className="text-gray-600">Welcome to your Point of Sale system</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Today's Sales</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">KSh 0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <Package className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Products</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">KSh 0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Store className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Point of Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                Process sales, manage inventory, and handle customer transactions.
              </p>
              <Button className="w-full" onClick={handleOpenPOS}>
                Open POS
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Package className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                Manage products, track stock levels, and update pricing.
              </p>
              <Button variant="outline" className="w-full" onClick={handleManageInventory}>
                Manage Inventory
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Globe className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Online Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                Manage your online store, orders, and customer interactions.
              </p>
              <Button variant="outline" className="w-full" onClick={handleOpenOnlineStore}>
                Online Store
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <BarChart3 className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                View sales reports, analytics, and business insights.
              </p>
              <Button variant="outline" className="w-full" onClick={handleOpenReports}>
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <CreditCard className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                Track business expenses and manage financial records.
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/pos?view=expenses')}>
                Manage Expenses
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Settings className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base text-gray-600 mb-4">
                Configure your store settings, users, and system preferences.
              </p>
              <Button variant="outline" className="w-full" onClick={handleOpenSettings}>
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="mt-6 lg:mt-8">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-sm lg:text-base">Set up your store information</h4>
                  <p className="text-sm lg:text-base text-gray-600">Configure your store details, currency, and basic settings.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-sm lg:text-base">Add your products</h4>
                  <p className="text-sm lg:text-base text-gray-600">Create your product catalog with prices and stock levels.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-sm lg:text-base">Start selling</h4>
                  <p className="text-sm lg:text-base text-gray-600">Begin processing sales and managing your business.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-sm lg:text-base">Launch your online store</h4>
                  <p className="text-sm lg:text-base text-gray-600">Expand your reach with an online presence and accept orders digitally.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
