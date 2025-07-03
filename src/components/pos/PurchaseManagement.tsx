
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Plus } from 'lucide-react';
import { Purchase, PurchaseItem, Supplier, Product } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPurchases, addPurchase, getSuppliers, getProducts, updateProduct } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export const PurchaseManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [formData, setFormData] = useState({
    supplierId: '',
    invoiceNumber: ''
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: '',
    unitCost: ''
  });

  // Queries
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Mutations
  const addPurchaseMutation = useMutation({
    mutationFn: addPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Success", description: "Purchase recorded successfully" });
      setPurchaseItems([]);
      setFormData({ supplierId: '', invoiceNumber: '' });
      setShowAddForm(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) => 
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleAddItem = () => {
    if (newItem.productId && newItem.quantity && newItem.unitCost) {
      const product = products.find(p => p.id === newItem.productId);
      if (product) {
        const quantity = parseInt(newItem.quantity);
        const unitCost = parseFloat(newItem.unitCost);
        const totalCost = quantity * unitCost;

        const item: PurchaseItem = {
          productId: product.id,
          productName: product.name,
          quantity,
          unitCost,
          totalCost
        };

        setPurchaseItems(prev => [...prev, item]);
        setNewItem({ productId: '', quantity: '', unitCost: '' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length > 0 && formData.supplierId) {
      const totalCost = purchaseItems.reduce((sum, item) => sum + item.totalCost, 0);

      const purchase: Omit<Purchase, 'id'> = {
        supplierId: formData.supplierId,
        items: purchaseItems,
        totalCost,
        date: new Date(),
        attendantId: 'current-user', // This would come from auth context
        invoiceNumber: formData.invoiceNumber
      };

      try {
        await addPurchaseMutation.mutateAsync(purchase);

        // Update product stock and buying costs
        for (const item of purchaseItems) {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            await updateProductMutation.mutateAsync({
              id: item.productId,
              updates: {
                stock: product.stock + item.quantity,
                buyingCost: item.unitCost
              }
            });
          }
        }
      } catch (error) {
        console.error('Error processing purchase:', error);
      }
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const totalPurchaseCost = purchaseItems.reduce((sum, item) => sum + item.totalCost, 0);

  if (purchasesLoading) {
    return <div className="flex justify-center p-8">Loading purchases...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Purchase History
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {purchases.map(purchase => (
              <div key={purchase.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Purchase #{purchase.id.slice(-8)}</h4>
                    <p className="text-sm text-gray-600">
                      {getSupplierName(purchase.supplierId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600">
                    {formatPrice(purchase.totalCost)}
                  </span>
                </div>
                <div className="space-y-1">
                  {purchase.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>{formatPrice(item.totalCost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {purchases.length === 0 && (
              <p className="text-center text-gray-500 py-8">No purchases recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Supplier</Label>
                  <Select value={formData.supplierId} onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice Number</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="Invoice/Receipt number"
                  />
                </div>
              </div>

              {/* Add Items Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Items</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Product</Label>
                    <Select value={newItem.productId} onValueChange={(value) => setNewItem(prev => ({ ...prev, productId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Qty"
                    />
                  </div>
                  <div>
                    <Label>Unit Cost (KES)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddItem} variant="outline">
                  Add Item
                </Button>
              </div>

              {/* Purchase Items List */}
              {purchaseItems.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Purchase Items</h4>
                  <div className="space-y-2">
                    {purchaseItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName} x{item.quantity}</span>
                        <span className="font-semibold">{formatPrice(item.totalCost)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(totalPurchaseCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={purchaseItems.length === 0 || addPurchaseMutation.isPending}
                >
                  Complete Purchase
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
