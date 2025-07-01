
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
  console.log('SplitPayment component rendering with totalAmount:', totalAmount);

  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([
    { method: 'cash', amount: Math.round(totalAmount / 2) },
    { method: 'mpesa', amount: Math.round(totalAmount / 2) }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('walk-in');

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  
  const totalSplits = paymentSplits.reduce((sum, split) => sum + (Number(split.amount) || 0), 0);
  const remainingAmount = totalAmount - totalSplits;

  // Add error boundary protection at component level
  useEffect(() => {
    console.log('SplitPayment useEffect - totalAmount:', totalAmount, 'customers:', customers?.length);
    if (!totalAmount || totalAmount <= 0) {
      console.error('Invalid totalAmount:', totalAmount);
    }
  }, [totalAmount, customers]);

  const addSplit = () => {
    console.log('Adding new split');
    setPaymentSplits([...paymentSplits, { method: 'cash', amount: Math.max(0, remainingAmount) }]);
  };

  const updateSplit = (index: number, field: keyof PaymentSplit, value: any) => {
    console.log('Updating split:', index, field, value);
    const newSplits = [...paymentSplits];
    if (field === 'amount') {
      const numValue = Number(value) || 0;
      newSplits[index] = { ...newSplits[index], [field]: Math.max(0, numValue) };
    } else {
      newSplits[index] = { ...newSplits[index], [field]: value };
    }
    setPaymentSplits(newSplits);
  };

  const removeSplit = (index: number) => {
    if (paymentSplits.length > 1) {
      console.log('Removing split at index:', index);
      setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
    }
  };

  const handleConfirm = () => {
    console.log('Confirming payment with splits:', paymentSplits);
    if (Math.abs(remainingAmount) < 0.01) {
      const finalCustomerId = selectedCustomerId === 'walk-in' ? undefined : selectedCustomerId;
      onConfirmPayment(paymentSplits, finalCustomerId);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return <Smartphone className="h-4 w-4" />;
      case 'credit': return <CreditCard className="h-4 w-4" />;
      default: return <Banknote className="h-4 w-4" />;
    }
  };

  const balanceLastSplit = () => {
    if (paymentSplits.length > 0) {
      const lastIndex = paymentSplits.length - 1;
      const otherSplitsTotal = paymentSplits
        .slice(0, lastIndex)
        .reduce((sum, split) => sum + (Number(split.amount) || 0), 0);
      
      const remainingForLast = Math.max(0, totalAmount - otherSplitsTotal);
      
      const newSplits = [...paymentSplits];
      newSplits[lastIndex] = { ...newSplits[lastIndex], amount: remainingForLast };
      setPaymentSplits(newSplits);
    }
  };

  // Add error boundary protection
  if (!totalAmount || totalAmount <= 0) {
    console.error('SplitPayment: Invalid transaction amount');
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">Invalid transaction amount: {totalAmount}</p>
            <Button onClick={onCancel} className="w-full mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customers) {
    console.error('SplitPayment: No customers provided');
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">Error loading customer data</p>
            <Button onClick={onCancel} className="w-full mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Split Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Payment Methods</Label>
              <Button size="sm" variant="outline" onClick={addSplit}>
                <Plus className="h-4 w-4 mr-2" />
                Add Split
              </Button>
            </div>

            {paymentSplits.map((split, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <Select
                      value={split.method || 'cash'}
                      onValueChange={(value) => updateSplit(index, 'method', value)}
                    >
                      <SelectTrigger className="mt-1">
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
                  
                  <div>
                    <Label className="text-sm font-medium">Amount (KES)</Label>
                    <Input
                      type="number"
                      value={split.amount || ''}
                      onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="mt-1"
                    />
                  </div>

                  {split.method === 'mpesa' && (
                    <div>
                      <Label className="text-sm font-medium">M-Pesa Reference</Label>
                      <Input
                        value={split.reference || ''}
                        onChange={(e) => updateSplit(index, 'reference', e.target.value)}
                        placeholder="Enter M-Pesa code"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(split.method || 'cash')}
                    <span className="font-medium">{formatPrice(split.amount || 0)}</span>
                  </div>
                  
                  {paymentSplits.length > 1 && (
                    <Button size="sm" variant="destructive" onClick={() => removeSplit(index)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total Splits:</span>
              <span className="font-bold">{formatPrice(totalSplits)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Remaining:</span>
              <Badge variant={Math.abs(remainingAmount) < 0.01 ? 'default' : 'destructive'} className="text-sm">
                {formatPrice(remainingAmount)}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={balanceLastSplit} variant="outline" className="flex-1">
                Auto Balance
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
                disabled={Math.abs(remainingAmount) > 0.01}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
