
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface EmptyProductsStateProps {
  onAddFirstProduct: () => void;
}

export const EmptyProductsState: React.FC<EmptyProductsStateProps> = ({ onAddFirstProduct }) => {
  return (
    <div className="text-center py-8">
      <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
      <p className="text-gray-500 mb-4">No products in this store yet</p>
      <Button onClick={onAddFirstProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Add First Product
      </Button>
    </div>
  );
};
