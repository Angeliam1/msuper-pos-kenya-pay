
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Receipt, Printer, Search, RotateCcw } from 'lucide-react';
import { Transaction } from '@/types';

interface ReturnsManagementProps {
  transactions: Transaction[];
  onRefundTransaction: (transactionId: string, reason: string) => void;
}

export const ReturnsManagement: React.FC<ReturnsManagementProps> = ({
  transactions,
  onRefundTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [returnReason, setReturnReason] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.includes(searchTerm) ||
    transaction.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReturn = () => {
    if (selectedTransaction && returnReason) {
      onRefundTransaction(selectedTransaction.id, returnReason);
      setSelectedTransaction(null);
      setReturnReason('');
    }
  };

  const handleReprintReceipt = (transaction: Transaction) => {
    // In a real app, this would print the receipt
    console.log('Reprinting receipt for transaction:', transaction.id);
    alert(`Receipt reprinted for transaction ${transaction.id}`);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Returns & Refunds
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by transaction ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Transaction #{transaction.id}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                    <p className="font-semibold text-green-600">
                      {formatPrice(transaction.total)}
                    </p>
                  </div>
                  <Badge variant={
                    transaction.status === 'completed' ? 'default' :
                    transaction.status === 'refunded' ? 'destructive' : 'secondary'
                  }>
                    {transaction.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  {transaction.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReprintReceipt(transaction)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Reprint Receipt
                  </Button>
                  {transaction.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Process Return
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Process Return - Transaction #{selectedTransaction.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Return Reason</Label>
              <Input
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Enter reason for return..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReturn} variant="destructive">
                Confirm Return
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTransaction(null);
                  setReturnReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
