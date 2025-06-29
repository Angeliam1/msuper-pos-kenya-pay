
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem, Transaction, PaymentSplit } from '@/types';
import { Minus, Plus, Trash2, Smartphone, Banknote, CreditCard, Split, Pause } from 'lucide-react';
import { MPesaPayment } from './MPesaPayment';
import { Receipt } from './Receipt';

interface CartProps {
  items: CartItem[];
  onUpdateItem: (id: string, quantity: number) => void;
  onCompleteTransaction: (paymentMethod: 'mpesa' | 'cash', mpesaReference?: string) => Transaction;
  onSplitPayment: () => void;
  onHirePurchase: () => void;
  onHoldTransaction: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateItem, 
  onCompleteTransaction,
  onSplitPayment,
  onHirePurchase,
  onHoldTransaction
}) => {
  const [showMPesaPayment, setShowMPesaPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    // Prevent negative quantities
    if (newQuantity < 0) return;
    
    // Find the item to check stock
    const item = items.find(i => i.id === id);
    if (item && newQuantity > item.stock) {
      alert(`Cannot add more items. Only ${item.stock} in stock.`);
      return;
    }
    
    onUpdateItem(id, newQuantity);
  };

  const handleCashPayment = () => {
    const transaction = onCompleteTransaction('cash');
    setCurrentTransaction(transaction);
    setShowReceipt(true);
  };

  const handleMPesaPayment = (reference: string) => {
    const transaction = onCompleteTransaction('mpesa', reference);
    setCurrentTransaction(transaction);
    setShowMPesaPayment(false);
    setShowReceipt(true);
  };

  if (showReceipt && currentTransaction) {
    return (
      <Receipt
        transaction={currentTransaction}
        onClose={() => {
          setShowReceipt(false);
          setCurrentTransaction(null);
        }}
      />
    );
  }

  if (showMPesaPayment) {
    return (
      <MPesaPayment
        amount={total}
        onSuccess={handleMPesaPayment}
        onCancel={() => setShowMPesaPayment(false)}
      />
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Cart is empty</p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-green-600 font-semibold">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onUpdateItem(item.id, 0)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowMPesaPayment(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={items.length === 0}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  M-Pesa
                </Button>
                <Button
                  onClick={handleCashPayment}
                  variant="outline"
                  disabled={items.length === 0}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash
                </Button>
                <Button
                  onClick={onSplitPayment}
                  variant="outline"
                  disabled={items.length === 0}
                >
                  <Split className="h-4 w-4 mr-2" />
                  Split Pay
                </Button>
                <Button
                  onClick={onHirePurchase}
                  variant="outline"
                  disabled={items.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Hire Purchase
                </Button>
              </div>
              
              <Button
                onClick={onHoldTransaction}
                variant="secondary"
                className="w-full"
                disabled={items.length === 0}
              >
                <Pause className="h-4 w-4 mr-2" />
                Hold Transaction
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
