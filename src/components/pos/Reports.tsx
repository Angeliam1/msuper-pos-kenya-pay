import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction, Product, Attendant } from '@/types';
import { BarChart3, TrendingUp, FileText, Download, Calendar, DollarSign, ShoppingBag, Users } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
  attendants: Attendant[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions, products, attendants }) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.timestamp);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999); // Include the entire end date
    return transactionDate >= fromDate && transactionDate <= toDate;
  });

  // Sales Summary calculations
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Profit calculations
  const totalProfit = filteredTransactions.reduce((profit, transaction) => {
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

  const totalCost = filteredTransactions.reduce((cost, transaction) => {
    const transactionCost = transaction.items.reduce((itemCost, item) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        return itemCost + ((product.buyingCost || 0) * item.quantity);
      }
      return itemCost;
    }, 0);
    return cost + transactionCost;
  }, 0);

  // Stock reports
  const generateStockReport = (type: 'all' | 'low' | 'out') => {
    let stockData: any[] = [];
    
    if (type === 'all') {
      stockData = products.map(product => ({
        'Product Name': product.name,
        'Category': product.category,
        'Stock Quantity': product.stock,
        'Unit': product.unit,
        'Buying Cost': product.buyingCost || 0,
        'Retail Price': product.retailPrice || product.price,
        'Total Buying Value': product.stock * (product.buyingCost || 0),
        'Total Retail Value': product.stock * (product.retailPrice || product.price),
        'Potential Profit': product.stock * ((product.retailPrice || product.price) - (product.buyingCost || 0))
      }));
    } else if (type === 'low') {
      stockData = products
        .filter(product => product.stock <= (product.lowStockThreshold || 5))
        .map(product => ({
          'Product Name': product.name,
          'Current Stock': product.stock,
          'Low Stock Threshold': product.lowStockThreshold || 5,
          'Buying Cost': product.buyingCost || 0,
          'Total Value': product.stock * (product.buyingCost || 0)
        }));
    } else if (type === 'out') {
      stockData = products
        .filter(product => product.stock === 0)
        .map(product => ({
          'Product Name': product.name,
          'Category': product.category,
          'Last Buying Cost': product.buyingCost || 0,
          'Retail Price': product.retailPrice || product.price,
          'Supplier ID': product.supplierId || 'N/A'
        }));
    }

    if (stockData.length === 0) {
      alert(`No ${type} stock data found`);
      return;
    }

    // Generate CSV content
    const headers = Object.keys(stockData[0]);
    const csvContent = [
      headers.join(','),
      ...stockData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_stock_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Generate inventory PDF (simplified - would need a PDF library for full implementation)
  const generateInventoryPDF = () => {
    const inventoryData = products.map(product => ({
      name: product.name,
      category: product.category,
      stock: product.stock,
      buyingCost: product.buyingCost || 0,
      retailPrice: product.retailPrice || product.price,
      totalValue: product.stock * (product.buyingCost || 0)
    }));

    const totalInventoryValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);
    const totalRetailValue = inventoryData.reduce((sum, item) => sum + (item.stock * item.retailPrice), 0);

    // Create a simple HTML report that can be printed as PDF
    const reportHTML = `
      <html>
        <head>
          <title>Inventory Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Inventory Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Products: ${products.length}</p>
            <p>Total Inventory Value (Buying Price): KES ${totalInventoryValue.toLocaleString()}</p>
            <p>Total Retail Value: KES ${totalRetailValue.toLocaleString()}</p>
            <p>Potential Profit: KES ${(totalRetailValue - totalInventoryValue).toLocaleString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Buying Cost</th>
                <th>Retail Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryData.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.category}</td>
                  <td>${item.stock}</td>
                  <td>${products.find(p => p.name === item.name)?.unit || 'pcs'}</td>
                  <td>KES ${item.buyingCost.toLocaleString()}</td>
                  <td>KES ${item.retailPrice.toLocaleString()}</td>
                  <td>KES ${item.totalValue.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow?.document.write(reportHTML);
    newWindow?.document.close();
    newWindow?.print();
  };

  // Sales by Payment Type
  const paymentTypeStats = filteredTransactions.reduce((stats, transaction) => {
    transaction.paymentSplits.forEach(split => {
      if (!stats[split.method]) {
        stats[split.method] = { count: 0, amount: 0 };
      }
      stats[split.method].count++;
      stats[split.method].amount += split.amount;
    });
    return stats;
  }, {} as Record<string, { count: number; amount: number }>);

  // Sales by Employee
  const employeeStats = filteredTransactions.reduce((stats, transaction) => {
    const attendant = attendants.find(a => a.id === transaction.attendantId);
    const key = attendant?.name || 'Unknown';
    if (!stats[key]) {
      stats[key] = { count: 0, amount: 0 };
    }
    stats[key].count++;
    stats[key].amount += transaction.total;
    return stats;
  }, {} as Record<string, { count: number; amount: number }>);

  // Sales by Item
  const itemStats = filteredTransactions.reduce((stats, transaction) => {
    transaction.items.forEach(item => {
      if (!stats[item.name]) {
        stats[item.name] = { quantity: 0, amount: 0 };
      }
      stats[item.name].quantity += item.quantity;
      stats[item.name].amount += item.quantity * item.price;
    });
    return stats;
  }, {} as Record<string, { quantity: number; amount: number }>);

  // Sales by Category
  const categoryStats = filteredTransactions.reduce((stats, transaction) => {
    transaction.items.forEach(item => {
      if (!stats[item.category]) {
        stats[item.category] = { quantity: 0, amount: 0 };
      }
      stats[item.category].quantity += item.quantity;
      stats[item.category].amount += item.quantity * item.price;
    });
    return stats;
  }, {} as Record<string, { quantity: number; amount: number }>);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const exportReport = (reportType: string) => {
    let data: any[] = [];
    let filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;

    switch (reportType) {
      case 'summary':
        data = [{
          'Report Type': 'Sales Summary',
          'Date Range': `${dateRange.from} to ${dateRange.to}`,
          'Total Sales': totalSales,
          'Total Transactions': totalTransactions,
          'Average Transaction': averageTransaction,
          'Total Profit': totalProfit,
          'Total Cost': totalCost
        }];
        break;
      case 'items':
        data = Object.entries(itemStats).map(([item, stats]) => ({
          'Item Name': item,
          'Quantity Sold': stats.quantity,
          'Total Revenue': stats.amount
        }));
        break;
      case 'categories':
        data = Object.entries(categoryStats).map(([category, stats]) => ({
          'Category': category,
          'Items Sold': stats.quantity,
          'Total Revenue': stats.amount
        }));
        break;
      case 'employees':
        data = Object.entries(employeeStats).map(([employee, stats]) => ({
          'Employee': employee,
          'Transactions': stats.count,
          'Total Sales': stats.amount
        }));
        break;
      case 'payments':
        data = Object.entries(paymentTypeStats).map(([method, stats]) => ({
          'Payment Method': method,
          'Transactions': stats.count,
          'Total Amount': stats.amount
        }));
        break;
    }

    if (data.length === 0) {
      alert('No data available for export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Reports</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="dateFrom">From:</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="dateTo">To:</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatPrice(totalProfit)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatPrice(totalCost)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(averageTransaction)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="profit">Profit/Loss</TabsTrigger>
          <TabsTrigger value="stock">Stock Reports</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales Summary</CardTitle>
              <Button onClick={() => exportReport('summary')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profit & Loss Analysis</CardTitle>
              <Button onClick={() => exportReport('profit')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-red-600">{formatPrice(totalCost)}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Net Profit</p>
                  <p className="text-2xl font-bold text-blue-600">{formatPrice(totalProfit)}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-xl font-bold">
                  {totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(2) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Reports</CardTitle>
              <p className="text-sm text-gray-600">Download various stock reports and inventory data</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => generateStockReport('all')} variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>All Stock Report</span>
                  <span className="text-xs text-gray-500">Current stock & values</span>
                </Button>
                <Button onClick={() => generateStockReport('low')} variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Low Stock Report</span>
                  <span className="text-xs text-gray-500">Below threshold items</span>
                </Button>
                <Button onClick={() => generateStockReport('out')} variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Out of Stock</span>
                  <span className="text-xs text-gray-500">Zero stock items</span>
                </Button>
                <Button onClick={generateInventoryPDF} variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Inventory PDF</span>
                  <span className="text-xs text-gray-500">Complete inventory report</span>
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Stock Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Total Products</div>
                    <div>{products.length}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Low Stock Items</div>
                    <div className="text-orange-600">
                      {products.filter(p => p.stock <= (p.lowStockThreshold || 5)).length}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Out of Stock</div>
                    <div className="text-red-600">
                      {products.filter(p => p.stock === 0).length}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Inventory Value</div>
                    <div className="text-green-600">
                      {formatPrice(products.reduce((sum, p) => sum + (p.stock * (p.buyingCost || 0)), 0))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Item</CardTitle>
              <Button onClick={() => exportReport('items')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(itemStats)
                    .sort(([,a], [,b]) => b.amount - a.amount)
                    .map(([item, stats]) => (
                    <TableRow key={item}>
                      <TableCell>{item}</TableCell>
                      <TableCell>{stats.quantity}</TableCell>
                      <TableCell>{formatPrice(stats.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Category</CardTitle>
              <Button onClick={() => exportReport('categories')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Items Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(categoryStats)
                    .sort(([,a], [,b]) => b.amount - a.amount)
                    .map(([category, stats]) => (
                    <TableRow key={category}>
                      <TableCell>{category}</TableCell>
                      <TableCell>{stats.quantity}</TableCell>
                      <TableCell>{formatPrice(stats.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Employee</CardTitle>
              <Button onClick={() => exportReport('employees')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Total Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(employeeStats)
                    .sort(([,a], [,b]) => b.amount - a.amount)
                    .map(([employee, stats]) => (
                    <TableRow key={employee}>
                      <TableCell>{employee}</TableCell>
                      <TableCell>{stats.count}</TableCell>
                      <TableCell>{formatPrice(stats.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Payment Type</CardTitle>
              <Button onClick={() => exportReport('payments')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(paymentTypeStats)
                    .sort(([,a], [,b]) => b.amount - a.amount)
                    .map(([method, stats]) => (
                    <TableRow key={method}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {method}
                        </Badge>
                      </TableCell>
                      <TableCell>{stats.count}</TableCell>
                      <TableCell>{formatPrice(stats.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
