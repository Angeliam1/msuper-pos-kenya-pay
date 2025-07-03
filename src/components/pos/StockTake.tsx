
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList, Save, Download, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, updateProduct } from '@/lib/database';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface StockCount {
  productId: string;
  systemCount: number;
  physicalCount: number;
  variance: number;
  counted: boolean;
}

export const StockTake: React.FC = () => {
  const { toast } = useToast();
  const [stockCounts, setStockCounts] = useState<Record<string, StockCount>>({});
  const [stockTakeStarted, setStockTakeStarted] = useState(false);

  const { data: products = [], refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const startStockTake = () => {
    const initialCounts: Record<string, StockCount> = {};
    products.forEach(product => {
      initialCounts[product.id] = {
        productId: product.id,
        systemCount: product.stock,
        physicalCount: 0,
        variance: 0,
        counted: false
      };
    });
    setStockCounts(initialCounts);
    setStockTakeStarted(true);
    toast({
      title: "Stock Take Started",
      description: "Begin counting your physical inventory",
    });
  };

  const updatePhysicalCount = (productId: string, count: number) => {
    setStockCounts(prev => {
      const updated = { ...prev };
      if (updated[productId]) {
        updated[productId] = {
          ...updated[productId],
          physicalCount: count,
          variance: count - updated[productId].systemCount,
          counted: true
        };
      }
      return updated;
    });
  };

  const finalizeStockTake = async () => {
    const updatePromises: Promise<Product>[] = [];
    
    Object.values(stockCounts).forEach(count => {
      if (count.counted && count.variance !== 0) {
        updatePromises.push(
          updateProduct(count.productId, { stock: count.physicalCount })
        );
      }
    });

    try {
      await Promise.all(updatePromises);
      await refetch();
      setStockTakeStarted(false);
      setStockCounts({});
      toast({
        title: "Stock Take Completed",
        description: "All stock levels have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock levels",
        variant: "destructive",
      });
    }
  };

  const exportStockTake = () => {
    const csvData = Object.values(stockCounts).map(count => {
      const product = products.find(p => p.id === count.productId);
      return [
        product?.name || '',
        product?.category || '',
        count.systemCount,
        count.physicalCount,
        count.variance,
        count.counted ? 'Yes' : 'No'
      ].join(',');
    });
    
    const csvContent = [
      'Product,Category,System Count,Physical Count,Variance,Counted',
      ...csvData
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-take-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getVarianceColor = (variance: number) => {
    if (variance === 0) return 'default';
    if (variance > 0) return 'secondary';
    return 'destructive';
  };

  const totalVariance = Object.values(stockCounts).reduce((sum, count) => sum + Math.abs(count.variance), 0);
  const countedItems = Object.values(stockCounts).filter(count => count.counted).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stock Take</h2>
        <div className="flex gap-2">
          {stockTakeStarted && (
            <>
              <Button variant="outline" onClick={exportStockTake}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={finalizeStockTake}>
                <Save className="h-4 w-4 mr-2" />
                Finalize
              </Button>
            </>
          )}
        </div>
      </div>

      {!stockTakeStarted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Start Stock Take
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Start a new stock take to count your physical inventory and reconcile with system records.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </div>
                  <div className="text-sm text-gray-600">System Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    KSh{products.reduce((sum, p) => sum + (p.stock * p.buyingCost), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
              <Button onClick={startStockTake} size="lg" className="w-full">
                Start Stock Take
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Card */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{countedItems}/{products.length}</div>
                  <div className="text-sm text-gray-600">Items Counted</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{totalVariance}</div>
                  <div className="text-sm text-gray-600">Total Variance</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round((countedItems / products.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {Object.values(stockCounts).filter(c => c.variance !== 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Discrepancies</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Count Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Count</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Physical</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => {
                    const count = stockCounts[product.id];
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{count?.systemCount || product.stock}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={count?.physicalCount || 0}
                            onChange={(e) => updatePhysicalCount(product.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={getVarianceColor(count?.variance || 0)}>
                            {count?.variance > 0 ? '+' : ''}{count?.variance || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Checkbox
                              checked={count?.counted || false}
                              disabled
                            />
                            <span className="ml-2 text-sm">
                              {count?.counted ? 'Counted' : 'Pending'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
