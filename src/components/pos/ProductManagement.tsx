
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  User,
  XCircle,
  Receipt,
  Printer,
  Scan,
  PackageCheck,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, Customer, Transaction, PaymentSplit, CartItem } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { addTransaction, updateCustomer, updateProduct } from '@/lib/database';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCustomers } from '@/lib/database';
import { PaymentMethods } from './PaymentMethods';
import { BarcodeScanner } from './BarcodeScanner';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All items');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  // Mock current attendant
  const currentAttendant = {
    id: '1',
    name: 'Admin User',
    email: 'admin@store.com',
    phone: '0712345678',
    role: 'admin' as const,
    permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings'],
    isActive: true,
    pin: '1234',
    createdAt: new Date()
  };

  const categories = ['All items', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All items' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm) ||
                         product.id.includes(searchTerm);
    return matchesCategory && matchesSearch;
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
      const cartItem: CartItem = { ...product, quantity: 1 };
      setCart(prev => [...prev, cartItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    });
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

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  const handleSelectCustomer = (customer: Customer) => {
    setCustomer(customer);
    toast({
      title: "Customer Selected",
      description: `${customer.name} has been selected`,
    });
  };

  const handleClearCustomer = () => {
    setCustomer(null);
    toast({
      title: "Customer Cleared",
      description: "Customer has been cleared",
    });
  };

  const handleCompleteSale = async (paymentSplits: PaymentSplit[], customerId?: string) => {
    try {
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        items: cart,
        total: calculateTotal(),
        paymentSplits,
        timestamp: new Date(),
        attendantId: currentAttendant?.id || '1',
        customerId,
        status: 'completed'
      };

      await addTransaction(transaction);
      
      // Update stock levels
      cart.forEach(async (item) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await updateProduct(item.id, {
            stock: product.stock - item.quantity
          });
        }
      });
      
      // Add loyalty points automatically if customer is selected
      if (customerId) {
        const pointsEarned = Math.floor(calculateTotal() / 100); // 1 point per 100 KES
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          const currentPoints = customer.loyaltyPoints || 0;
          await updateCustomer(customerId, {
            ...customer,
            loyaltyPoints: currentPoints + pointsEarned
          });
          
          toast({
            title: "Sale Completed",
            description: `Customer earned ${pointsEarned} loyalty points!`,
          });
        }
      }

      setCart([]);
      setCustomer(null);
      setShowPayment(false);
      setShowReceipt(true);
      setLastTransaction(transaction);
      
      if (!customerId) {
        toast({
          title: "Sale Completed",
          description: "Transaction completed successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete sale",
        variant: "destructive",
      });
    }
  };

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  if (showBarcodeScanner) {
    return (
      <BarcodeScanner
        products={products}
        onProductFound={addToCart}
        onClose={() => setShowBarcodeScanner(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Cart Section - At the top */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.length} items)
            </div>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
              >
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">
                        {item.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-100 h-8 w-8 p-0"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <div className="text-right ml-2">
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer and Checkout Section */}
      {cart.length > 0 && (
        <Card className="bg-white">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <Label>Customer (Optional)</Label>
              {customer && (
                <Button variant="ghost" size="sm" onClick={handleClearCustomer}>
                  Clear
                </Button>
              )}
            </div>
            {customer ? (
              <div className="p-3 border rounded-md bg-blue-50">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
                <p className="text-sm text-gray-500">Points: {customer.loyaltyPoints || 0}</p>
              </div>
            ) : (
              <Dialog>
                <Button variant="outline" className="w-full" onClick={() => setShowPayment(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Select Customer
                </Button>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select Customer</DialogTitle>
                    <DialogDescription>
                      Choose a customer to associate with this sale.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {customers.map(customer => (
                      <Button
                        key={customer.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="text-left">
                          <div>{customer.name} - {customer.phone}</div>
                          <div className="text-sm text-gray-500">Points: {customer.loyaltyPoints || 0}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowPayment(true)}
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              Complete Sale - {formatPrice(calculateTotal())}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Products Section */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, category, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-full h-12"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBarcodeScanner(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Scan className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-2">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {/* Product Avatar */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-600">
                        {product.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-gray-100 text-gray-600 border-0"
                        >
                          {product.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        {product.barcode && (
                          <span className="text-xs text-gray-400">#{product.barcode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Price and Add Button */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 text-base">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      size="sm"
                      disabled={product.stock <= 0}
                      className="h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No products found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
            <DialogDescription>
              Choose a payment method to complete the sale.
            </DialogDescription>
          </DialogHeader>
          <PaymentMethods
            total={calculateTotal()}
            onComplete={handleCompleteSale}
            customerId={customer?.id}
          />
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sale Receipt</DialogTitle>
          </DialogHeader>
          <div ref={receiptRef} className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">DIGITAL DEN</h3>
              <p className="text-sm text-gray-500">Your Electronics Hub</p>
              <p className="text-sm text-gray-500">123 Electronics Street, Nairobi</p>
              <p className="text-sm text-gray-500">Tel: +254 700 000 000</p>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Transaction ID: {lastTransaction?.id}</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Attendant: {currentAttendant.name}</span>
              <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>
            {customer && (
              <div className="text-sm mb-2">
                <span>Customer: {customer.name} ({customer.phone})</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="space-y-1">
              {lastTransaction?.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span>{item.name}</span>
                    <br />
                    <span className="text-gray-500">{item.quantity} x {formatPrice(item.price)}</span>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>TOTAL:</span>
              <span>{formatPrice(lastTransaction?.total || 0)}</span>
            </div>
            <Separator className="my-2" />
            <div className="text-center text-xs text-gray-500">
              <p>Thank you for shopping with Digital Den!</p>
              <p>Goods once sold are not returnable</p>
            </div>
          </div>
          <Button className="w-full" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
