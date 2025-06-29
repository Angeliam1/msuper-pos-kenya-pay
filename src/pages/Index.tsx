import React, { useState } from 'react';
import { ProductList } from '@/components/pos/ProductList';
import { Cart } from '@/components/pos/Cart';
import { Dashboard } from '@/components/pos/Dashboard';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { SplitPayment } from '@/components/pos/SplitPayment';
import { HirePurchaseComponent } from '@/components/pos/HirePurchase';
import { HoldTransaction } from '@/components/pos/HoldTransaction';
import { RoleManagement } from '@/components/pos/RoleManagement';
import { LowStockAlerts } from '@/components/pos/LowStockAlerts';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { VoidRefundTransaction } from '@/components/pos/VoidRefundTransaction';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { LoyaltyManagement } from '@/components/pos/LoyaltyManagement';
import { MultiStoreManagement } from '@/components/pos/MultiStoreManagement';
import { ReturnsManagement } from '@/components/pos/ReturnsManagement';
import { QuickAddProduct } from '@/components/pos/QuickAddProduct';
import { Sidebar } from '@/components/pos/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, Scan, Ban, Plus } from 'lucide-react';
import { Product, CartItem, Transaction, Customer, Supplier, Attendant, PaymentSplit, HirePurchase, HeldTransaction } from '@/types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Coca Cola 500ml', price: 80, category: 'Beverages', stock: 50, barcode: '1234567890123', lowStockThreshold: 20 },
  { id: '2', name: 'White Bread', price: 60, category: 'Bakery', stock: 30, barcode: '2345678901234', lowStockThreshold: 10 },
  { id: '3', name: 'Milk 1L', price: 120, category: 'Dairy', stock: 25, barcode: '3456789012345', lowStockThreshold: 15 },
  { id: '4', name: 'Rice 2kg', price: 350, category: 'Groceries', stock: 20, barcode: '4567890123456', lowStockThreshold: 5 },
  { id: '5', name: 'Cooking Oil 1L', price: 280, category: 'Groceries', stock: 15, barcode: '5678901234567', lowStockThreshold: 8 },
  { id: '6', name: 'Sugar 2kg', price: 240, category: 'Groceries', stock: 40, barcode: '6789012345678', lowStockThreshold: 12 },
  { id: '7', name: 'Tea Leaves 250g', price: 150, category: 'Beverages', stock: 35, barcode: '7890123456789', lowStockThreshold: 15 },
  { id: '8', name: 'Eggs (12 pcs)', price: 380, category: 'Dairy', stock: 18, barcode: '8901234567890', lowStockThreshold: 6 },
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
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>([]);
  const [currentAttendant] = useState<Attendant>(INITIAL_ATTENDANTS[0]);
  
  // UI State
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Payment flow states
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showHirePurchase, setShowHirePurchase] = useState(false);
  const [showHoldTransaction, setShowHoldTransaction] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showVoidRefund, setShowVoidRefund] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'TOPTEN ELECTRONICS LTD',
    storeAddress: 'Githunguri Town Next To Main Market',
    storePhone: '0725333337',
    storeEmail: 'info@topten.com',
    paybill: 'Paybill 247247 Acc 333337',
    showStoreName: true,
    showStoreAddress: true,
    showStorePhone: true,
    showCustomerName: true,
    showCustomerPhone: true,
    showCustomerAddress: true,
    showNotes: true,
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Visit us again soon!',
    showBarcode: true
  });

  const addToCart = (product: Product) => {
    // Prevent adding out of stock items
    if (product.stock <= 0) {
      alert(`${product.name} is out of stock!`);
      return;
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // Check if we can add more
        if (existingItem.quantity >= product.stock) {
          alert(`Cannot add more ${product.name}. Only ${product.stock} in stock.`);
          return prev;
        }
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
      const product = products.find(p => p.id === id);
      if (product && quantity > product.stock) {
        alert(`Cannot add more items. Only ${product.stock} in stock.`);
        return;
      }
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
      hirePurchaseId,
      status: 'completed'
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

  // Hold and retrieve transaction functions
  const handleHoldTransaction = (customerId?: string, customerName?: string, note?: string) => {
    if (cartItems.length === 0) return;
    
    const heldTransaction: HeldTransaction = {
      id: Date.now().toString(),
      items: [...cartItems],
      customerId,
      customerName,
      heldAt: new Date(),
      heldBy: currentAttendant.name,
      note
    };
    
    setHeldTransactions(prev => [...prev, heldTransaction]);
    setCartItems([]);
    setShowHoldTransaction(false);
  };

  const handleRetrieveTransaction = (heldTransaction: HeldTransaction) => {
    setCartItems([...heldTransaction.items]);
    setHeldTransactions(prev => prev.filter(held => held.id !== heldTransaction.id));
    setShowHoldTransaction(false);
  };

  const handleDeleteHeldTransaction = (id: string) => {
    setHeldTransactions(prev => prev.filter(held => held.id !== id));
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

  const handleVoidTransaction = (transactionId: string, reason: string) => {
    setTransactions(prev => prev.map(transaction =>
      transaction.id === transactionId
        ? {
            ...transaction,
            status: 'voided' as const,
            voidedAt: new Date(),
            voidReason: reason
          }
        : transaction
    ));
    setShowVoidRefund(false);
  };

  const handleRefundTransaction = (transactionId: string, reason: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      // Restore stock for refunded items
      setProducts(prev => prev.map(product => {
        const refundedItem = transaction.items.find(item => item.id === product.id);
        if (refundedItem) {
          return { ...product, stock: product.stock + refundedItem.quantity };
        }
        return product;
      }));

      // Update transaction status
      setTransactions(prev => prev.map(t =>
        t.id === transactionId
          ? {
              ...t,
              status: 'refunded' as const,
              refundedAt: new Date(),
              refundReason: reason
            }
          : t
      ));
    }
    setShowVoidRefund(false);
  };

  // Barcode scanner function
  const handleBarcodeProductFound = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      setShowBarcodeScanner(false);
    }
  };

  const totalSales = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const todaySales = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).reduce((sum, transaction) => sum + transaction.total, 0);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSaveSettings = (newSettings: any) => {
    setStoreSettings(newSettings);
    console.log('Settings saved:', newSettings);
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === id) {
        // Get original price (this should come from a separate originalPrice field in real app)
        const originalPrice = INITIAL_PRODUCTS.find(p => p.id === id)?.price || product.price;
        
        // Prevent price from going below original price
        if (newPrice < originalPrice) {
          alert(`Price cannot be lower than the original price of KES ${originalPrice.toLocaleString()}`);
          return product;
        }
        
        return { ...product, price: newPrice };
      }
      return product;
    }));

    // Update cart items with new price
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2 order-2 lg:order-1">
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
              ) : showHoldTransaction ? (
                <HoldTransaction
                  items={cartItems}
                  customers={customers}
                  heldTransactions={heldTransactions}
                  currentAttendant={currentAttendant.name}
                  onHoldTransaction={handleHoldTransaction}
                  onRetrieveTransaction={handleRetrieveTransaction}
                  onDeleteHeldTransaction={handleDeleteHeldTransaction}
                  onCancel={() => setShowHoldTransaction(false)}
                />
              ) : showBarcodeScanner ? (
                <BarcodeScanner
                  products={products}
                  onProductFound={handleBarcodeProductFound}
                  onClose={() => setShowBarcodeScanner(false)}
                />
              ) : showVoidRefund ? (
                <VoidRefundTransaction
                  transactions={transactions}
                  onVoidTransaction={handleVoidTransaction}
                  onRefundTransaction={handleRefundTransaction}
                  onClose={() => setShowVoidRefund(false)}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <Button
                      onClick={() => setShowQuickAdd(true)}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Quick Add
                    </Button>
                  </div>
                  <ProductList products={products} onAddToCart={addToCart} />
                </>
              )}
            </div>
            
            <div className="order-1 lg:order-2 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowBarcodeScanner(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Scan className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Scanner</span>
                  <span className="sm:hidden">Scan</span>
                </Button>
                <Button
                  onClick={() => setShowVoidRefund(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Ban className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Void/Refund</span>
                  <span className="sm:hidden">Void</span>
                </Button>
              </div>
              
              <Cart 
                items={cartItems}
                onUpdateItem={updateCartItem}
                onUpdateItemPrice={updateProductPrice}
                onCompleteTransaction={(paymentMethod, mpesaReference) => {
                  const splits: PaymentSplit[] = [
                    { method: paymentMethod, amount: cartTotal, reference: mpesaReference }
                  ];
                  return completeTransaction(splits);
                }}
                onSplitPayment={() => setShowSplitPayment(true)}
                onHirePurchase={() => setShowHirePurchase(true)}
                onHoldTransaction={() => setShowHoldTransaction(true)}
                storeSettings={storeSettings}
              />
            </div>
          </div>
        );
      case 'dashboard':
        return <Dashboard totalSales={totalSales} todaySales={todaySales} transactionCount={transactions.length} transactions={transactions} />;
      case 'reports':
        return <Reports transactions={transactions} products={products} attendants={attendants} />;
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'products':
        return <ProductManagement products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />;
      case 'customers':
        return <CustomerManagement customers={customers} onAddCustomer={addCustomer} onUpdateCustomer={updateCustomer} />;
      case 'loyalty':
        return <LoyaltyManagement customers={customers} onUpdateCustomer={updateCustomer} />;
      case 'stores':
        return <MultiStoreManagement />;
      case 'returns':
        return <ReturnsManagement transactions={transactions} onRefundTransaction={handleRefundTransaction} />;
      case 'expenses':
        return <div className="p-8 text-center text-gray-500">Expenses Management - Coming Soon</div>;
      case 'purchases':
        return <div className="p-8 text-center text-gray-500">Purchase Orders Management - Coming Soon</div>;
      case 'stock-take':
        return <div className="p-8 text-center text-gray-500">Stock Take Management - Coming Soon</div>;
      case 'sms':
        return <div className="p-8 text-center text-gray-500">SMS Center - Coming Soon</div>;
      case 'hire-purchase':
        return <HirePurchaseComponent totalAmount={0} customers={customers} hirePurchases={hirePurchases} onCreateHirePurchase={handleCreateHirePurchase} onCancel={() => {}} />;
      case 'staff':
        return <RoleManagement attendants={attendants} currentAttendant={currentAttendant} onAddAttendant={addAttendant} onUpdateAttendant={updateAttendant} />;
      case 'alerts':
        return <LowStockAlerts products={products} />;
      case 'settings':
        return <Settings onSaveSettings={handleSaveSettings} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">MSUPER POS</h1>
                <p className="text-xs text-gray-600">
                  Point of Sale System - Kenya | {currentAttendant.name} ({currentAttendant.role})
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:ml-0">
          {renderContent()}
        </main>
      </div>

      {showQuickAdd && (
        <QuickAddProduct
          onAddProduct={addProduct}
          onClose={() => setShowQuickAdd(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Index;
