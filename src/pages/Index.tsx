import React, { useState } from 'react';
import { ProductCatalog } from '@/components/pos/ProductCatalog';
import { Cart } from '@/components/pos/Cart';
import { Dashboard } from '@/components/pos/Dashboard';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { SplitPayment } from '@/components/pos/SplitPayment';
import { HirePurchaseComponent } from '@/components/pos/HirePurchase';
import { RoleManagement } from '@/components/pos/RoleManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, BarChart3, History, Package, Users, CreditCard, Shield, UserPlus } from 'lucide-react';
import { Product, CartItem, Transaction, Customer, Supplier, Attendant, PaymentSplit, HirePurchase } from '@/types';

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

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'John Kamau',
    phone: '0712345678',
    email: 'john@email.com',
    creditLimit: 50000,
    outstandingBalance: 0,
    createdAt: new Date()
  }
];

const INITIAL_ATTENDANTS: Attendant[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@msuper.com',
    phone: '0700000000',
    role: 'admin',
    permissions: ['pos', 'products', 'customers', 'suppliers', 'reports', 'staff', 'settings', 'hirePurchase', 'splitPayment'],
    isActive: true,
    createdAt: new Date()
  }
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [attendants, setAttendants] = useState<Attendant[]>(INITIAL_ATTENDANTS);
  const [hirePurchases, setHirePurchases] = useState<HirePurchase[]>([]);
  const [currentAttendant] = useState<Attendant>(INITIAL_ATTENDANTS[0]);
  
  // Payment flow states
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showHirePurchase, setShowHirePurchase] = useState(false);

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

  const completeTransaction = (paymentSplits: PaymentSplit[], customerId?: string, hirePurchaseId?: string): Transaction => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentSplits,
      customerId,
      attendantId: currentAttendant.id,
      timestamp: new Date(),
      hirePurchaseId
    };
    
    // Update product stock
    setProducts(prev => prev.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    }));

    // Update customer outstanding balance if credit payment
    if (customerId) {
      const creditAmount = paymentSplits
        .filter(split => split.method === 'credit')
        .reduce((sum, split) => sum + split.amount, 0);
      
      if (creditAmount > 0) {
        setCustomers(prev => prev.map(customer =>
          customer.id === customerId
            ? { ...customer, outstandingBalance: customer.outstandingBalance + creditAmount }
            : customer
        ));
      }
    }
    
    setTransactions(prev => [transaction, ...prev]);
    setCartItems([]);
    return transaction;
  };

  // Handle split payment completion
  const handleSplitPaymentComplete = (splits: PaymentSplit[], customerId?: string) => {
    completeTransaction(splits, customerId);
    setShowSplitPayment(false);
  };

  // Handle hire purchase creation
  const handleCreateHirePurchase = (hirePurchaseData: Omit<HirePurchase, 'id'>): string => {
    const hirePurchase: HirePurchase = {
      ...hirePurchaseData,
      id: Date.now().toString()
    };
    
    setHirePurchases(prev => [...prev, hirePurchase]);

    // Create transaction with down payment
    const splits: PaymentSplit[] = [
      { method: 'cash', amount: hirePurchaseData.downPayment }
    ];
    
    completeTransaction(splits, hirePurchaseData.customerId, hirePurchase.id);
    setShowHirePurchase(false);
    
    return hirePurchase.id;
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
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Customer management functions
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === id ? { ...customer, ...customerData } : customer
    ));
  };

  // Staff management functions
  const addAttendant = (attendantData: Omit<Attendant, 'id' | 'createdAt'>) => {
    const newAttendant: Attendant = {
      ...attendantData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAttendants(prev => [...prev, newAttendant]);
  };

  const updateAttendant = (id: string, attendantData: Partial<Attendant>) => {
    setAttendants(prev => prev.map(attendant =>
      attendant.id === id ? { ...attendant, ...attendantData } : attendant
    ));
  };

  const totalSales = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const todaySales = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).reduce((sum, transaction) => sum + transaction.total, 0);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">MSUPER POS</h1>
          <p className="text-sm text-gray-600">
            Point of Sale System - Kenya | {currentAttendant.name} ({currentAttendant.role})
          </p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="pos" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
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
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="hire-purchase" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Hire Purchase
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {showSplitPayment ? (
                  <SplitPayment
                    totalAmount={cartTotal}
                    customers={customers}
                    onConfirmPayment={handleSplitPaymentComplete}
                    onCancel={() => setShowSplitPayment(false)}
                  />
                ) : showHirePurchase ? (
                  <HirePurchaseComponent
                    totalAmount={cartTotal}
                    customers={customers}
                    hirePurchases={hirePurchases}
                    onCreateHirePurchase={handleCreateHirePurchase}
                    onCancel={() => setShowHirePurchase(false)}
                  />
                ) : (
                  <ProductCatalog products={products} onAddToCart={addToCart} />
                )}
              </div>
              <div>
                <Cart 
                  items={cartItems}
                  onUpdateItem={updateCartItem}
                  onCompleteTransaction={(paymentMethod, mpesaReference) => {
                    const splits: PaymentSplit[] = [
                      { method: paymentMethod, amount: cartTotal, reference: mpesaReference }
                    ];
                    return completeTransaction(splits);
                  }}
                  onSplitPayment={() => setShowSplitPayment(true)}
                  onHirePurchase={() => setShowHirePurchase(true)}
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
            <ProductManagement
              products={products}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement
              customers={customers}
              onAddCustomer={addCustomer}
              onUpdateCustomer={updateCustomer}
            />
          </TabsContent>

          <TabsContent value="hire-purchase">
            <HirePurchaseComponent
              totalAmount={0}
              customers={customers}
              hirePurchases={hirePurchases}
              onCreateHirePurchase={handleCreateHirePurchase}
              onCancel={() => {}}
            />
          </TabsContent>

          <TabsContent value="staff">
            <RoleManagement
              attendants={attendants}
              currentAttendant={currentAttendant}
              onAddAttendant={addAttendant}
              onUpdateAttendant={updateAttendant}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
