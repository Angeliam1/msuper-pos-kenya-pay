
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentSplit } from '@/types';
import { CreditCard, Smartphone, Banknote, Building } from 'lucide-react';

interface PaymentMethodsProps {
  total: number;
  onComplete: (paymentSplits: PaymentSplit[], customerId?: string) => void;
  customerId?: string;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  total,
  onComplete,
  customerId
}) => {
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([]);
  const [cashAmount, setCashAmount] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [mpesaReference, setMpesaReference] = useState('');
  const [bankAmount, setBankAmount] = useState('');
  const [bankReference, setBankReference] = useState('');

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handlePayCash = () => {
    const amount = parseFloat(cashAmount) || total;
    const splits: PaymentSplit[] = [{ method: 'cash', amount }];
    onComplete(splits, customerId);
  };

  const handlePayMpesa = () => {
    const amount = parseFloat(mpesaAmount) || total;
    const splits: PaymentSplit[] = [{ 
      method: 'mpesa', 
      amount, 
      reference: mpesaReference 
    }];
    onComplete(splits, customerId);
  };

  const handlePayBank = () => {
    const amount = parseFloat(bankAmount) || total;
    const splits: PaymentSplit[] = [{ 
      method: 'bank', 
      amount, 
      reference: bankReference 
    }];
    onComplete(splits, customerId);
  };

  const handlePayCredit = () => {
    if (!customerId) return;
    const splits: PaymentSplit[] = [{ method: 'credit', amount: total }];
    onComplete(splits, customerId);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Total: {formatPrice(total)}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={handlePayCash}>
          <CardContent className="p-4 flex flex-col items-center">
            <Banknote className="h-8 w-8 mb-2 text-green-600" />
            <span className="text-sm font-medium">Cash</span>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md">
          <CardContent className="p-4 flex flex-col items-center">
            <Smartphone className="h-8 w-8 mb-2 text-green-600" />
            <span className="text-sm font-medium">M-Pesa</span>
            <div className="mt-2 w-full space-y-2">
              <Input
                placeholder="Amount"
                value={mpesaAmount}
                onChange={(e) => setMpesaAmount(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Input
                placeholder="Reference"
                value={mpesaReference}
                onChange={(e) => setMpesaReference(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button size="sm" className="w-full" onClick={handlePayMpesa}>
                Pay M-Pesa
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md">
          <CardContent className="p-4 flex flex-col items-center">
            <Building className="h-8 w-8 mb-2 text-blue-600" />
            <span className="text-sm font-medium">Bank</span>
            <div className="mt-2 w-full space-y-2">
              <Input
                placeholder="Amount"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Input
                placeholder="Reference"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button size="sm" className="w-full" onClick={handlePayBank}>
                Pay Bank
              </Button>
            </div>
          </CardContent>
        </Card>

        {customerId && (
          <Card className="cursor-pointer hover:shadow-md" onClick={handlePayCredit}>
            <CardContent className="p-4 flex flex-col items-center">
              <CreditCard className="h-8 w-8 mb-2 text-orange-600" />
              <span className="text-sm font-medium">Credit</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
