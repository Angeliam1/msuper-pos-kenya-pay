import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CartItem, HeldTransaction, Customer } from '@/types';
import { Pause, Search, Clock, User, FileText, Trash2, ShoppingCart } from 'lucide-react';

interface HoldTransactionProps {
  items: CartItem[];
  customers: Customer[];
  heldTransactions: HeldTransaction[];
  currentAttendant: string;
  onHoldTransaction: (customerId?: string, customerName?: string, note?: string) => void;
  onRetrieveTransaction: (heldTransaction: HeldTransaction) => void;
  onDeleteHeldTransaction: (id: string) => void;
  onCancel: () => void;
}

export const HoldTransaction: React.FC<HoldTransactionProps> = ({
  items,
  customers,
  heldTransactions,
  currentAttendant,
  onHoldTransaction,
  onRetrieveTransaction,
  onDeleteHeldTransaction,
  onCancel
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hold' | 'retrieve'>('hold');

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleHoldTransaction = () => {
    const customer = customers.find(c => c.id === selectedCustomer);
    onHoldTransaction(
      selectedCustomer || undefined,
      customer?.name || customerName || undefined,
      note || undefined
    );
  };

  const filteredHeldTransactions = heldTransactions.filter(held => {
    const searchLower = searchTerm.toLowerCase();
    return (
      held.id.toLowerCase().includes(searchLower) ||
      held.customerName?.toLowerCase().includes(searchLower) ||
      held.note?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pause className="h-5 w-5" />
          Hold & Retrieve Transactions
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'hold' ? 'default' : 'outline'}
            onClick={() => setActiveTab('hold')}
            className="flex items-center gap-2"
          >
            <Pause className="h-4 w-4" />
            Hold Current Transaction
          </Button>
          <Button
            variant={activeTab === 'retrieve' ? 'default' : 'outline'}
            onClick={() => setActiveTab('retrieve')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Retrieve Held Transactions ({heldTransactions.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeTab === 'hold' && (
          <div className="space-y-6">
            {/* Current Transaction Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Current Transaction Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">...and {items.length - 3} more items</p>
                )}
              </div>
            </div>

            {/* Hold Transaction Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer (Optional)</Label>
                  <select
                    id="customer"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a customer...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Or Enter Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in customer name..."
                    disabled={!!selectedCustomer}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this transaction..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleHoldTransaction}
                className="flex items-center gap-2"
                disabled={items.length === 0}
              >
                <Pause className="h-4 w-4" />
                Hold Transaction
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'retrieve' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by transaction ID, customer name, or note..."
                className="pl-10"
              />
            </div>

            {/* Held Transactions List */}
            {filteredHeldTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {heldTransactions.length === 0 ? 'No held transactions' : 'No transactions match your search'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHeldTransactions.map(held => (
                  <div key={held.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">Transaction #{held.id}</span>
                        <Badge variant="secondary">
                          {held.items.length} item{held.items.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onRetrieveTransaction(held)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Retrieve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteHeldTransaction(held.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Held At</p>
                        <p className="font-medium">
                          {new Date(held.heldAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Held By</p>
                        <p className="font-medium">{held.heldBy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium">
                          {held.customerName || 'Walk-in'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold text-green-600">
                          {formatPrice(held.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                        </p>
                      </div>
                    </div>

                    {held.note && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-600">{held.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button onClick={onCancel} variant="outline">
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
