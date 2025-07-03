
import React, { useState } from 'react';
import { Sidebar } from '@/components/pos/Sidebar';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { Reports } from '@/components/pos/Reports';
import { Settings } from '@/components/pos/Settings';
import { LowStockAlerts } from '@/components/pos/LowStockAlerts';
import { RoleManagement } from '@/components/pos/RoleManagement';
import { SupplierManagement } from '@/components/pos/SupplierManagement';
import { LoyaltyManagement } from '@/components/pos/LoyaltyManagement';
import { MultiStoreManagement } from '@/components/pos/MultiStoreManagement';
import { ReturnsManagement } from '@/components/pos/ReturnsManagement';
import { ExpenseManagement } from '@/components/pos/ExpenseManagement';
import { PurchaseManagement } from '@/components/pos/PurchaseManagement';
import { HirePurchase } from '@/components/pos/HirePurchase';
import { OnlineStoreManager } from '@/components/online-store/OnlineStoreManager';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCustomers, getTransactions, getAttendants, getSuppliers, getExpenses } from '@/lib/database';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch data for components
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ['attendants'],
    queryFn: getAttendants,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });

  // Calculate dashboard metrics
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);
  const transactionCount = transactions.length;

  // Mock current attendant for components that need it
  const currentAttendant = attendants.length > 0 ? attendants[0] : {
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

  // Mock handlers
  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
  };

  const handleAddAttendant = (attendant: any) => {
    console.log('Add attendant:', attendant);
  };

  const handleUpdateAttendant = (id: string, updates: any) => {
    console.log('Update attendant:', id, updates);
  };

  const handleAddSupplier = (supplier: any) => {
    console.log('Add supplier:', supplier);
  };

  const handleUpdateSupplier = (id: string, updates: any) => {
    console.log('Update supplier:', id, updates);
  };

  const handleDeleteSupplier = (id: string) => {
    console.log('Delete supplier:', id);
  };

  const handleUpdateCustomer = (id: string, updates: any) => {
    console.log('Update customer:', id, updates);
  };

  const handleRefundTransaction = (id: string, reason: string) => {
    console.log('Refund transaction:', id, reason);
  };

  const handleAddExpense = (expense: any) => {
    console.log('Add expense:', expense);
  };

  // Mock handlers for HirePurchase
  const handleCreateHirePurchase = (hirePurchase: any) => {
    console.log('Create hire purchase:', hirePurchase);
    return `hp-${Date.now()}`;
  };

  const handleCancelHirePurchase = () => {
    console.log('Cancel hire purchase');
  };

  // Mock store settings
  const storeSettings = {
    smsEnabled: true,
    businessName: 'TOPTEN ELECTRONICS',
    businessPhone: '0725333337',
    mpesaPaybill: '174379',
    mpesaAccount: '9951109',
    hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
    smsProvider: 'phone'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <ProductManagement />;
      case 'dashboard':
        return (
          <Dashboard
            totalSales={totalSales}
            todaySales={todaySales}
            transactionCount={transactionCount}
            transactions={transactions}
            products={products}
          />
        );
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'reports':
        return (
          <Reports
            transactions={transactions}
            products={products}
            attendants={attendants}
          />
        );
      case 'settings':
        return <Settings onSaveSettings={() => {}} />;
      case 'alerts':
        return <LowStockAlerts products={products} />;
      case 'staff':
        return (
          <RoleManagement
            attendants={attendants}
            currentAttendant={currentAttendant}
            onAddAttendant={() => {}}
            onUpdateAttendant={() => {}}
          />
        );
      case 'suppliers':
        return (
          <SupplierManagement
            suppliers={suppliers}
            onAddSupplier={() => {}}
            onUpdateSupplier={() => {}}
            onDeleteSupplier={() => {}}
          />
        );
      case 'loyalty':
        return (
          <LoyaltyManagement
            customers={customers}
            onUpdateCustomer={() => {}}
          />
        );
      case 'stores':
        return <MultiStoreManagement />;
      case 'returns':
        return (
          <ReturnsManagement
            transactions={transactions}
            onRefundTransaction={() => {}}
          />
        );
      case 'expenses':
        return (
          <ExpenseManagement
            expenses={expenses}
            attendants={attendants}
            currentAttendant={currentAttendant}
            onAddExpense={() => {}}
          />
        );
      case 'purchases':
        return <PurchaseManagement />;
      case 'hire-purchase':
        return (
          <HirePurchase
            totalAmount={1000}
            customers={customers}
            hirePurchases={[]}
            cartItems={[]}
            storeSettings={{
              smsEnabled: true,
              businessName: 'TOPTEN ELECTRONICS',
              businessPhone: '0725333337',
              mpesaPaybill: '174379',
              mpesaAccount: '9951109',
              hirePurchaseTemplate: 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}',
              smsProvider: 'phone'
            }}
            onCreateHirePurchase={() => `hp-${Date.now()}`}
            onCancel={() => {}}
          />
        );
      case 'online-store':
        return <OnlineStoreManager />;
      default:
        return <ProductManagement />;
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
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
