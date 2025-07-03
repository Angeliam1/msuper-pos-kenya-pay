
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Customer, Transaction } from '@/types';
import { Plus, Edit, Phone, Mail, FileText } from 'lucide-react';
import { CustomerStatement } from './CustomerStatement';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, addCustomer, updateCustomer, getTransactions } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export const CustomerManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: 0,
    loyaltyPoints: 0
  });

  // Queries
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Mutations
  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Success", description: "Customer added successfully" });
      setFormData({ name: '', phone: '', email: '', address: '', creditLimit: 0, loyaltyPoints: 0 });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Customer> }) => 
      updateCustomer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Success", description: "Customer updated successfully" });
      setFormData({ name: '', phone: '', email: '', address: '', creditLimit: 0, loyaltyPoints: 0 });
      setEditingCustomer(null);
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      updateCustomerMutation.mutate({
        id: editingCustomer.id,
        updates: formData
      });
    } else {
      addCustomerMutation.mutate({
        ...formData,
        outstandingBalance: 0
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      creditLimit: customer.creditLimit,
      loyaltyPoints: customer.loyaltyPoints
    });
    setIsDialogOpen(true);
  };

  const getCustomerTransactionCount = (customerId: string) => {
    return transactions.filter(t => t.customerId === customerId).length;
  };

  const getCustomerTotalSpent = (customerId: string) => {
    return transactions
      .filter(t => t.customerId === customerId)
      .reduce((sum, t) => sum + t.total, 0);
  };

  if (customersLoading) {
    return <div className="flex justify-center p-8">Loading customers...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditLimit">Credit Limit (KES)</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                    <Input
                      id="loyaltyPoints"
                      type="number"
                      value={formData.loyaltyPoints}
                      onChange={(e) => setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={addCustomerMutation.isPending || updateCustomerMutation.isPending}
                  >
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Credit Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(customer => {
                const transactionCount = getCustomerTransactionCount(customer.id);
                const totalSpent = getCustomerTotalSpent(customer.id);
                
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold">{transactionCount}</div>
                        <div className="text-xs text-gray-500">purchases</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatPrice(totalSpent)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Limit: {formatPrice(customer.creditLimit)}</div>
                        <div className={customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                          Balance: {formatPrice(customer.outstandingBalance)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.outstandingBalance > customer.creditLimit ? 'destructive' : 'default'}>
                        {customer.outstandingBalance > customer.creditLimit ? 'Over Limit' : 'Good'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <CustomerStatement
          customer={selectedCustomer}
          transactions={transactions}
          products={[]}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </>
  );
};
