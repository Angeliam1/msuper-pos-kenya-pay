
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/types';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-naivas-teal text-white p-4 flex items-center">
          <button onClick={onContinueShopping} className="mr-3">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Shopping Cart</h1>
        </div>

        {/* Empty Cart */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <Button 
              onClick={onContinueShopping} 
              className="bg-naivas-orange hover:bg-orange-600 text-white px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-naivas-teal text-white p-4 flex items-center sticky top-0 z-10">
        <button onClick={onContinueShopping} className="mr-3">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Shopping Cart</h1>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {item.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-naivas-teal">
                        {formatPrice(item.price)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 border-naivas-teal text-naivas-teal"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8 p-0 border-naivas-teal text-naivas-teal"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, 0)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 border-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <p className="font-semibold text-gray-900">
                        Total: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
        <div className="p-4">
          {/* Order Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery:</span>
              <span className={getDeliveryFee() === 0 ? 'text-green-600' : ''}>
                {getDeliveryFee() === 0 ? 'FREE' : formatPrice(getDeliveryFee())}
              </span>
            </div>
            {getDeliveryFee() === 0 && (
              <p className="text-xs text-green-600">
                🎉 You qualify for free delivery!
              </p>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-naivas-teal">{formatPrice(getTotal())}</span>
            </div>
          </div>
          
          <Button 
            onClick={onProceedToCheckout}
            className="w-full bg-naivas-orange hover:bg-orange-600 text-white py-3 text-lg font-medium"
          >
            Proceed to Checkout
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Secure checkout with M-Pesa payment
          </p>
        </div>
      </div>
    </div>
  );
};
