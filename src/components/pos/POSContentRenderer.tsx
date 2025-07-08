
import React from 'react';
import { ProductManagement } from './ProductManagement';
import { Dashboard } from './Dashboard';
import { EnhancedReports } from './EnhancedReports';
import { AdvancedMultiStoreDashboard } from './AdvancedMultiStoreDashboard';
import { AdvancedInventoryManagement } from './AdvancedInventoryManagement';
import { OnlineStoreManager } from '../online-store/OnlineStoreManager';
import { LoyaltyProgram } from './LoyaltyProgram';
import { ThermalPrinter } from './ThermalPrinter';
import { Settings } from './Settings';
import { EnhancedProductManagement } from './EnhancedProductManagement';
import { EnhancedBarcodeScanner } from './EnhancedBarcodeScanner';

interface POSContentRendererProps {
  activeTab: string;
  showBarcodeScanner: boolean;
  setShowBarcodeScanner: (show: boolean) => void;
  totalSales: number;
  todaySales: number;
  transactions: any[];
  products: any[];
  customers: any[];
  onProductFound: (product: any) => void;
  onAddProduct: (productData: any) => void;
  onUpdateProduct: (id: string, updates: any) => void;
  onDeleteProduct: (id: string) => void;
  onAddCustomer: (customerData: any) => void;
  onUpdateCustomer: (id: string, updates: any) => void;
  onSaveSettings: (settings: any) => void;
}

export const POSContentRenderer: React.FC<POSContentRendererProps> = ({
  activeTab,
  showBarcodeScanner,
  setShowBarcodeScanner,
  totalSales,
  todaySales,
  transactions,
  products,
  customers,
  onProductFound,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCustomer,
  onUpdateCustomer,
  onSaveSettings
}) => {
  if (showBarcodeScanner) {
    return (
      <div className="p-6">
        <EnhancedBarcodeScanner
          products={products}
          onProductFound={onProductFound}
          onClose={() => setShowBarcodeScanner(false)}
        />
      </div>
    );
  }

  switch (activeTab) {
    case 'pos':
      return <ProductManagement />;
    case 'dashboard':
      return (
        <div className="p-6">
          <Dashboard
            totalSales={totalSales}
            todaySales={todaySales}
            transactionCount={transactions.length}
            transactions={transactions}
            products={products}
          />
        </div>
      );
    case 'reports':
      return (
        <div className="p-6">
          <EnhancedReports
            transactions={transactions}
            products={products}
            customers={customers}
          />
        </div>
      );
    case 'stores':
      return (
        <div className="p-6">
          <AdvancedMultiStoreDashboard />
        </div>
      );
    case 'inventory':
      return (
        <div className="p-6">
          <AdvancedInventoryManagement />
        </div>
      );
    case 'online-store':
      return (
        <div className="p-6">
          <OnlineStoreManager />
        </div>
      );
    case 'loyalty':
      return (
        <div className="p-6">
          <LoyaltyProgram
            customers={customers}
            onUpdateCustomer={onUpdateCustomer}
            onAddCustomer={onAddCustomer}
          />
        </div>
      );
    case 'printer':
      return (
        <div className="p-6">
          <ThermalPrinter />
        </div>
      );
    case 'settings':
      return (
        <div className="p-6">
          <div className="space-y-6">
            <Settings onSaveSettings={onSaveSettings} />
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Enhanced Product Management</h3>
              <EnhancedProductManagement
                products={products}
                onAddProduct={onAddProduct}
                onUpdateProduct={onUpdateProduct}
                onDeleteProduct={onDeleteProduct}
              />
            </div>
          </div>
        </div>
      );
    default:
      return <ProductManagement />;
  }
};
