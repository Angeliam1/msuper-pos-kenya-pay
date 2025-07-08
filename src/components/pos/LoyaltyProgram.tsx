
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Star, 
  Users, 
  Trophy, 
  Plus,
  Search,
  Award,
  TrendingUp,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Customer } from '@/types';

interface LoyaltyProgramProps {
  customers: Customer[];
  onUpdateCustomer: (id: string, data: Partial<Customer>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

interface LoyaltySettings {
  pointsPerPurchase: number;
  pointsValue: number; // KES per point
  minimumRedemption: number;
  bonusThreshold: number;
  bonusMultiplier: number;
}

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  isActive: boolean;
}

export const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  customers,
  onUpdateCustomer,
  onAddCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    pointsPerPurchase: 1,
    pointsValue: 1,
    minimumRedemption: 100,
    bonusThreshold: 1000,
    bonusMultiplier: 2
  });

  const [rewards] = useState<Reward[]>([
    { id: '1', name: '5% Discount', pointsCost: 100, description: '5% off next purchase', isActive: true },
    { id: '2', name: '10% Discount', pointsCost: 200, description: '10% off next purchase', isActive: true },
    { id: '3', name: 'Free Item', pointsCost: 500, description: 'One free item up to KES 100', isActive: true },
    { id: '4', name: 'VIP Status', pointsCost: 1000, description: 'VIP customer status for 30 days', isActive: true }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerLoyaltyPoints = (customer: Customer) => {
    return (customer as any).loyaltyPoints || 0;
  };

  const getCustomerTier = (points: number) => {
    if (points >= 5000) return { name: 'Platinum', color: 'bg-purple-100 text-purple-800', icon: Crown };
    if (points >= 2000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: Trophy };
    if (points >= 500) return { name: 'Silver', color: 'bg-gray-100 text-gray-800', icon: Award };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: Star };
  };

  const handleAddPoints = (customerId: string, points: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const currentPoints = getCustomerLoyaltyPoints(customer);
      const newPoints = Math.max(0, currentPoints + points);
      
      onUpdateCustomer(customerId, {
        ...customer,
        loyaltyPoints: newPoints
      });

      toast({
        title: points > 0 ? "Points Added" : "Points Redeemed",
        description: `${Math.abs(points)} points ${points > 0 ? 'added to' : 'redeemed from'} ${customer.name}'s account`,
      });
    }
  };

  const handleRedeemReward = (customerId: string, reward: Reward) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const currentPoints = getCustomerLoyaltyPoints(customer);
      
      if (currentPoints >= reward.pointsCost) {
        handleAddPoints(customerId, -reward.pointsCost);
        toast({
          title: "Reward Redeemed",
          description: `${customer.name} redeemed ${reward.name}`,
        });
      } else {
        toast({
          title: "Insufficient Points",
          description: `Need ${reward.pointsCost - currentPoints} more points`,
          variant: "destructive"
        });
      }
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

  const topCustomers = [...customers]
    .sort((a, b) => getCustomerLoyaltyPoints(b) - getCustomerLoyaltyPoints(a))
    .slice(0, 10);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => getCustomerLoyaltyPoints(c) > 0).length;
  const totalPointsIssued = customers.reduce((sum, c) => sum + getCustomerLoyaltyPoints(c), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Issued</p>
                <p className="text-2xl font-bold">{totalPointsIssued.toLocaleString()}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map(reward => (
                  <Card key={reward.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{reward.name}</h4>
                      <Badge variant={reward.isActive ? "default" : "secondary"}>
                        {reward.pointsCost} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      disabled={!reward.isActive}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Points per KES 100 spent</Label>
                  <Input
                    type="number"
                    value={loyaltySettings.pointsPerPurchase}
                    onChange={(e) => setLoyaltySettings({
                      ...loyaltySettings,
                      pointsPerPurchase: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Point Value (KES)</Label>
                  <Input
                    type="number"
                    value={loyaltySettings.pointsValue}
                    onChange={(e) => setLoyaltySettings({
                      ...loyaltySettings,
                      pointsValue: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Minimum Redemption Points</Label>
                  <Input
                    type="number"
                    value={loyaltySettings.minimumRedemption}
                    onChange={(e) => setLoyaltySettings({
                      ...loyaltySettings,
                      minimumRedemption: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Bonus Threshold (KES)</Label>
                  <Input
                    type="number"
                    value={loyaltySettings.bonusThreshold}
                    onChange={(e) => setLoyaltySettings({
                      ...loyaltySettings,
                      bonusThreshold: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => {
                  const points = getCustomerLoyaltyPoints(customer);
                  const tier = getCustomerTier(points);
                  const TierIcon = tier.icon;

                  return (
                    <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={tier.color}>
                              <TierIcon className="h-3 w-3 mr-1" />
                              {tier.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{points} pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
