
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DemoHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  productsCount: number;
  customersCount: number;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  searchTerm,
  onSearchChange,
  productsCount,
  customersCount
}) => {
  return (
    <div className="sticky top-0 bg-white border-b z-10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-green-600">🚀 DEMO STORE</h2>
          <p className="text-xs text-gray-600">Testing Mode - No Real Transactions</p>
          <p className="text-xs text-blue-600">{productsCount} products | {customersCount} customers</p>
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-full"
        />
      </div>
    </div>
  );
};
