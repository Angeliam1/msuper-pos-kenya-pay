
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Plus } from 'lucide-react';
import { Supplier } from '@/types';
import { SupplierCard } from './SupplierCard';

interface SupplierListProps {
  suppliers: Supplier[];
  onAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Suppliers
          </CardTitle>
          <Button onClick={onAddSupplier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(supplier => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={onEditSupplier}
              onDelete={onDeleteSupplier}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
