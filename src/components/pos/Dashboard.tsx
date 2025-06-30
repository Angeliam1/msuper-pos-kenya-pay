
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { TrendingUp, DollarSign, ShoppingBag, Smartphone, TrendingDown } from 'lucide-react';

interface DashboardProps {
  totalSales: number;
  todaySales: number;
  transactionCount: number;
  transactions: Transaction[];
  products: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  totalSales,
  todaySales,
  transactionCount,
  transactions,
  products
}) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  // Calculate profit/loss
  const totalProfit = transactions.reduce((profit, transaction) => {
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

  const todayProfit = transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((profit, transaction) => {
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

  const mpesaTransactions = transactions.filter(t => 
    t.paymentSplits.some(split => split.method === 'mpesa')
  ).length;
  const cashTransactions = transactions.filter(t => 
    t.paymentSplits.some(split => split.method === 'cash')
  ).length;

  const todayTransactions = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</div>
            <p className="text-xs text-muted-foreground">All time sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(todaySales)}</div>
            <p className="text-xs text-muted-foreground">{todayTransactions} transactions today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatPrice(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">All time profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{formatPrice(todayProfit)}</div>
            <p className="text-xs text-muted-foreground">Today's profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionCount}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span>M-Pesa</span>
                </div>
                <span className="font-semibold">{mpesaTransactions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span>Cash</span>
                </div>
                <span className="font-semibold">{cashTransactions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(transaction => {
                const primaryPaymentMethod = transaction.paymentSplits[0]?.method || 'cash';
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{formatPrice(transaction.total)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {primaryPaymentMethod === 'mpesa' ? (
                        <Smartphone className="h-4 w-4 text-green-600" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="text-xs capitalize">{primaryPaymentMethod}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
