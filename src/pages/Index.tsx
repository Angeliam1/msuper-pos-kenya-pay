
import React, { useState } from 'react';
import { ProductCatalog } from '@/components/pos/ProductCatalog';
import { Cart } from '@/components/pos/Cart';
import { Dashboard } from '@/components/pos/Dashboard';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, BarChart3, History, Package, Settings } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'mpesa' | 'cash';
  timestamp: Date;
  mpesaReference?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Coca Cola 500ml', price: 80, category: 'Beverages', stock: 50 },
  { id: '2', name: 'White Bread', price: 60, category: 'Bakery', stock: 30 },
  { id: '3', name: 'Milk 1L', price: 120, category: 'Dairy', stock: 25 },
  { id: '4', name: 'Rice 2kg', price: 350, category: 'Groceries', stock: 20 },
  { id: '5', name: 'Cooking Oil 1L', price: 280, category: 'Groceries', stock: 15 },
  { id: '6', name: 'Sugar 2kg', price: 240, category: 'Groceries', stock: 40 },
  { id: '7', name: 'Tea Leaves 250g', price: 150, category: 'Beverages', stock: 35 },
  { id: '8', name: 'Eggs (12 pcs)', price: 380, category: 'Dairy', stock: 18 },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const completeTransaction = (paymentMethod: 'mpesa' | 'cash', mpesaReference?: string): Transaction => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod,
      timestamp: new Date(),
      mpesaReference
    };
    
    // Update product stock
    setProducts(prev => prev.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    }));
    
    setTransactions(prev => [transaction, ...prev]);
    setCartItems([]);
    return transaction;
  };

  // Product management functions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    // Also remove from cart if it exists
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalSales = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const todaySales = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).reduce((sum, transaction) => sum + transaction.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">MSUPER POS</h1>
          <p className="text-sm text-gray-600">Point of Sale System - Kenya</p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="pos" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              POS
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCatalog products={products} onAddToCart={addToCart} />
              </div>
              <div>
                <Cart 
                  items={cartItems}
                  onUpdateItem={updateCartItem}
                  onCompleteTransaction={completeTransaction}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard 
              totalSales={totalSales}
              todaySales={todaySales}
              transactionCount={transactions.length}
              transactions={transactions}
            />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory transactions={transactions} />
          </TabsContent>

          <TabsContent value="products">
            <ProductCatalog products={products} onAddToCart={addToCart} showCatalogOnly />
          </TabsContent>

          <TabsContent value="manage">
            <ProductManagement
              products={products}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
