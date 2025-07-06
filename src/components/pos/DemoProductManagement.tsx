
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
  Store,
  Banknote,
  Smartphone,
  Calculator,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem, Customer, Transaction } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDemoMode } from '@/contexts/DemoModeContext';

export const DemoProductManagement: React.FC = () => {
  const { toast } = useToast();
  const { 
    isDemoMode, 
    demoProducts, 
    demoCustomers, 
    addDemoTransaction,
    updateDemoProductStock 
  } = useDemoMode();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
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

  // Filter products based on search term
  const filteredProducts = demoProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(searchLower) ||
           product.category.toLowerCase().includes(searchLower) ||
           product.barcode?.includes(searchTerm);
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
    
    const product = demoProducts.find(p => p.id === productId);
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

  const processCheckout = (paymentMethod: 'cash' | 'mpesa' | 'split' | 'card' = 'cash') => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    // Create transaction
    const transaction: Transaction = {
      id: `DEMO-TXN-${Date.now()}`,
      items: cart,
      total: calculateTotal(),
      timestamp: new Date(),
      customerId: selectedCustomer.id,
      attendantId: 'demo-admin-001',
      paymentSplits: [{ method: paymentMethod, amount: calculateTotal() }],
      status: 'completed'
    };

    // Update stock for each item
    cart.forEach(item => {
      const product = demoProducts.find(p => p.id === item.id);
      if (product) {
        updateDemoProductStock(item.id, product.stock - item.quantity);
      }
    });

    // Add transaction to demo data
    addDemoTransaction(transaction);

    // Clear cart
    setCart([]);

    toast({
      title: "Sale Completed!",
      description: `Transaction ${transaction.id} processed successfully. Total: ${formatPrice(transaction.total)}`,
    });

    // Reset customer selection
    setSelectedCustomer({
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
  };

  if (!isDemoMode) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Demo Mode Not Enabled</h2>
        <p className="text-gray-600">Please enable demo mode to use this component.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-green-600">🚀 DEMO STORE</h2>
            <p className="text-xs text-gray-600">Testing Mode - No Real Transactions</p>
            <p className="text-xs text-blue-600">{demoProducts.length} products | {demoCustomers.length} customers</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            DEMO MODE
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search demo products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
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
                    <p className="text-sm font-semibold text-green-600">
                      {formatPrice(item.price)}
                    </p>
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
                onClick={() => processCheckout('card')}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Card
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700" 
                size="sm"
                onClick={() => processCheckout('split')}
              >
                <Calculator className="h-4 w-4 mr-1" />
                Split
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="p-4">
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
                {demoProducts.length === 0 ? 'No demo products available' : 'No products found'}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
