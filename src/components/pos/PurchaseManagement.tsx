
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, getSuppliers, getPurchases, addPurchase, updateProduct } from '@/lib/database';
import { Purchase, PurchaseItem, Product } from '@/types';

export const PurchaseManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const addPurchaseMutation = useMutation({
    mutationFn: async (purchaseData: Omit<Purchase, 'id'>) => {
      return await Promise.resolve(addPurchase(purchaseData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });
      resetForm();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      return await Promise.resolve(updateProduct(id, updates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const resetForm = () => {
    setSelectedSupplier('');
    setPurchaseItems([]);
    setInvoiceNumber('');
    setNotes('');
    setIsAddDialogOpen(false);
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, {
      productId: '',
      productName: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      total: 0
    }]);
  };

  const updatePurchaseItem = (index: number, updates: Partial<PurchaseItem>) => {
    const newItems = [...purchaseItems];
    newItems[index] = { ...newItems[index], ...updates };
    
    if (updates.quantity || updates.unitCost) {
      const totalCost = newItems[index].quantity * newItems[index].unitCost;
      newItems[index].totalCost = totalCost;
      newItems[index].total = totalCost;
    }
    
    setPurchaseItems(newItems);
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const handleSubmit = () => {
    if (!selectedSupplier || purchaseItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select a supplier and add items",
        variant: "destructive",
      });
      return;
    }

    const purchaseData: Omit<Purchase, 'id'> = {
      supplierId: selectedSupplier,
      items: purchaseItems,
      totalAmount: calculateTotal(),
      attendantId: '1',
      purchaseDate: new Date(),
      status: 'pending',
      invoiceNumber,
      notes
    };

    addPurchaseMutation.mutate(purchaseData);
  };

  const handleReceivePurchase = (purchaseId: string) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      // Update product stock
      purchase.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProductMutation.mutate({
            id: product.id,
            updates: { stock: product.stock + item.quantity }
          });
        }
      });

      toast({
        title: "Success",
        description: "Purchase received and stock updated",
      });
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoice">Invoice Number</Label>
                  <Input
                    id="invoice"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Items</Label>
                  <Button onClick={addPurchaseItem} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                {purchaseItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => {
                                const product = products.find(p => p.id === value);
                                updatePurchaseItem(index, {
                                  productId: value,
                                  productName: product?.name || ''
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updatePurchaseItem(index, { quantity: parseInt(e.target.value) || 0 })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => updatePurchaseItem(index, { unitCost: parseFloat(e.target.value) || 0 })}
                            />
                          </TableCell>
                          <TableCell>{formatPrice(item.totalCost)}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => removePurchaseItem(index)}
                              variant="destructive"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total: {formatPrice(calculateTotal())}
                </div>
                <div className="space-x-2">
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    Create Purchase Order
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map(purchase => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.purchaseDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {suppliers.find(s => s.id === purchase.supplierId)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>{purchase.items.length} items</TableCell>
                  <TableCell>{formatPrice(purchase.totalAmount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {purchase.status === 'pending' && <Package className="h-4 w-4 text-orange-500" />}
                      {purchase.status === 'received' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {purchase.status === 'cancelled' && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="capitalize">{purchase.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {purchase.status === 'pending' && (
                      <Button
                        onClick={() => handleReceivePurchase(purchase.id)}
                        size="sm"
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Receive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
