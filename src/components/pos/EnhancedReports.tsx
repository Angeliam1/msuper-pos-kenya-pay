
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  Download, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';

interface EnhancedReportsProps {
  transactions: Transaction[];
  products: any[];
  customers: any[];
}

export const EnhancedReports: React.FC<EnhancedReportsProps> = ({
  transactions,
  products,
  customers
}) => {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getTodayTransactions = () => {
    const today = new Date().toDateString();
    return transactions.filter(t => new Date(t.timestamp).toDateString() === today);
  };

  const getWeekTransactions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transactions.filter(t => new Date(t.timestamp) >= weekAgo);
  };

  const getMonthTransactions = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return transactions.filter(t => new Date(t.timestamp) >= monthAgo);
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    switch (dateRange) {
      case 'today':
        filtered = getTodayTransactions();
        break;
      case 'week':
        filtered = getWeekTransactions();
        break;
      case 'month':
        filtered = getMonthTransactions();
        break;
      default:
        filtered = transactions;
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const calculateStats = () => {
    const filtered = getFilteredTransactions();
    const totalSales = filtered.reduce((sum, t) => sum + t.total, 0);
    const totalProfit = filtered.reduce((profit, transaction) => {
      const transactionProfit = transaction.items.reduce((itemProfit, item) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const profitPerItem = item.price - (product.buyingCost || 0);
          return itemProfit + (profitPerItem * item.quantity);
        }
        return itemProfit;
      }, 0);
      return profit + transactionProfit;
    }, 0);

    return {
      totalSales,
      totalProfit,
      transactionCount: filtered.length,
      averageTransaction: filtered.length > 0 ? totalSales / filtered.length : 0
    };
  };

  const getTopSellingProducts = () => {
    const productSales = new Map();
    
    getFilteredTransactions().forEach(transaction => {
      transaction.items.forEach(item => {
        const existing = productSales.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
        productSales.set(item.id, {
          name: item.name,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  const exportReport = (type: string) => {
    const data = getFilteredTransactions();
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Transaction ID,Date,Total,Items,Payment Method\n" +
      data.map(t => 
        `${t.id},${new Date(t.timestamp).toLocaleDateString()},${t.total},${t.items.length},${t.paymentSplits[0]?.method || 'cash'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: `${type} report exported successfully`,
    });
  };

  const viewTransaction = (transactionId: string) => {
    toast({
      title: "Transaction Details",
      description: `Viewing transaction ${transactionId}`,
    });
  };

  const stats = calculateStats();
  const topProducts = getTopSellingProducts();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive business insights and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport('sales')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Transactions</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by ID or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalSales)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(stats.totalProfit)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{stats.transactionCount}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(stats.averageTransaction)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getFilteredTransactions().map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{transaction.id}</span>
                        <Badge variant="outline">
                          {transaction.paymentSplits[0]?.method || 'cash'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.timestamp).toLocaleString()} • {transaction.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatPrice(transaction.total)}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewTransaction(transaction.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {getFilteredTransactions().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No transactions found for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No product data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Advanced analytics charts coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['cash', 'mpesa', 'credit'].map(method => {
                    const count = getFilteredTransactions().filter(t => 
                      t.paymentSplits.some(split => split.method === method)
                    ).length;
                    return (
                      <div key={method} className="flex justify-between items-center">
                        <span className="capitalize">{method}</span>
                        <Badge variant="outline">{count} transactions</Badge>
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
