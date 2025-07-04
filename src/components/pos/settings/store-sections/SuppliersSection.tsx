
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Truck, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export const SuppliersSection: React.FC = () => {
  const { currentStore, getStoreSuppliers } = useStore();

  if (!currentStore) return null;

  const storeSuppliers = getStoreSuppliers(currentStore.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Suppliers ({storeSuppliers.length})
              </div>
              <ChevronRight className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Store Suppliers ({storeSuppliers.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {storeSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500">No suppliers added for this store yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeSuppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
