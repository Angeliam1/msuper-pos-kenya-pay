
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
    return transactionDate >= fromDate && transactionDate <= toDate;
  });

  // Sales Summary calculations
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

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
    // This would typically generate and download a CSV/PDF report
    console.log(`Exporting ${reportType} report`);
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(itemStats).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
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

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button onClick={() => exportReport('transactions')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.slice(0, 20).map((transaction) => {
                    const attendant = attendants.find(a => a.id === transaction.attendantId);
                    const primaryPayment = transaction.paymentSplits[0]?.method || 'cash';
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{formatPrice(transaction.total)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {primaryPayment}
                          </Badge>
                        </TableCell>
                        <TableCell>{attendant?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'destructive'}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
