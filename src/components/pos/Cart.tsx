
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/pages/Index';
import { Minus, Plus, Trash2, Smartphone, Banknote } from 'lucide-react';
import { MPesaPayment } from './MPesaPayment';

interface CartProps {
  items: CartItem[];
  onUpdateItem: (id: string, quantity: number) => void;
  onCompleteTransaction: (paymentMethod: 'mpesa' | 'cash', mpesaReference?: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateItem, 
  onCompleteTransaction 
}) => {
  const [showMPesaPayment, setShowMPesaPayment] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleCashPayment = () => {
    onCompleteTransaction('cash');
  };

  const handleMPesaPayment = (reference: string) => {
    onCompleteTransaction('mpesa', reference);
    setShowMPesaPayment(false);
  };

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
        <CardTitle>Shopping Cart</CardTitle>
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
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateItem(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateItem(item.id, item.quantity + 1)}
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

              <div className="space-y-2">
                <Button
                  onClick={() => setShowMPesaPayment(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={items.length === 0}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Pay with M-Pesa
                </Button>
                <Button
                  onClick={handleCashPayment}
                  variant="outline"
                  className="w-full"
                  disabled={items.length === 0}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash Payment
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
