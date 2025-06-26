
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { Smartphone, Banknote, CreditCard } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="h-4 w-4 text-green-600" />;
      case 'credit':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      default:
        return <Banknote className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentBadgeVariant = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'default' as const;
      case 'credit':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

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
            {transactions.map(transaction => {
              const primaryPaymentMethod = transaction.paymentSplits[0]?.method || 'cash';
              const mpesaPayment = transaction.paymentSplits.find(split => split.method === 'mpesa');
              
              return (
                <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(primaryPaymentMethod)}
                      <span className="font-semibold">Transaction #{transaction.id}</span>
                    </div>
                    <div className="flex gap-1">
                      {transaction.paymentSplits.map((split, index) => (
                        <Badge key={index} variant={getPaymentBadgeVariant(split.method)}>
                          {split.method === 'mpesa' ? 'M-Pesa' : split.method}
                        </Badge>
                      ))}
                    </div>
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

                  {transaction.paymentSplits.length > 1 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Payment Breakdown</p>
                      <div className="space-y-1">
                        {transaction.paymentSplits.map((split, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="capitalize">
                              {split.method === 'mpesa' ? 'M-Pesa' : split.method}
                            </span>
                            <span className="font-medium">{formatPrice(split.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mpesaPayment?.reference && (
                    <div>
                      <p className="text-gray-600 text-sm">M-Pesa Reference</p>
                      <p className="font-mono text-sm">{mpesaPayment.reference}</p>
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
