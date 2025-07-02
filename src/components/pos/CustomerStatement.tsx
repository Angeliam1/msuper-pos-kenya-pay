
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Customer, Transaction } from '@/types';
import { FileText, Calendar, ShoppingCart, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

interface CustomerStatementProps {
  customer: Customer;
  transactions: Transaction[];
  onClose: () => void;
}

export const CustomerStatement: React.FC<CustomerStatementProps> = ({
  customer,
  transactions,
  onClose
}) => {
  const [dateRange, setDateRange] = useState('all');
  
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  
  const totalSpent = customerTransactions.reduce((sum, t) => sum + t.total, 0);
  const averageSpent = customerTransactions.length > 0 ? totalSpent / customerTransactions.length : 0;
  
  const loyaltyPoints = (customer as any).loyaltyPoints || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Customer Statement - {customer.name}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span className="font-semibold text-blue-600">{loyaltyPoints} points</span>
                </div>
                <div className="pt-2 border-t">
                  <Badge variant={customer.outstandingBalance > customer.creditLimit ? 'destructive' : 'default'}>
                    {customer.outstandingBalance > customer.creditLimit ? 'Over Credit Limit' : 'Good Standing'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Transaction History</CardTitle>
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
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                        <TableCell className="font-mono text-sm">#{transaction.id.slice(-8)}</TableCell>
                        <TableCell>{transaction.items.length} items</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {transaction.paymentSplits.map((split, index) => (
                              <Badge key={index} variant="outline">
                                {split.method}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatPrice(transaction.total)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'voided' ? 'destructive' : 'secondary'
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
