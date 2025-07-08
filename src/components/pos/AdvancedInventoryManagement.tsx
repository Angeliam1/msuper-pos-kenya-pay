import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  BarChart3,
  Calendar,
  ShoppingCart
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

interface RestockSuggestion {
  productId: string;
  productName: string;
  currentStock: number;
  suggestedOrder: number;
  daysUntilStockout: number;
  avgDailySales: number;
  lastOrderDate?: Date;
  supplier?: string;
}

export const AdvancedInventoryManagement: React.FC = () => {
  const { currentStore, getStoreProducts, getStoreTransactions, updateStoreProduct } = useStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [restockSuggestions, setRestockSuggestions] = useState<RestockSuggestion[]>([]);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = currentStore ? getStoreProducts(currentStore.id) : [];
  const transactions = currentStore ? getStoreTransactions(currentStore.id) : [];

  // Generate inventory alerts
  useEffect(() => {
    const newAlerts: InventoryAlert[] = [];
    
    products.forEach(product => {
      const stock = product.stock || 0;
      const minStock = product.minStock || 5;
      
      if (stock === 0) {
        newAlerts.push({
          id: `out-${product.id}`,
          type: 'out_of_stock',
          productId: product.id,
          productName: product.name,
          message: `${product.name} is out of stock`,
          severity: 'critical',
          timestamp: new Date()
        });
      } else if (stock <= minStock) {
        newAlerts.push({
          id: `low-${product.id}`,
          type: 'low_stock',
          productId: product.id,
          productName: product.name,
          message: `${product.name} is running low (${stock} left)`,
          severity: stock <= minStock / 2 ? 'high' : 'medium',
          timestamp: new Date()
        });
      } else if (stock > minStock * 10) {
        newAlerts.push({
          id: `over-${product.id}`,
          type: 'overstock',
          productId: product.id,
          productName: product.name,
          message: `${product.name} may be overstocked (${stock} units)`,
          severity: 'low',
          timestamp: new Date()
        });
      }
    });
    
    setAlerts(newAlerts);
  }, [products]);

  // Generate restock suggestions
  useEffect(() => {
    const suggestions: RestockSuggestion[] = [];
    
    products.forEach(product => {
      const stock = product.stock || 0;
      const minStock = product.minStock || 5;
      
      if (stock <= minStock * 2) {
        // Calculate average daily sales from transactions
        const productTransactions = transactions.filter(t => 
          t.items?.some((item: any) => item.productId === product.id)
        );
        
        const dailySales = productTransactions.length > 0 ? 
          productTransactions.reduce((sum, t) => {
            const item = t.items?.find((i: any) => i.productId === product.id);
            return sum + (item?.quantity || 0);
          }, 0) / 30 : 1; // Default to 1 if no data
        
        const daysUntilStockout = dailySales > 0 ? Math.floor(stock / dailySales) : 999;
        const suggestedOrder = Math.max(minStock * 3, Math.ceil(dailySales * 30));
        
        suggestions.push({
          productId: product.id,
          productName: product.name,
          currentStock: stock,
          suggestedOrder,
          daysUntilStockout,
          avgDailySales: dailySales,
          supplier: product.supplierId || 'Unknown'
        });
      }
    });
    
    setRestockSuggestions(suggestions.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout));
  }, [products, transactions]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && (product.stock || 0) <= (product.minStock || 5)) ||
                        (stockFilter === 'out' && (product.stock || 0) === 0) ||
                        (stockFilter === 'normal' && (product.stock || 0) > (product.minStock || 5));
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  const getStockStatus = (product: any) => {
    const stock = product.stock || 0;
    const minStock = product.minStock || 5;
    
    if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-700' };
    if (stock <= minStock) return { status: 'Low Stock', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (stock <= minStock * 2) return { status: 'Reorder Soon', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { status: 'In Stock', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const getStockLevel = (product: any) => {
    const stock = product.stock || 0;
    const maxStock = (product.minStock || 5) * 4;
    return Math.min((stock / maxStock) * 100, 100);
  };

  const handleQuickRestock = (productId: string, quantity: number) => {
    if (!currentStore) return;
    
    const product = products.find(p => p.id === productId);
    if (product) {
      updateStoreProduct(currentStore.id, productId, {
        stock: (product.stock || 0) + quantity
      });
      
      toast({
        title: "Stock Updated",
        description: `Added ${quantity} units to ${product.name}`,
      });
    }
  };

  const handleBulkRestock = () => {
    toast({
      title: "Bulk Restock Initiated",
      description: "Processing restock suggestions...",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => (p.stock || 0) <= (p.minStock || 5)).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => (p.stock || 0) === 0).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{alerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts 
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">{alerts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="restock">Restock Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock Levels</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="normal">Normal Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product);
              const stockLevel = getStockLevel(product);
              
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.barcode || 'No barcode'}</p>
                      </div>
                      <Badge className={stockStatus.textColor} variant="outline">
                        {stockStatus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>{product.stock || 0} units</span>
                      </div>
                      <Progress 
                        value={stockLevel} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Min: {product.minStock || 5} units
                      </p>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span className="font-medium">KES {product.price?.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            Quick Restock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Quick Restock - {product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Stock: {product.stock || 0}</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleQuickRestock(product.id, 10)}>
                                +10
                              </Button>
                              <Button onClick={() => handleQuickRestock(product.id, 25)}>
                                +25
                              </Button>
                              <Button onClick={() => handleQuickRestock(product.id, 50)}>
                                +50
                              </Button>
                              <Button onClick={() => handleQuickRestock(product.id, 100)}>
                                +100
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
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
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-xs opacity-75">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Resolve
                          </Button>
                          <Button size="sm">
                            Restock
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No alerts at this time</p>
                    <p className="text-sm">Your inventory levels are healthy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restock" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Smart Restock Suggestions</CardTitle>
                <Button onClick={handleBulkRestock}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Bulk Restock
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restockSuggestions.map(suggestion => (
                  <div key={suggestion.productId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{suggestion.productName}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Current: {suggestion.currentStock}</span>
                        <span>Suggested: {suggestion.suggestedOrder}</span>
                        <span>Days left: {suggestion.daysUntilStockout}</span>
                        <span>Daily avg: {suggestion.avgDailySales.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Modify
                      </Button>
                      <Button size="sm">
                        Order Now
                      </Button>
                    </div>
                  </div>
                ))}
                
                {restockSuggestions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No restock suggestions</p>
                    <p className="text-sm">All products are well stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Stock analytics will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 5).map(category => {
                    const categoryProducts = products.filter(p => p.category === category);
                    const totalStock = categoryProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
                    
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <div className="text-right">
                          <p className="font-semibold">{totalStock} units</p>
                          <p className="text-sm text-gray-600">{categoryProducts.length} products</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
