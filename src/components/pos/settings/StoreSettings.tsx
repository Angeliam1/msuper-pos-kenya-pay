
import React from 'react';
import { StoreInformation } from './store-sections/StoreInformation';
import { ProductsManagement } from './store-sections/ProductsManagement';
import { CustomersSection } from './store-sections/CustomersSection';
import { SuppliersSection } from './store-sections/SuppliersSection';
import { SalesHistorySection } from './store-sections/SalesHistorySection';

interface StoreSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="w-full space-y-6">
      <StoreInformation settings={settings} onSettingChange={onSettingChange} />
      <ProductsManagement />
      <CustomersSection />
      <SuppliersSection />
      <SalesHistorySection />
    </div>
  );
};
