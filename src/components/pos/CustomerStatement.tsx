
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer, Transaction, Product } from '@/types';
import { FileText, Calendar, ShoppingCart, CreditCard, Phone, Mail, MapPin, MessageSquare, Receipt, TrendingUp } from 'lucide-react';
import { sendHirePurchaseSMS } from '@/utils/smsService';

interface CustomerStatementProps {
  customer: Customer;
  transactions: Transaction[];
  products: Product[];
  onClose: () => void;
}

export const CustomerStatement: React.FC<CustomerStatementProps> = ({
  customer,
  transactions,
  products,
  onClose
}) => {
  const [dateRange, setDateRange] = useState('all');
  const [smsTemplate, setSMSTemplate] = useState(
    'Hi {customerName}, your outstanding balance is KES {balance}. Please pay via M-Pesa to {businessPhone} or call {businessName} at {businessPhone}. Thank you!'
  );
  const [showSMSDialog, setShowSMSDialog] = useState(false);
  
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  
  const totalSpent = customerTransactions.reduce((sum, t) => sum + t.total, 0);
  const averageSpent = customerTransactions.length > 0 ? totalSpent / customerTransactions.length : 0;
  
  // Calculate total profit from this customer
  const totalProfit = customerTransactions.reduce((profit, transaction) => {
    const transactionProfit = transaction.items.reduce((itemProfit, item) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const profitPerItem = item.price - (product.buyingCost || 0);
        return itemProfit + (profitPerItem * item.quantity);
      }
      return itemProfit;
    }, 0);
    return profit + transactionProfit;
  }, 0);

  const handleSendSMS = async (provider: 'phone' | 'whatsapp' | 'api') => {
    const message = {
      customerName: customer.name,
      customerPhone: customer.phone,
      businessName: 'Your Store', // This should come from store settings
      businessPhone: '0700000000', // This should come from store settings
      items: 'Various items',
      total: customer.outstandingBalance,
      paid: 0,
      balance: customer.outstandingBalance
    };

    const success = await sendHirePurchaseSMS(message, smsTemplate, provider);
    if (success) {
      console.log('SMS sent successfully');
      setShowSMSDialog(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Customer Statement - {customer.name}
            </CardTitle>
            <div className="flex gap-2">
              {customer.outstandingBalance > 0 && (
                <Dialog open={showSMSDialog} onOpenChange={setShowSMSDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Payment Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Payment Request SMS</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>SMS Template</Label>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={4}
                          value={smsTemplate}
                          onChange={(e) => setSMSTemplate(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use {'{customerName}'}, {'{balance}'}, {'{businessName}'}, {'{businessPhone}'} as placeholders
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSendSMS('whatsapp')} className="flex-1">
                          WhatsApp
                        </Button>
                        <Button onClick={() => handleSendSMS('phone')} variant="outline" className="flex-1">
                          SMS
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Registered: {formatDate(customer.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Credit Limit:</span>
                  <span className="font-semibold">{formatPrice(customer.creditLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Balance:</span>
                  <span className={`font-semibold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatPrice(customer.outstandingBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loyalty Points:</span>
                  <span className="font-semibold text-blue-600">{customer.loyaltyPoints} points</span>
                </div>
                <div className="pt-2 border-t">
                  <Badge variant={customer.outstandingBalance > customer.creditLimit ? 'destructive' : 'default'}>
                    {customer.outstandingBalance > customer.creditLimit ? 'Over Credit Limit' : 'Good Standing'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Business Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Profit Generated:</span>
                  <span className="font-semibold text-green-600">{formatPrice(totalProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-semibold">
                    {totalSpent > 0 ? ((totalProfit / totalSpent) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Value:</span>
                  <Badge variant="outline" className="text-purple-600">
                    {totalSpent > 50000 ? 'High Value' : totalSpent > 20000 ? 'Medium Value' : 'Regular'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Purchase Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{customerTransactions.length}</div>
                  <div className="text-sm text-gray-600">Total Purchases</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatPrice(totalSpent)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatPrice(averageSpent)}</div>
                  <div className="text-sm text-gray-600">Average Purchase</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatPrice(totalProfit)}</div>
                  <div className="text-sm text-gray-600">Total Profit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Transaction History & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No transactions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerTransactions.map(transaction => {
                      const transactionProfit = transaction.items.reduce((profit, item) => {
                        const product = products.find(p => p.id === item.id);
                        const profitPerItem = product ? item.price - (product.buyingCost || 0) : 0;
                        return profit + (profitPerItem * item.quantity);
                      }, 0);

                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                          <TableCell className="font-mono text-sm">#{transaction.id.slice(-8)}</TableCell>
                          <TableCell>{transaction.items.length} items</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {transaction.paymentSplits.map((split, index) => (
                                <Badge key={index} variant="outline">
                                  {split.method === 'mpesa' ? 'M-Pesa' : split.method}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatPrice(transaction.total)}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatPrice(transactionProfit)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === 'completed' ? 'default' :
                              transaction.status === 'voided' ? 'destructive' : 'secondary'
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
