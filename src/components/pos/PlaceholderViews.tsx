
import React from 'react';
import { Package, FileText, Settings as SettingsIcon } from 'lucide-react';

export const ProductsView: React.FC = () => (
  <div className="text-center py-8">
    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Product Management</h2>
    <p className="text-gray-600">Manage your inventory and products</p>
  </div>
);

export const ReportsView: React.FC = () => (
  <div className="text-center py-8">
    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Reports</h2>
    <p className="text-gray-600">View sales reports and analytics</p>
  </div>
);

export const SettingsView: React.FC = () => (
  <div className="text-center py-8">
    <SettingsIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Settings</h2>
    <p className="text-gray-600">Configure your POS system</p>
  </div>
);
