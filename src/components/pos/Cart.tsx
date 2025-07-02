import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CartItem, Transaction, PaymentSplit, Customer } from '@/types';
import { Minus, Plus, Trash2, Smartphone, Banknote, CreditCard, Split, Pause, Edit3, UserPlus, Gift, Percent } from 'lucide-react';
import { MPesaPayment } from './MPesaPayment';
import { Receipt } from './Receipt';

interface CartProps {
  items: CartItem[];
  customers: Customer[];
  onUpdateItem: (id: string, quantity: number) => void;
  onUpdateItemPrice: (id: string, newPrice: number) => void;
  onCompleteTransaction: (paymentMethod: 'mpesa' | 'cash', mpesaReference?: string, customerId?: string, discount?: number, loyaltyPointsUsed?: number) => Transaction;
  onSplitPayment: () => void;
  onHirePurchase: () => void;
  onHoldTransaction: () => void;
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'createdAt'>) => void;
  onUpdateCustomerLoyaltyPoints: (customerId: string, pointsUsed: number) => void;
  storeSettings: {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeEmail: string;
    paybill: string;
    showStoreName: boolean;
    showStoreAddress: boolean;
    showStorePhone: boolean;
    showCustomerName: boolean;
    showCustomerPhone: boolean;
    showCustomerAddress: boolean;
    showNotes: boolean;
    receiptHeader: string;
    receiptFooter: string;
    showBarcode: boolean;
  };
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  customers,
  onUpdateItem,
  onUpdateItemPrice,
  onCompleteTransaction,
  onSplitPayment,
  onHirePurchase,
  onHoldTransaction,
  onAddCustomer,
  onUpdateCustomerLoyaltyPoints,
  storeSettings
}) => {
  const [showMPesaPayment, setShowMPesaPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('no-customer');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: 0,
    outstandingBalance: 0
  });

  // Discount and loyalty points state
  const [discount, setDiscount] = useState({ type: 'none' as 'none' | 'percentage' | 'amount', value: 0 });
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = (subtotal * discount.value) / 100;
  } else if (discount.type === 'amount') {
    discountAmount = discount.value;
  }

  // Calculate loyalty points discount (10 points = 1 KES)
  const loyaltyDiscount = loyaltyPointsUsed / 10;
  
  const total = Math.max(0, subtotal - discountAmount - loyaltyDiscount);
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const availableLoyaltyPoints = selectedCustomer ? ((selectedCustomer as any).loyaltyPoints || 0) : 0;

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      onAddCustomer(newCustomer);
      setNewCustomer({
        name: '',
        phone: '',
        email: '',
        address: '',
        creditLimit: 0,
        outstandingBalance: 0
      });
      setShowAddCustomer(false);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const item = items.find(i => i.id === id);
    if (item && newQuantity > item.stock) {
      alert(`Cannot add more items. Only ${item.stock} in stock.`);
      return;
    }
    
    onUpdateItem(id, newQuantity);
  };

  const handleDirectQuantityEdit = (item: CartItem) => {
    setEditingQuantity(item.id);
    setTempQuantity(item.quantity.toString());
  };

  const handleQuantityUpdate = (item: CartItem) => {
    const newQuantity = parseInt(tempQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      setEditingQuantity(null);
      return;
    }
    if (newQuantity > item.stock) {
      alert(`Cannot add more items. Only ${item.stock} in stock.`);
      setEditingQuantity(null);
      return;
    }
    
    onUpdateItem(item.id, newQuantity);
    setEditingQuantity(null);
  };

  const handlePriceEdit = (item: CartItem) => {
    setEditingPrice(item.id);
    setTempPrice(item.price.toString());
  };

  const handlePriceUpdate = (item: CartItem) => {
    const newPrice = parseFloat(tempPrice);
    const wholesalePrice = item.wholesalePrice || item.price;
    
    if (isNaN(newPrice) || newPrice < wholesalePrice) {
      alert(`Price cannot be lower than the wholesale price of KES ${wholesalePrice.toLocaleString()}`);
      setEditingPrice(null);
      return;
    }
    
    onUpdateItemPrice(item.id, newPrice);
    setEditingPrice(null);
  };

  const handleCashPayment = () => {
    const finalCustomerId = selectedCustomerId === 'no-customer' ? undefined : selectedCustomerId;
    
    // Update customer loyalty points if used
    if (finalCustomerId && loyaltyPointsUsed > 0) {
      onUpdateCustomerLoyaltyPoints(finalCustomerId, loyaltyPointsUsed);
    }
    
    const transaction = onCompleteTransaction('cash', undefined, finalCustomerId, discountAmount, loyaltyPointsUsed);
    setCurrentTransaction(transaction);
    setShowReceipt(true);
    resetDiscountAndLoyalty();
  };

  const handleMPesaPayment = (reference: string) => {
    const finalCustomerId = selectedCustomerId === 'no-customer' ? undefined : selectedCustomerId;
    
    // Update customer loyalty points if used
    if (finalCustomerId && loyaltyPointsUsed > 0) {
      onUpdateCustomerLoyaltyPoints(finalCustomerId, loyaltyPointsUsed);
    }
    
    const transaction = onCompleteTransaction('mpesa', reference, finalCustomerId, discountAmount, loyaltyPointsUsed);
    setCurrentTransaction(transaction);
    setShowMPesaPayment(false);
    setShowReceipt(true);
    resetDiscountAndLoyalty();
  };

  const resetDiscountAndLoyalty = () => {
    setDiscount({ type: 'none', value: 0 });
    setLoyaltyPointsUsed(0);
  };

  if (showReceipt && currentTransaction) {
    return (
      <Receipt
        transaction={currentTransaction}
        onClose={() => {
          setShowReceipt(false);
          setCurrentTransaction(null);
        }}
        storeSettings={storeSettings}
        customer={selectedCustomer ? {
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          address: selectedCustomer.address || ''
        } : undefined}
      />
    );
  }

  if (showMPesaPayment) {
    return (
      <MPesaPayment
        amount={total}
        onSuccess={handleMPesaPayment}
        onCancel={() => setShowMPesaPayment(false)}
      />
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Customer Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Customer (Optional)</Label>
          <div className="flex gap-2">
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-customer">No customer</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Address"
                    />
                  </div>
                  <div>
                    <Label>Credit Limit</Label>
                    <Input
                      type="number"
                      value={newCustomer.creditLimit}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, creditLimit: Number(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCustomer} className="flex-1">Add Customer</Button>
                    <Button variant="outline" onClick={() => setShowAddCustomer(false)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">Cart is empty</p>
        ) : (
          <>
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {editingPrice === item.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.01"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="h-6 w-20 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={() => handlePriceUpdate(item)}
                                className="h-6 px-2 text-xs"
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPrice(null)}
                                className="h-6 px-2 text-xs"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-green-600 font-semibold text-xs sm:text-sm">
                                {formatPrice(item.price)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePriceEdit(item)}
                                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Stock: {item.stock} | Unit: {item.unit} | Wholesale: {formatPrice(item.wholesalePrice || item.price)}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUpdateItem(item.id, 0)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        {editingQuantity === item.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={tempQuantity}
                              onChange={(e) => setTempQuantity(e.target.value)}
                              className="w-16 h-6 text-xs text-center"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleQuantityUpdate(item)}
                              className="h-6 px-2 text-xs"
                            >
                              ✓
                            </Button>
                          </div>
                        ) : (
                          <span 
                            className="w-6 sm:w-8 text-center font-medium text-sm cursor-pointer hover:bg-gray-200 rounded px-1"
                            onClick={() => handleDirectQuantityEdit(item)}
                          >
                            {item.quantity}
                          </span>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <span className="font-semibold text-xs sm:text-sm text-green-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Section */}
            <div className="space-y-2 border-t pt-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Discount
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={discount.type} onValueChange={(value: 'none' | 'percentage' | 'amount') => setDiscount({ type: value, value: 0 })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={discount.value}
                  onChange={(e) => setDiscount(prev => ({ ...prev, value: Number(e.target.value) || 0 }))}
                  placeholder="0"
                  disabled={discount.type === 'none'}
                />
                <div className="text-sm text-green-600 font-semibold flex items-center">
                  -{formatPrice(discountAmount)}
                </div>
              </div>
            </div>

            {/* Loyalty Points Section */}
            {selectedCustomer && availableLoyaltyPoints > 0 && (
              <div className="space-y-2 border-t pt-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Loyalty Points ({availableLoyaltyPoints} available)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={loyaltyPointsUsed}
                    onChange={(e) => setLoyaltyPointsUsed(Math.min(Number(e.target.value) || 0, availableLoyaltyPoints, subtotal * 10))}
                    placeholder="Points to use"
                    max={Math.min(availableLoyaltyPoints, subtotal * 10)}
                  />
                  <div className="text-sm text-blue-600 font-semibold flex items-center">
                    -{formatPrice(loyaltyDiscount)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">10 points = KES 1</p>
              </div>
            )}

            <div className="border-t pt-3 sm:pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Loyalty Points:</span>
                  <span>-{formatPrice(loyaltyDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowMPesaPayment(true)}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9 sm:h-10"
                  disabled={items.length === 0}
                >
                  <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  M-Pesa
                </Button>
                <Button
                  onClick={handleCashPayment}
                  variant="outline"
                  disabled={items.length === 0}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Banknote className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Cash
                </Button>
                <Button
                  onClick={onSplitPayment}
                  variant="outline"
                  disabled={items.length === 0}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Split className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Split Pay
                </Button>
                <Button
                  onClick={onHirePurchase}
                  variant="outline"
                  disabled={items.length === 0}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                >
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Hire Purchase
                </Button>
              </div>
              
              <Button
                onClick={onHoldTransaction}
                variant="secondary"
                className="w-full text-xs sm:text-sm h-9 sm:h-10"
                disabled={items.length === 0}
              >
                <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Hold Transaction
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
