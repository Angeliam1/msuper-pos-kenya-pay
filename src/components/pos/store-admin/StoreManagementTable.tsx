
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Pause, Play, Trash2 } from 'lucide-react';

interface StoreManagementTableProps {
  stores: any[];
  getStoreProducts: (storeId: string) => any[];
  getStoreCashBalance: (storeId: string) => number;
  onViewStoreDetails: (store: any) => void;
  onToggleStoreStatus: (storeId: string) => void;
  onDeleteStore: (storeId: string) => void;
}

export const StoreManagementTable: React.FC<StoreManagementTableProps> = ({
  stores,
  getStoreProducts,
  getStoreCashBalance,
  onViewStoreDetails,
  onToggleStoreStatus,
  onDeleteStore
}) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map(store => (
              <TableRow key={store.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{store.name}</div>
                    <div className="text-sm text-gray-500">{store.address}</div>
                  </div>
                </TableCell>
                <TableCell>{store.managerId || 'Not assigned'}</TableCell>
                <TableCell>
                  <Badge variant={store.isActive ? 'default' : 'secondary'}>
                    {store.status || (store.isActive ? 'Active' : 'Inactive')}
                  </Badge>
                </TableCell>
                <TableCell>{getStoreProducts(store.id).length}</TableCell>
                <TableCell>{formatPrice(getStoreCashBalance(store.id))}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewStoreDetails(store)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStoreStatus(store.id)}
                    >
                      {store.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteStore(store.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
