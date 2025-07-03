
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/types';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface ShoppingCartComponentProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const ShoppingCartComponent: React.FC<ShoppingCartComponentProps> = ({
  items,
  onUpdateQuantity,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal >= 2000 ? 0 : 200; // Free delivery above KES 2,000
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to get started!</p>
        <Button onClick={onContinueShopping} size="lg">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button variant="outline" onClick={onContinueShopping}>
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {item.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                      max={item.stock}
                    />
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className={getDeliveryFee() === 0 ? 'text-green-600' : ''}>
                    {getDeliveryFee() === 0 ? 'FREE' : formatPrice(getDeliveryFee())}
                  </span>
                </div>
                {getDeliveryFee() === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You qualify for free delivery!
                  </p>
                )}
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              
              <Button 
                onClick={onProceedToCheckout}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Secure checkout with M-Pesa payment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
