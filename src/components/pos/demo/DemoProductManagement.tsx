
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem, Customer, Transaction } from '@/types';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { DemoHeader } from './DemoHeader';
import { DemoCart } from './DemoCart';
import { DemoProductList } from './DemoProductList';

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
  const [selectedCustomer] = useState<Customer>({
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

  const processCheckout = (paymentMethod: 'cash' | 'mpesa' | 'card' | 'credit' = 'cash') => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    // Create transaction with proper payment method
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
  };

  const processSplitPayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    const halfAmount = total / 2;

    // Create transaction with split payment
    const transaction: Transaction = {
      id: `DEMO-TXN-${Date.now()}`,
      items: cart,
      total: total,
      timestamp: new Date(),
      customerId: selectedCustomer.id,
      attendantId: 'demo-admin-001',
      paymentSplits: [
        { method: 'cash', amount: halfAmount },
        { method: 'mpesa', amount: halfAmount }
      ],
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
      title: "Split Payment Completed!",
      description: `Transaction ${transaction.id} processed successfully. Total: ${formatPrice(transaction.total)} (Cash: ${formatPrice(halfAmount)}, M-Pesa: ${formatPrice(halfAmount)})`,
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
      <DemoHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        productsCount={demoProducts.length}
        customersCount={demoCustomers.length}
      />

      <DemoCart
        cart={cart}
        onClearCart={() => setCart([])}
        onAdjustQuantity={adjustQuantity}
        onRemoveFromCart={removeFromCart}
        onProcessCheckout={processCheckout}
        onProcessSplitPayment={processSplitPayment}
        formatPrice={formatPrice}
      />

      <DemoProductList
        products={filteredProducts}
        onAddToCart={addToCart}
        formatPrice={formatPrice}
      />
    </div>
  );
};
