
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Customer, CartItem, HirePurchase as HirePurchaseType } from '@/types';

interface HirePurchaseProps {
  totalAmount: number;
  customers: Customer[];
  cartItems: CartItem[];
  onCreateHirePurchase: (hirePurchaseData: Omit<HirePurchaseType, 'id'>) => string;
  onCancel: () => void;
}

export const HirePurchaseComponent: React.FC<HirePurchaseProps> = ({ 
  totalAmount, 
  customers, 
  cartItems, 
  onCreateHirePurchase, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [downPayment, setDownPayment] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const remainingBalance = totalAmount - downPayment;

  const handleCreateHirePurchase = () => {
    if (!selectedCustomer || cartItems.length === 0 || downPayment <= 0) {
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

    const hirePurchaseData: Omit<HirePurchaseType, 'id'> = {
      customerId: selectedCustomer.id,
      items: cartItems,
      totalAmount: totalAmount,
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
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create Hire Purchase
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Customer</Label>
            <Select 
              value={selectedCustomer?.id || ''} 
              onValueChange={(value) => {
                const customer = customers.find(c => c.id === value);
                setSelectedCustomer(customer || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Amount</Label>
              <Input
                type="number"
                value={totalAmount}
                readOnly
              />
            </div>
            <div>
              <Label>Down Payment</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={downPayment}
                onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Remaining Balance</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={remainingBalance}
                readOnly
              />
            </div>
            <div>
              <Label>Installment Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
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
          
          <Button onClick={handleCreateHirePurchase} className="w-full">
            Create Hire Purchase
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
