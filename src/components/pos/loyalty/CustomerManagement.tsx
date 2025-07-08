
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Star, Trophy, Award, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types';

interface CustomerManagementProps {
  customers: Customer[];
  onUpdateCustomer: (id: string, data: Partial<Customer>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onUpdateCustomer,
  onAddCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const { toast } = useToast();

  const getCustomerLoyaltyPoints = (customer: Customer) => {
    return customer.loyaltyPoints || 0;
  };

  const getCustomerTier = (points: number) => {
    if (points >= 5000) return { name: 'Platinum', color: 'bg-purple-100 text-purple-800', icon: Crown };
    if (points >= 2000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: Trophy };
    if (points >= 500) return { name: 'Silver', color: 'bg-gray-100 text-gray-800', icon: Award };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: Star };
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPoints = (customerId: string, points: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const currentPoints = getCustomerLoyaltyPoints(customer);
      const newPoints = Math.max(0, currentPoints + points);
      
      onUpdateCustomer(customerId, {
        loyaltyPoints: newPoints
      });

      toast({
        title: points > 0 ? "Points Added" : "Points Redeemed",
        description: `${Math.abs(points)} points ${points > 0 ? 'added to' : 'redeemed from'} ${customer.name}'s account`,
      });
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone are required",
        variant: "destructive"
      });
      return;
    }

    const customer: Omit<Customer, 'id'> = {
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || undefined,
      loyaltyPoints: 0,
      creditLimit: 0,
      outstandingBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onAddCustomer(customer);
    setNewCustomer({ name: '', phone: '', email: '' });
    setShowAddCustomer(false);
    
    toast({
      title: "Customer Added",
      description: `${customer.name} added to loyalty program`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customer Management</CardTitle>
          <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="Email address"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddCustomer} className="flex-1">
                    Add Customer
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCustomers.map(customer => {
            const points = getCustomerLoyaltyPoints(customer);
            const tier = getCustomerTier(points);
            const TierIcon = tier.icon;

            return (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                    <Badge className={tier.color}>
                      <TierIcon className="h-3 w-3 mr-1" />
                      {tier.name}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-purple-600">{points} points</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddPoints(customer.id, 50)}
                  >
                    +50
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddPoints(customer.id, 100)}
                  >
                    +100
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
