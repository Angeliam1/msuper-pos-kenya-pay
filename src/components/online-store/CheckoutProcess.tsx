
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartItem, Customer } from '@/types';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutProcessProps {
  items: CartItem[];
  customer: Customer | null;
  onOrderComplete: () => void;
  onBackToCart: () => void;
  onLoginRequired: () => void;
}

export const CheckoutProcess: React.FC<CheckoutProcessProps> = ({
  items,
  customer,
  onOrderComplete,
  onBackToCart,
  onLoginRequired,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: customer?.address || '',
    phoneNumber: customer?.phone || '',
    notes: '',
    paymentMethod: 'mpesa' as 'mpesa' | 'cash_on_delivery',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal >= 2000 ? 0 : 200;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails.deliveryAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a delivery address",
        variant: "destructive"
      });
      return;
    }
    
    if (!orderDetails.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }
    
    setStep('payment');
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would:
      // - Create the order in the database
      // - Process payment
      // - Update inventory
      // - Send confirmation SMS/email
      
      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation SMS shortly",
      });
      
      setStep('confirmation');
      
      // Complete the order after showing confirmation
      setTimeout(() => {
        onOrderComplete();
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!customer && step === 'details') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login or create an account to proceed with checkout
          </p>
          <div className="space-y-4">
            <Button onClick={onLoginRequired} size="lg" className="w-full">
              Login / Register
            </Button>
            <Button variant="outline" onClick={onBackToCart}>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Order #MSU-{Date.now().toString().slice(-6)}
          </p>
          <p className="text-gray-600">
            Thank you for your order. We'll prepare your items and deliver them to your address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBackToCart}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        deliveryAddress: e.target.value
                      })}
                      placeholder="Enter your full delivery address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderDetails.phoneNumber}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        phoneNumber: e.target.value
                      })}
                      placeholder="0700 000 000"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={orderDetails.notes}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        notes: e.target.value
                      })}
                      placeholder="Any special delivery instructions"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={orderDetails.paymentMethod}
                  onValueChange={(value) => setOrderDetails({
                    ...orderDetails,
                    paymentMethod: value as 'mpesa' | 'cash_on_delivery'
                  })}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center space-x-2 cursor-pointer">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">M-Pesa</div>
                        <div className="text-sm text-gray-500">Pay with M-Pesa (Till: 9951109)</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cash_on_delivery" id="cash" />
                    <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">Pay when your order arrives</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep('details')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(getTotal())}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <hr />
              
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
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              
              {customer && (
                <div className="text-sm text-gray-600 pt-2 border-t">
                  <p>Delivering to: {customer.name}</p>
                  <p>{orderDetails.deliveryAddress || customer.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
