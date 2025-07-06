
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  XCircle,
  Banknote,
  Smartphone,
  CreditCard,
  Calculator
} from 'lucide-react';
import { CartItem } from '@/types';

interface DemoCartProps {
  cart: CartItem[];
  onClearCart: () => void;
  onAdjustQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onProcessCheckout: (method: 'cash' | 'mpesa' | 'card') => void;
  onProcessSplitPayment: () => void;
  formatPrice: (price: number) => string;
}

export const DemoCart: React.FC<DemoCartProps> = ({
  cart,
  onClearCart,
  onAdjustQuantity,
  onRemoveFromCart,
  onProcessCheckout,
  onProcessSplitPayment,
  formatPrice
}) => {
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-red-600"
          >
            Clear
          </Button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm font-semibold text-green-600">
                  {formatPrice(item.price)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAdjustQuantity(item.id, item.quantity - 1)}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-2 font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAdjustQuantity(item.id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-600 h-7 w-7 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-lg font-bold text-green-600">
            {formatPrice(calculateTotal())}
          </span>
        </div>
        
        {/* Payment Method Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            size="sm"
            onClick={() => onProcessCheckout('cash')}
          >
            <Banknote className="h-4 w-4 mr-1" />
            Cash
          </Button>
          <Button 
            className="bg-green-800 hover:bg-green-900" 
            size="sm"
            onClick={() => onProcessCheckout('mpesa')}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            M-Pesa
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            size="sm"
            onClick={() => onProcessCheckout('card')}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Card
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700" 
            size="sm"
            onClick={onProcessSplitPayment}
          >
            <Calculator className="h-4 w-4 mr-1" />
            Split
          </Button>
        </div>
      </div>
    </div>
  );
};
