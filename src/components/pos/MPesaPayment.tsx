
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

        <div className="space-y-2">
          <Label htmlFor="phone">M-Pesa Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07XXXXXXXX or 01XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={10}
          />
          <p className="text-xs text-gray-500">
            Enter the phone number registered with M-Pesa
          </p>
        </div>

        {isProcessing ? (
          <div className="text-center py-6">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-medium">Processing Payment...</p>
            <p className="text-sm text-gray-600">Check your phone for M-Pesa prompt</p>
          </div>
        ) : (
          <Button
            onClick={handleSendSTKPush}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={phoneNumber.length < 10}
          >
            Send Payment Request
          </Button>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">How it works:</h4>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. Enter your M-Pesa registered phone number</li>
            <li>2. Click "Send Payment Request"</li>
            <li>3. Enter your M-Pesa PIN on your phone</li>
            <li>4. Transaction will be completed automatically</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
