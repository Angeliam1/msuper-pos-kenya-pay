
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Transaction } from '@/types';
import { Search, AlertTriangle, Ban, RefreshCw, Clock, User } from 'lucide-react';

interface VoidRefundTransactionProps {
  transactions: Transaction[];
  onVoidTransaction: (transactionId: string, reason: string) => void;
  onRefundTransaction: (transactionId: string, reason: string) => void;
  onClose: () => void;
}

export const VoidRefundTransaction: React.FC<VoidRefundTransactionProps> = ({
  transactions,
  onVoidTransaction,
  onRefundTransaction,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState<'void' | 'refund' | null>(null);

  const activeTransactions = transactions.filter(t => t.status === 'completed');
  
  const filteredTransactions = activeTransactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(transaction.timestamp).toLocaleDateString().includes(searchTerm)
  );

  const handleAction = () => {
    if (!selectedTransaction || !reason.trim() || !actionType) return;

    if (actionType === 'void') {
      onVoidTransaction(selectedTransaction.id, reason);
    } else {
      onRefundTransaction(selectedTransaction.id, reason);
    }

    setSelectedTransaction(null);
    setReason('');
    setActionType(null);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Void / Refund Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedTransaction ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by transaction ID or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {activeTransactions.length === 0 ? 'No active transactions' : 'No transactions match your search'}
                </div>
              ) : (
                filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">#{transaction.id}</span>
                        <Badge variant="default">
                          {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setActionType('void');
                          }}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Void
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setActionType('refund');
                          }}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refund
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold text-green-600">
                          {formatPrice(transaction.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method</p>
                        <p className="font-medium capitalize">
                          {transaction.paymentSplits.length === 1 
                            ? transaction.paymentSplits[0].method 
                            : 'Split Payment'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Badge variant="default">Completed</Badge>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <p className="text-gray-600 mb-1">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {transaction.items.slice(0, 3).map(item => (
                          <span key={item.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                        {transaction.items.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{transaction.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">
                {actionType === 'void' ? 'Void Transaction' : 'Refund Transaction'} #{selectedTransaction.id}
              </h3>
              <p className="text-sm text-orange-700">
                {actionType === 'void' 
                  ? 'Voiding will cancel this transaction permanently. This action cannot be undone.'
                  : 'Refunding will reverse this transaction. Please ensure proper authorization.'
                }
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="reason">Reason for {actionType === 'void' ? 'Void' : 'Refund'}</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Enter reason for ${actionType}...`}
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAction}
                variant={actionType === 'void' ? 'destructive' : 'default'}
                disabled={!reason.trim()}
                className="flex items-center gap-2"
              >
                {actionType === 'void' ? (
                  <>
                    <Ban className="h-4 w-4" />
                    Confirm Void
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Confirm Refund
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setSelectedTransaction(null);
                  setReason('');
                  setActionType(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
