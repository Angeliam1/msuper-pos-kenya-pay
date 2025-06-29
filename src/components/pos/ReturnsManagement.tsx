
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Receipt, Printer, Search, RotateCcw } from 'lucide-react';
import { Transaction, CartItem } from '@/types';

interface ReturnsManagementProps {
  transactions: Transaction[];
  onRefundTransaction: (transactionId: string, reason: string, returnedItems?: CartItem[]) => void;
}

interface ReturnItem extends CartItem {
  returnQuantity: number;
  selected: boolean;
}

export const ReturnsManagement: React.FC<ReturnsManagementProps> = ({
  transactions,
  onRefundTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.includes(searchTerm) ||
    transaction.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReturnItems(
      transaction.items.map(item => ({
        ...item,
        returnQuantity: 0,
        selected: false
      }))
    );
    setReturnReason('');
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          selected,
          returnQuantity: selected ? 1 : 0
        };
      }
      return item;
    }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const maxQuantity = item.quantity;
        const validQuantity = Math.max(0, Math.min(quantity, maxQuantity));
        return {
          ...item,
          returnQuantity: validQuantity,
          selected: validQuantity > 0
        };
      }
      return item;
    }));
  };

  const handlePartialReturn = () => {
    if (selectedTransaction && returnReason) {
      const itemsToReturn = returnItems
        .filter(item => item.selected && item.returnQuantity > 0)
        .map(item => ({
          ...item,
          quantity: item.returnQuantity
        }));

      if (itemsToReturn.length > 0) {
        onRefundTransaction(selectedTransaction.id, returnReason, itemsToReturn);
        setSelectedTransaction(null);
        setReturnReason('');
        setReturnItems([]);
      } else {
        alert('Please select at least one item to return');
      }
    }
  };

  const handleFullReturn = () => {
    if (selectedTransaction && returnReason) {
      onRefundTransaction(selectedTransaction.id, returnReason);
      setSelectedTransaction(null);
      setReturnReason('');
      setReturnItems([]);
    }
  };

  const handleReprintReceipt = (transaction: Transaction) => {
    // In a real app, this would print the receipt
    console.log('Reprinting receipt for transaction:', transaction.id);
    alert(`Receipt reprinted for transaction ${transaction.id}`);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const calculatePartialReturnTotal = () => {
    return returnItems
      .filter(item => item.selected && item.returnQuantity > 0)
      .reduce((sum, item) => sum + (item.price * item.returnQuantity), 0);
  };

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
                      onClick={() => handleSelectTransaction(transaction)}
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
              <Label>Select Items to Return</Label>
              <div className="space-y-3 mt-2 border rounded-lg p-4 max-h-64 overflow-y-auto">
                {returnItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} each • Available: {item.quantity}
                        </p>
                      </div>
                    </div>
                    
                    {item.selected && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={item.returnQuantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {calculatePartialReturnTotal() > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-800">
                    Partial Return Total: {formatPrice(calculatePartialReturnTotal())}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label>Return Reason</Label>
              <Input
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Enter reason for return..."
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handlePartialReturn} 
                variant="destructive"
                disabled={!returnReason || calculatePartialReturnTotal() === 0}
              >
                Process Partial Return
              </Button>
              <Button 
                onClick={handleFullReturn} 
                variant="destructive"
                disabled={!returnReason}
              >
                Return All Items
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTransaction(null);
                  setReturnReason('');
                  setReturnItems([]);
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
