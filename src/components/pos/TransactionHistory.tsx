
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { Smartphone, Banknote } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {transaction.paymentMethod === 'mpesa' ? (
                      <Smartphone className="h-4 w-4 text-green-600" />
                    ) : (
                      <Banknote className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="font-semibold">Transaction #{transaction.id}</span>
                  </div>
                  <Badge variant={transaction.paymentMethod === 'mpesa' ? 'default' : 'secondary'}>
                    {transaction.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-medium">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold text-green-600">{formatPrice(transaction.total)}</p>
                  </div>
                </div>

                {transaction.mpesaReference && (
                  <div>
                    <p className="text-gray-600 text-sm">M-Pesa Reference</p>
                    <p className="font-mono text-sm">{transaction.mpesaReference}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 text-sm mb-2">Items ({transaction.items.length})</p>
                  <div className="space-y-1">
                    {transaction.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
