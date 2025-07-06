import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Purchase, PurchaseItem, Supplier } from '@/types';

interface PurchaseManagementProps {
  suppliers: Supplier[];
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
}

export const PurchaseManagement: React.FC<PurchaseManagementProps> = ({ suppliers, onAddPurchase }) => {
  const { toast } = useToast();
  const [newPurchase, setNewPurchase] = useState({
    supplierId: '',
    invoiceNumber: '',
    notes: ''
  });
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [newItem, setNewItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    unitCost: 0,
    total: 0
  });

  const handleAddItem = () => {
    if (newItem.productId && newItem.quantity > 0 && newItem.unitCost > 0) {
      const total = newItem.quantity * newItem.unitCost;
      setPurchaseItems([...purchaseItems, { ...newItem, total }]);
      setNewItem({
        productId: '',
        productName: '',
        quantity: 1,
        unitCost: 0,
        total: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...purchaseItems];
    updatedItems.splice(index, 1);
    setPurchaseItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPurchase.supplierId || purchaseItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select supplier and add items",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = purchaseItems.reduce((sum, item) => sum + item.total, 0);
    
    const purchaseData: Omit<Purchase, 'id'> = {
      supplierId: newPurchase.supplierId,
      items: purchaseItems,
      total: totalAmount,
      totalAmount: totalAmount,
      date: new Date(),
      purchaseDate: new Date(),
      status: 'pending' as const,
      invoiceNumber: newPurchase.invoiceNumber,
      notes: newPurchase.notes,
      attendantId: 'current-attendant'
    };

    onAddPurchase(purchaseData);
    
    setNewPurchase({
      supplierId: '',
      invoiceNumber: '',
      notes: ''
    });
    setPurchaseItems([]);
    toast({
      title: "Purchase Added",
      description: "New purchase order added",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          New Purchase Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Supplier</Label>
            <Select onValueChange={(value) => setNewPurchase({ ...newPurchase, supplierId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={newPurchase.invoiceNumber}
                onChange={(e) => setNewPurchase({ ...newPurchase, invoiceNumber: e.target.value })}
                placeholder="Invoice Number"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                value={newPurchase.notes}
                onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
                placeholder="Notes"
              />
            </div>
          </div>
          <div>
            <Label>Add Item</Label>
            <div className="flex gap-2">
              <Input
                value={newItem.productName}
                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                placeholder="Product Name"
              />
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                placeholder="Quantity"
              />
              <Input
                type="number"
                value={newItem.unitCost}
                onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) })}
                placeholder="Unit Cost"
              />
              <Button type="button" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
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
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitCost}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button type="submit">Create Purchase</Button>
        </form>
      </CardContent>
    </Card>
  );
};
