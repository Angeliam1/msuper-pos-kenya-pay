
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Receipt, ChevronRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export const SalesHistorySection: React.FC = () => {
  const { currentStore, getStoreTransactions } = useStore();

  if (!currentStore) return null;

  const storeTransactions = getStoreTransactions(currentStore.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Sales History ({storeTransactions.length})
              </div>
              <ChevronRight className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Store Transactions ({storeTransactions.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {storeTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500">No transactions recorded for this store yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeTransactions.slice(0, 10).map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell>{transaction.timestamp.toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.items.length} items</TableCell>
                    <TableCell>KES {transaction.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
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
