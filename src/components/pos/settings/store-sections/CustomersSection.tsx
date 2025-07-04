
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export const CustomersSection: React.FC = () => {
  const { currentStore, getStoreCustomers } = useStore();

  if (!currentStore) return null;

  const storeCustomers = getStoreCustomers(currentStore.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customers ({storeCustomers.length})
              </div>
              <ChevronRight className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Store Customers ({storeCustomers.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {storeCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500">No customers registered for this store yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Outstanding Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeCustomers.filter(c => c.id !== 'walk-in').map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.loyaltyPoints}</TableCell>
                    <TableCell>
                      <Badge variant={customer.outstandingBalance > 0 ? "destructive" : "default"}>
                        KES {customer.outstandingBalance.toLocaleString()}
                      </Badge>
                    </TableCell>
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
