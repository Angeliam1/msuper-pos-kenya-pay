import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  XCircle,
  Minus,
  Edit3,
  Check,
  X,
  UserPlus,
  Package,
  Users,
  Receipt as ReceiptIcon,
  Store,
  CreditCard,
  Smartphone,
  Banknote,
  Calculator
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem, Customer, Transaction } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickAddProduct } from './QuickAddProduct';
import { Receipt } from './Receipt';
import { SplitPayment } from './SplitPayment';
import { MPesaPayment } from './MPesaPayment';
import { HirePurchase } from './HirePurchase';
import { useStore } from '@/contexts/StoreContext';

export const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const { 
    currentStore, 
    getStoreProducts, 
    updateStoreProduct, 
    addProductToStore,
    getStoreCustomers,
    addCustomerToStore,
    addTransactionToStore
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>({
    id: 'walk-in',
    name: 'Walk-in Customer',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0,
    creditLimit: 0,
    outstandingBalance: 0,
    createdAt: new Date()
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCustomerAdd, setShowCustomerAdd] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showMPesaPayment, setShowMPesaPayment] = useState(false);
  const [showHirePurchase, setShowHirePurchase] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'split' | 'hire-purchase'>('cash');

  // Quick add customer form
  const [quickCustomer, setQuickCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Get store-specific data
  const products = currentStore ? getStoreProducts(currentStore.id) : [];
  const customers = currentStore ? getStoreCustomers(currentStore.id) : [];

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(searchLower) ||
           product.category.toLowerCase().includes(searchLower) ||
           product.barcode?.includes(searchTerm) ||
           product.id.includes(searchTerm);
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} units available`,
          variant: "destructive",
        });
        return;
      }
      setCart(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const cartItem: CartItem = { 
        ...product, 
        quantity: 1,
        price: product.retailPrice
      };
      setCart(prev => [...prev, cartItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const adjustQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} units available`,
        variant: "destructive",
      });
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCartItemPrice = (productId: string, newPrice: number) => {
    const product = products.find(p => p.id === productId);
    const allowPriceBelowWholesale = currentStore?.pricingSettings?.allowPriceBelowWholesale || false;
    
    if (!allowPriceBelowWholesale && product && newPrice < (product.wholesalePrice || product.buyingCost)) {
      toast({
        title: "Price Below Wholesale",
        description: `Minimum price is KSh${(product.wholesalePrice || product.buyingCost).toLocaleString()} (wholesale cost)`,
        variant: "destructive",
      });
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, price: newPrice } : item
      )
    );
  };

  const handlePriceEdit = (item: CartItem) => {
    setEditingPrice(item.id);
    setTempPrice(item.price.toString());
  };

  const handlePriceUpdate = (item: CartItem) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      setEditingPrice(null);
      return;
    }
    
    updateCartItemPrice(item.id, newPrice);
    setEditingPrice(null);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  const handleQuickAddProduct = (productData: Omit<Product, 'id'>) => {
    if (!currentStore) {
      toast({
        title: "No Store Selected",
        description: "Please select a store first",
        variant: "destructive",
      });
      return;
    }

    addProductToStore(currentStore.id, productData);
    
    toast({
      title: "Product Added",
      description: `${productData.name} added to ${currentStore.name}`,
    });
  };

  const handleQuickAddCustomer = () => {
    if (!quickCustomer.name || !quickCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and phone",
        variant: "destructive",
      });
      return;
    }

    if (!currentStore) {
      toast({
        title: "No Store Selected",
        description: "Please select a store first",
        variant: "destructive",
      });
      return;
    }

    const newCustomer: Customer = {
      id: `quick-${Date.now()}`,
      name: quickCustomer.name,
      phone: quickCustomer.phone,
      email: quickCustomer.email,
      address: '',
      creditLimit: 0,
      outstandingBalance: 0,
      loyaltyPoints: 0,
      createdAt: new Date()
    };

    addCustomerToStore(currentStore.id, newCustomer);
    setSelectedCustomer(newCustomer);
    setQuickCustomer({ name: '', phone: '', email: '' });
    setShowCustomerAdd(false);
    
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} added to ${currentStore.name}`,
    });
  };

  const processCheckout = (paymentType: 'cash' | 'mpesa' | 'split' | 'hire-purchase' = 'cash') => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    if (!currentStore) {
      toast({
        title: "No Store Selected",
        description: "Please select a store to process checkout",
        variant: "destructive",
      });
      return;
    }

    // Handle different payment methods
    switch (paymentType) {
      case 'mpesa':
        setShowMPesaPayment(true);
        break;
      case 'split':
        setShowSplitPayment(true);
        break;
      case 'hire-purchase':
        setShowHirePurchase(true);
        break;
      default:
        // Cash payment - complete immediately
        completeTransaction([{ method: 'cash', amount: calculateTotal() }]);
        break;
    }
  };

  const completeTransaction = (paymentSplits: any[]) => {
    if (!currentStore) {
      toast({
        title: "No Store Selected",
        description: "Please select a store to complete transaction",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: cart,
      total: calculateTotal(),
      timestamp: new Date(),
      customerId: selectedCustomer.id,
      attendantId: 'current-user',
      paymentSplits: paymentSplits,
      status: 'completed'
    };

    // Update stock for products in the current store
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && currentStore) {
        updateStoreProduct(currentStore.id, item.id, { stock: product.stock - item.quantity });
      }
    });

    // Add transaction to current store
    addTransactionToStore(currentStore.id, transaction);
    setCurrentTransaction(transaction);
    setShowReceipt(true);
    setCart([]);

    toast({
      title: "Sale Completed",
      description: `Transaction ${transaction.id} processed successfully`,
    });
  };

  // Create store settings from current store
  const storeSettings = currentStore ? {
    storeName: currentStore.name,
    storeAddress: currentStore.address,
    storePhone: currentStore.phone,
    storeEmail: '',
    allowPriceBelowWholesale: currentStore.pricingSettings?.allowPriceBelowWholesale || false,
    paybill: '247247',
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
    receiptHeader: currentStore.receiptSettings?.header || 'Thank you for shopping with us!',
    receiptFooter: currentStore.receiptSettings?.footer || 'Visit us again soon!',
    showQRCode: true,
    showBarcode: true,
    autoPrintReceipt: currentStore.receiptSettings?.autoprint || false
  } : {
    storeName: 'STORE NOT SELECTED',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    allowPriceBelowWholesale: false,
    paybill: '',
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit us again soon!',
    showQRCode: true,
    showBarcode: true,
    autoPrintReceipt: false
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">{currentStore?.name || 'No Store Selected'}</h2>
            <p className="text-xs text-gray-600">{currentStore?.address || 'Please select a store'}</p>
            <p className="text-xs text-blue-600">{products.length} products | {customers.length} customers</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowQuickAdd(true)}
              disabled={!currentStore}
            >
              <Package className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowCustomerAdd(true)}
              disabled={!currentStore}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        {/* Customer Selection */}
        <div className="mt-3">
          <Select 
            value={selectedCustomer.id} 
            onValueChange={(value) => {
              const customer = customers.find(c => c.id === value) || selectedCustomer;
              setSelectedCustomer(customer);
            }}
          >
            <SelectTrigger className="w-full">
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
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="bg-blue-50 border-b">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cart.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-red-600"
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {editingPrice === item.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="h-6 w-20 text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => handlePriceUpdate(item)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPrice(null)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 font-semibold text-sm">
                            {formatPrice(item.price)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePriceEdit(item)}
                            className="h-5 w-5 p-0 text-gray-400"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 h-7 w-7 p-0"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(calculateTotal())}
              </span>
            </div>
            
            {/* Payment Method Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                size="sm"
                onClick={() => processCheckout('cash')}
              >
                <Banknote className="h-4 w-4 mr-1" />
                Cash
              </Button>
              <Button 
                className="bg-green-800 hover:bg-green-900" 
                size="sm"
                onClick={() => processCheckout('mpesa')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                M-Pesa
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="sm"
                onClick={() => processCheckout('split')}
              >
                <Calculator className="h-4 w-4 mr-1" />
                Split
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700" 
                size="sm"
                onClick={() => processCheckout('hire-purchase')}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                H/P
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="p-4">
        {!currentStore ? (
          <div className="text-center text-gray-500 py-8">
            <Store className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>Please select a store to view products</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Wholesale: {formatPrice(product.wholesalePrice || product.buyingCost)}
                    </div>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      Retail: {formatPrice(product.retailPrice)}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    disabled={product.stock <= 0}
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No products found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Quick Add Customer Dialog */}
      <Dialog open={showCustomerAdd} onOpenChange={setShowCustomerAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Customer to {currentStore?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={quickCustomer.name}
                onChange={(e) => setQuickCustomer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={quickCustomer.phone}
                onChange={(e) => setQuickCustomer(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+254..."
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={quickCustomer.email}
                onChange={(e) => setQuickCustomer(prev => ({ ...prev, email: e.target.value }))}
                placeholder="customer@email.com"
              />
            </div>
            <Button onClick={handleQuickAddCustomer} className="w-full" disabled={!currentStore}>
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialogs */}
      {showSplitPayment && (
        <SplitPayment
          totalAmount={calculateTotal()}
          customers={customers}
          onConfirmPayment={completeTransaction}
          onCancel={() => setShowSplitPayment(false)}
        />
      )}

      {showMPesaPayment && (
        <MPesaPayment
          amount={calculateTotal()}
          onSuccess={(reference: string) => {
            completeTransaction([{ method: 'mpesa', amount: calculateTotal(), reference }]);
            setShowMPesaPayment(false);
          }}
          onCancel={() => setShowMPesaPayment(false)}
        />
      )}

      {showHirePurchase && (
        <HirePurchase
          totalAmount={calculateTotal()}
          customers={customers}
          cartItems={cart}
          onCreateHirePurchase={(hirePurchaseData) => {
            completeTransaction([{ method: 'credit', amount: hirePurchaseData.downPayment }]);
            setShowHirePurchase(false);
            return `HP-${Date.now()}`;
          }}
          onCancel={() => setShowHirePurchase(false)}
        />
      )}

      {/* Receipt Dialog */}
      {showReceipt && currentTransaction && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <Receipt
              transaction={currentTransaction}
              onClose={() => setShowReceipt(false)}
              storeSettings={storeSettings}
              customer={selectedCustomer.id !== 'walk-in' ? {
                name: selectedCustomer.name,
                phone: selectedCustomer.phone,
                address: selectedCustomer.address || '',
                loyaltyPoints: selectedCustomer.loyaltyPoints
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
