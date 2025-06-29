import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CartItem, Transaction, PaymentSplit } from '@/types';
import { Minus, Plus, Trash2, Smartphone, Banknote, CreditCard, Split, Pause, Edit3 } from 'lucide-react';
import { MPesaPayment } from './MPesaPayment';
import { Receipt } from './Receipt';

interface CartProps {
  items: CartItem[];
  onUpdateItem: (id: string, quantity: number) => void;
  onUpdateItemPrice: (id: string, newPrice: number) => void;
  onCompleteTransaction: (paymentMethod: 'mpesa' | 'cash', mpesaReference?: string) => Transaction;
  onSplitPayment: () => void;
  onHirePurchase: () => void;
  onHoldTransaction: () => void;
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
  customer?: {
    name: string;
    phone: string;
    address: string;
  };
  notes?: string;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateItem,
  onUpdateItemPrice,
  onCompleteTransaction,
  onSplitPayment,
  onHirePurchase,
  onHoldTransaction,
  storeSettings,
  customer,
  notes
}) => {
  const [showMPesaPayment, setShowMPesaPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const item = items.find(i => i.id === id);
    if (item && newQuantity > item.stock) {
      alert(`Cannot add more items. Only ${item.stock} in stock.`);
      return;
    }
    
    onUpdateItem(id, newQuantity);
  };

  const handlePriceEdit = (item: CartItem) => {
    setEditingPrice(item.id);
    setTempPrice(item.price.toString());
  };

  const handlePriceUpdate = (item: CartItem) => {
    const newPrice = parseFloat(tempPrice);
    const originalPrice = item.price; // This should be the original set price from the product
    
    if (isNaN(newPrice) || newPrice < originalPrice) {
      alert(`Price cannot be lower than the original price of KES ${originalPrice.toLocaleString()}`);
      setEditingPrice(null);
      return;
    }
    
    onUpdateItemPrice(item.id, newPrice);
    setEditingPrice(null);
  };

  const handleCashPayment = () => {
    const transaction = onCompleteTransaction('cash');
    setCurrentTransaction(transaction);
    setShowReceipt(true);
  };

  const handleMPesaPayment = (reference: string) => {
    const transaction = onCompleteTransaction('mpesa', reference);
    setCurrentTransaction(transaction);
    setShowMPesaPayment(false);
    setShowReceipt(true);
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
        customer={customer}
        notes={notes}
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
                        <p className="text-xs text-gray-500">Stock: {item.stock}</p>
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
                        <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.quantity}</span>
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

            <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center text-base sm:text-lg font-bold">
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
