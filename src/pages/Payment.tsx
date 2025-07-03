
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Phone, 
  Building2, 
  Calendar, 
  ShoppingCart, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get hire purchase ID from URL
  const hirePurchaseId = searchParams.get('hp');
  const customerId = searchParams.get('customer');
  const amount = searchParams.get('amount');
  const transactionId = searchParams.get('transaction');

  // Mock data - in a real app, this would come from your database
  const hirePurchaseData = {
    id: hirePurchaseId,
    customerName: 'Michael',
    items: 'Rice 2kg x6',
    totalAmount: 2100,
    paidAmount: 300,
    balance: 1800,
    nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    installmentAmount: 300,
    paymentPeriod: 'monthly'
  };

  const paymentMethods = {
    mpesaPaybill: '247247',
    mpesaAccount: '333337',
    mpesaTill: '123456',
    bankAccount: 'KCB Bank Account: 1234567890',
    businessName: 'TOPTEN ELECTRONICS'
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your M-Pesa phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate M-Pesa STK push
    setTimeout(() => {
      toast({
        title: "Payment Request Sent",
        description: `STK push sent to ${phoneNumber}. Please complete payment on your phone.`,
      });
      setIsProcessing(false);
    }, 2000);
  };

  if (!hirePurchaseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Invalid Payment Link</h1>
            <p className="text-gray-600 mb-4">This payment link is invalid or has expired.</p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment Portal</h1>
          <p className="text-gray-600">{paymentMethods.businessName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Purchase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Customer</p>
                <p className="text-lg font-semibold">{hirePurchaseData.customerName}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{hirePurchaseData.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">{formatPrice(hirePurchaseData.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid:</span>
                  <span className="font-semibold text-green-600">{formatPrice(hirePurchaseData.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Outstanding Balance:</span>
                  <span className="font-bold text-red-600">{formatPrice(hirePurchaseData.balance)}</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Next Payment Due</span>
                </div>
                <p className="text-sm text-yellow-700">
                  {hirePurchaseData.nextPaymentDate.toLocaleDateString()} - 
                  {formatPrice(hirePurchaseData.installmentAmount)} ({hirePurchaseData.paymentPeriod})
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* M-Pesa STK Push */}
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">M-Pesa STK Push</span>
                  <Badge variant="default" className="bg-green-600">Recommended</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0722000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleMpesaPayment}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing...' : 'Pay via M-Pesa'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Manual Payment Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Manual Payment Options</h4>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">M-Pesa Paybill</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Paybill: <span className="font-mono font-bold">{paymentMethods.mpesaPaybill}</span><br/>
                    Account: <span className="font-mono font-bold">{paymentMethods.mpesaAccount}</span>
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">M-Pesa Till</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Till Number: <span className="font-mono font-bold">{paymentMethods.mpesaTill}</span>
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <p className="text-sm text-gray-600">{paymentMethods.bankAccount}</p>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  After making payment, please call or SMS us at<br/>
                  <span className="font-semibold">0725-333-337</span> for confirmation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments (if any) */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Down Payment</p>
                    <p className="text-sm text-gray-600">Initial payment received</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatPrice(hirePurchaseData.paidAmount)}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
