import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Customer, CartItem, HirePurchase } from '@/types';

interface HirePurchaseProps {
  customer: Customer | null;
  cartItems: CartItem[];
  total: number;
  onCreateHirePurchase: (hirePurchase: Omit<HirePurchase, 'id'>) => void;
}

export const HirePurchase: React.FC<HirePurchaseProps> = ({ customer, cartItems, total, onCreateHirePurchase }) => {
  const { toast } = useToast();
  const [downPayment, setDownPayment] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const remainingBalance = total - downPayment;

  const handleCreateHirePurchase = () => {
    if (!customer || cartItems.length === 0 || downPayment <= 0) {
      toast({
        title: "Error",
        description: "Please select customer, add items, and enter down payment",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    if (installmentPeriod === 'weekly') {
      endDate.setDate(startDate.getDate() + (Math.ceil(remainingBalance / installmentAmount) * 7));
    } else {
      endDate.setMonth(startDate.getMonth() + Math.ceil(remainingBalance / installmentAmount));
    }

    const nextPaymentDate = new Date();
    if (installmentPeriod === 'weekly') {
      nextPaymentDate.setDate(startDate.getDate() + 7);
    } else {
      nextPaymentDate.setMonth(startDate.getMonth() + 1);
    }

    const hirePurchaseData: Omit<HirePurchase, 'id'> = {
      customerId: customer.id,
      items: cartItems,
      totalAmount: total,
      downPayment: downPayment,
      remainingBalance: remainingBalance,
      installmentAmount: installmentAmount,
      installmentPeriod: installmentPeriod,
      startDate: startDate,
      endDate: endDate,
      nextPaymentDate: nextPaymentDate,
      status: 'active',
      payments: []
    };

    onCreateHirePurchase(hirePurchaseData);
    
    setDownPayment(0);
    setInstallmentAmount(0);
    setInstallmentPeriod('monthly');

    toast({
      title: "Hire Purchase Created",
      description: "Hire purchase agreement has been created",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Hire Purchase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Down Payment</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={downPayment}
              onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Remaining Balance</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={remainingBalance}
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Installment Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={installmentAmount}
              onChange={(e) => setInstallmentAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Installment Period</Label>
            <Select value={installmentPeriod} onValueChange={value => setInstallmentPeriod(value as 'weekly' | 'monthly')}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleCreateHirePurchase} className="w-full">
          Create Hire Purchase
        </Button>
      </CardContent>
    </Card>
  );
};
