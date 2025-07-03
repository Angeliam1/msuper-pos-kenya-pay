
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingCart, 
  DollarSign, 
  Percent,
  PackageCheck,
  User,
  XCircle,
  Receipt,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, Customer, Transaction, PaymentSplit, CartItem } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { addTransaction, updateCustomer } from '@/lib/database';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCustomers } from '@/lib/database';
import { PaymentMethods } from './PaymentMethods';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
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

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
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
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const adjustQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

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
    content: () => receiptRef.current!,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Product List */}
      <div className="lg:col-span-3 space-y-4">
        {/* Header and Filters */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Products for Sale</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[400px] w-full rounded-md p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex flex-col items-center justify-center" onClick={() => addToCart(product)}>
                      <div className="relative aspect-square w-full h-24 rounded-md overflow-hidden mb-2">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm font-medium text-center">{product.name}</div>
                      <div className="text-xs text-gray-500 text-center">{formatPrice(product.price)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[320px] w-full rounded-md p-2">
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="relative aspect-square w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="w-16 text-center text-sm"
                        onChange={(e) => adjustQuantity(item.id, parseInt(e.target.value))}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center text-gray-500">
                    Your cart is empty
                  </div>
                )}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Total:</div>
              <div className="text-lg font-bold">{formatPrice(calculateTotal())}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="customer">Customer</Label>
              {customer ? (
                <Button variant="ghost" size="sm" onClick={handleClearCustomer}>
                  Clear
                </Button>
              ) : null}
            </div>
            {customer ? (
              <div className="p-3 border rounded-md">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Select Customer
                  </Button>
                </DialogTrigger>
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
                        {customer.name} - {customer.phone}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button
              className="w-full"
              disabled={cart.length === 0}
              onClick={() => setShowPayment(true)}
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>

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
            <h3 className="text-lg font-semibold text-center">TOPTEN ELECTRONICS</h3>
            <p className="text-sm text-gray-500 text-center">
              Nairobi, Kenya
            </p>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Transaction ID:</p>
                <p className="text-xs text-gray-500">{lastTransaction?.id}</p>
              </div>
              <div>
                <p className="text-sm">Date:</p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Separator className="my-2" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastTransaction?.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Total:</div>
              <div className="text-lg font-bold">{formatPrice(lastTransaction?.total || 0)}</div>
            </div>
            <Separator className="my-2" />
            <p className="text-xs text-gray-500 text-center">
              Thank you for your purchase!
            </p>
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
