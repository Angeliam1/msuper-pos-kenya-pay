
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Smartphone } from 'lucide-react';

interface MPesaPaymentProps {
  amount: number;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export const MPesaPayment: React.FC<MPesaPaymentProps> = ({
  amount,
  onSuccess,
  onCancel
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleSendSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsProcessing(true);
    
    // Simulate STK push process
    setTimeout(() => {
      // Simulate successful payment
      const reference = `MPE${Date.now()}`;
      onSuccess(reference);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            M-Pesa Payment
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(amount)}</p>
        </div>

        {/* Till Number Information */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-700">M-Pesa Till Number</p>
          <p className="text-3xl font-bold text-blue-600">9951109</p>
          <p className="text-xs text-gray-600 mt-1">Use this till number for manual payments</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Customer Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07XXXXXXXX or 01XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={10}
          />
          <p className="text-xs text-gray-500">
            Enter customer phone number for STK push (if available)
          </p>
        </div>

        {isProcessing ? (
          <div className="text-center py-6">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-medium">Processing Payment...</p>
            <p className="text-sm text-gray-600">Check your phone for M-Pesa prompt</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleSendSTKPush}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={phoneNumber.length < 10}
            >
              Send STK Push Request
            </Button>
            <Button
              onClick={() => onSuccess(`MANUAL_${Date.now()}`)}
              variant="outline"
              className="w-full"
            >
              Mark as Paid (Manual Payment)
            </Button>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Payment Options:</h4>
          <ol className="text-xs text-gray-600 space-y-1">
            <li><strong>Option 1:</strong> Send money to Till Number <strong>9951109</strong></li>
            <li><strong>Option 2:</strong> Use STK Push (enter customer phone above)</li>
            <li><strong>Option 3:</strong> Customer pays manually and you mark as paid</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
