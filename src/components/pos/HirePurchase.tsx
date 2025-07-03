import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HirePurchase, Customer } from '@/types';
import { Calendar, CreditCard, ArrowLeft, MessageSquare, CheckCircle } from 'lucide-react';
import { sendHirePurchaseSMS } from '@/utils/smsService';
import { useToast } from '@/hooks/use-toast';

interface HirePurchaseProps {
  totalAmount: number;
  customers: Customer[];
  hirePurchases: HirePurchase[];
  cartItems: any[];
  storeSettings: any;
  onCreateHirePurchase: (hirePurchase: Omit<HirePurchase, 'id'>) => string;
  onCancel: () => void;
}

export const HirePurchaseComponent: React.FC<HirePurchaseProps> = ({
  totalAmount,
  customers,
  hirePurchases,
  cartItems = [],
  storeSettings = {},
  onCreateHirePurchase,
  onCancel
}) => {
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [numberOfInstallments, setNumberOfInstallments] = useState(12);
  const [isCreating, setIsCreating] = useState(false);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  
  const remainingAmount = totalAmount - downPayment;
  const installmentAmount = remainingAmount / numberOfInstallments;
  
  const nextPaymentDate = new Date();
  if (installmentPeriod === 'weekly') {
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
  } else {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  const handleCreateHirePurchase = async () => {
    if (!selectedCustomerId || downPayment < 0 || numberOfInstallments < 1) return;

    setIsCreating(true);
    
    try {
      const hirePurchaseId = onCreateHirePurchase({
        customerId: selectedCustomerId,
        totalAmount,
        downPayment,
        remainingBalance: remainingAmount,  // Fixed property name
        installmentAmount,
        installmentPeriod,
        nextPaymentDate,
        status: 'active'
      });

      console.log('Hire purchase created:', hirePurchaseId);

      // Send SMS automatically if SMS is enabled
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer && storeSettings.smsEnabled) {
        const itemsText = cartItems.map(item => `${item.name} x${item.quantity}`).join(', ');
        
        // Generate payment link with payment options
        const paymentOptions = [];
        if (storeSettings.mpesaPaybill && storeSettings.mpesaAccount) {
          paymentOptions.push(`M-Pesa Paybill: ${storeSettings.mpesaPaybill} Account: ${storeSettings.mpesaAccount}`);
        }
        if (storeSettings.mpesaTill) {
          paymentOptions.push(`M-Pesa Till: ${storeSettings.mpesaTill}`);
        }
        if (storeSettings.bankAccount) {
          paymentOptions.push(`Bank: ${storeSettings.bankAccount}`);
        }
        
        const paymentLink = `${window.location.origin}/payment?hp=${hirePurchaseId}\n\nPayment Options:\n${paymentOptions.join('\n')}`;
        
        const smsSuccess = await sendHirePurchaseSMS(
          {
            customerName: selectedCustomer.name,
            customerPhone: selectedCustomer.phone,
            businessName: storeSettings.businessName || 'TOPTEN ELECTRONICS',
            businessPhone: storeSettings.businessPhone || '0725333337',
            items: itemsText,
            total: totalAmount,
            paid: downPayment,
            balance: remainingAmount,
            paymentLink,
            transactionId: hirePurchaseId
          },
          storeSettings.hirePurchaseTemplate || 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
          storeSettings.smsProvider || 'phone'
        );

        if (smsSuccess) {
          toast({
            title: "Hire Purchase Created",
            description: "SMS with payment link sent to customer successfully!",
          });
        } else {
          toast({
            title: "Hire Purchase Created",
            description: "Created successfully, but failed to send SMS.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Hire Purchase Created",
          description: "Agreement created successfully!",
        });
      }

      // Reset form
      setSelectedCustomerId('');
      setDownPayment(0);
      setNumberOfInstallments(12);
      
    } catch (error) {
      console.error('Error creating hire purchase:', error);
      toast({
        title: "Error",
        description: "Failed to create hire purchase agreement.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Hire Purchase Setup
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(totalAmount)}</p>
          </div>

          <div className="space-y-2">
            <Label>Customer *</Label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
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
            {selectedCustomer && (
              <div className="text-sm text-gray-600">
                Credit Limit: {formatPrice(selectedCustomer.creditLimit)} | 
                Outstanding: {formatPrice(selectedCustomer.outstandingBalance)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Down Payment (KES)</Label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                max={totalAmount}
                min={0}
              />
            </div>
            <div>
              <Label>Number of Installments</Label>
              <Input
                type="number"
                value={numberOfInstallments}
                onChange={(e) => setNumberOfInstallments(Number(e.target.value))}
                min={1}
                max={60}
              />
            </div>
          </div>

          <div>
            <Label>Payment Period</Label>
            <Select value={installmentPeriod} onValueChange={(value: 'weekly' | 'monthly') => setInstallmentPeriod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
            <h4 className="font-medium">Payment Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Down Payment:</p>
                <p className="font-medium">{formatPrice(downPayment)}</p>
              </div>
              <div>
                <p className="text-gray-600">Remaining Amount:</p>
                <p className="font-medium">{formatPrice(remainingAmount)}</p>
              </div>
              <div>
                <p className="text-gray-600">Installment Amount:</p>
                <p className="font-bold text-green-600">{formatPrice(installmentAmount)}</p>
              </div>
              <div>
                <p className="text-gray-600">Next Payment:</p>
                <p className="font-medium">{nextPaymentDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {storeSettings.smsEnabled && selectedCustomer && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                SMS will be sent automatically to {selectedCustomer.phone}
              </span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          )}

          <Button
            onClick={handleCreateHirePurchase}
            className="w-full"
            disabled={!selectedCustomerId || remainingAmount <= 0 || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Hire Purchase Agreement'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Hire Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hirePurchases.filter(hp => hp.status === 'active').map(hp => {
                const customer = customers.find(c => c.id === hp.customerId);
                return (
                  <TableRow key={hp.id}>
                    <TableCell>{customer?.name || 'Unknown'}</TableCell>
                    <TableCell>{formatPrice(hp.totalAmount)}</TableCell>
                    <TableCell>{formatPrice(hp.remainingBalance)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(hp.nextPaymentDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{hp.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
