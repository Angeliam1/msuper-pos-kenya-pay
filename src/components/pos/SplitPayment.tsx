
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PaymentSplit, Customer } from '@/types';
import { Plus, Trash2, CreditCard, Smartphone, Banknote, ArrowLeft } from 'lucide-react';

interface SplitPaymentProps {
  totalAmount: number;
  customers: Customer[];
  onConfirmPayment: (splits: PaymentSplit[], customerId?: string) => void;
  onCancel: () => void;
}

export const SplitPayment: React.FC<SplitPaymentProps> = ({
  totalAmount,
  customers,
  onConfirmPayment,
  onCancel
}) => {
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([
    { method: 'cash', amount: totalAmount }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  
  const totalSplits = paymentSplits.reduce((sum, split) => sum + (Number(split.amount) || 0), 0);
  const remainingAmount = totalAmount - totalSplits;

  const addSplit = () => {
    setPaymentSplits([...paymentSplits, { method: 'cash', amount: 0 }]);
  };

  const updateSplit = (index: number, field: keyof PaymentSplit, value: any) => {
    const newSplits = [...paymentSplits];
    if (field === 'amount') {
      newSplits[index] = { ...newSplits[index], [field]: Number(value) || 0 };
    } else {
      newSplits[index] = { ...newSplits[index], [field]: value };
    }
    setPaymentSplits(newSplits);
  };

  const removeSplit = (index: number) => {
    if (paymentSplits.length > 1) {
      setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
    }
  };

  const handleConfirm = () => {
    if (Math.abs(remainingAmount) < 0.01) {
      onConfirmPayment(paymentSplits, selectedCustomerId || undefined);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return <Smartphone className="h-4 w-4" />;
      case 'credit': return <CreditCard className="h-4 w-4" />;
      default: return <Banknote className="h-4 w-4" />;
    }
  };

  // Auto-balance the last split when others change
  useEffect(() => {
    if (paymentSplits.length > 1) {
      const lastIndex = paymentSplits.length - 1;
      const otherSplitsTotal = paymentSplits
        .slice(0, lastIndex)
        .reduce((sum, split) => sum + (Number(split.amount) || 0), 0);
      
      const remainingForLast = Math.max(0, totalAmount - otherSplitsTotal);
      
      if (paymentSplits[lastIndex].amount !== remainingForLast) {
        const newSplits = [...paymentSplits];
        newSplits[lastIndex] = { ...newSplits[lastIndex], amount: remainingForLast };
        setPaymentSplits(newSplits);
      }
    }
  }, [paymentSplits, totalAmount]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Split Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(totalAmount)}</p>
        </div>

        <div className="space-y-2">
          <Label>Customer (Optional)</Label>
          <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No customer</SelectItem>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Payment Methods</Label>
            <Button size="sm" variant="outline" onClick={addSplit}>
              <Plus className="h-3 w-3 mr-1" />
              Add Split
            </Button>
          </div>

          {paymentSplits.map((split, index) => (
            <div key={index} className="flex gap-2 items-end p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-xs">Method</Label>
                <Select
                  value={split.method}
                  onValueChange={(value) => updateSplit(index, 'method', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="mpesa">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        M-Pesa
                      </div>
                    </SelectItem>
                    <SelectItem value="credit">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label className="text-xs">Amount</Label>
                <Input
                  type="number"
                  value={split.amount || ''}
                  onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              {split.method === 'mpesa' && (
                <div className="flex-1">
                  <Label className="text-xs">Reference</Label>
                  <Input
                    value={split.reference || ''}
                    onChange={(e) => updateSplit(index, 'reference', e.target.value)}
                    placeholder="MPE123..."
                  />
                </div>
              )}

              {paymentSplits.length > 1 && (
                <Button size="sm" variant="outline" onClick={() => removeSplit(index)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Splits:</span>
            <span>{formatPrice(totalSplits)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Remaining:</span>
            <Badge variant={Math.abs(remainingAmount) < 0.01 ? 'default' : 'destructive'}>
              {formatPrice(remainingAmount)}
            </Badge>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full"
          disabled={Math.abs(remainingAmount) > 0.01}
        >
          Confirm Split Payment
        </Button>
      </CardContent>
    </Card>
  );
};
