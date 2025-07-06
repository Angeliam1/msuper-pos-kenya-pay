import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Calendar,
  Pause,
  Play,
  Ban,
  RefreshCw
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  storeId: string;
  subscriptionId: string;
  status: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial';
  plan: 'basic' | 'premium' | 'enterprise';
  monthlyFee: number;
  lastPayment: Date;
  nextBilling: Date;
  daysOverdue: number;
  totalRevenue: number;
  gracePeriodEnds?: Date;
}

export const SubscriptionManager: React.FC = () => {
  const { stores, updateStore } = useStore();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock subscription data - in real implementation, this would come from your billing system
  useEffect(() => {
    const mockSubscriptions: SubscriptionData[] = stores.map((store, index) => ({
      storeId: store.id,
      subscriptionId: `sub_${store.id.slice(-8)}`,
      status: ['active', 'past_due', 'active', 'suspended'][index % 4] as any,
      plan: ['basic', 'premium', 'enterprise'][index % 3] as any,
      monthlyFee: [29.99, 59.99, 99.99][index % 3],
      lastPayment: new Date(Date.now() - (index * 7 + 5) * 24 * 60 * 60 * 1000),
      nextBilling: new Date(Date.now() + (30 - index * 2) * 24 * 60 * 60 * 1000),
      daysOverdue: index === 1 ? 15 : 0,
      totalRevenue: Math.floor(Math.random() * 5000) + 500,
      gracePeriodEnds: index === 1 ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : undefined
    }));
    setSubscriptions(mockSubscriptions);
  }, [stores]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'past_due': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'suspended': return <Ban className="h-4 w-4 text-red-500" />;
      case 'trial': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'past_due': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleServiceAction = async (action: 'suspend' | 'activate' | 'terminate', subscriptionId: string) => {
    setActionLoading(subscriptionId + action);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const store = stores.find(s => 
      subscriptions.find(sub => sub.subscriptionId === subscriptionId)?.storeId === s.id
    );
    
    if (store) {
      switch (action) {
        case 'suspend':
          updateStore(store.id, { isActive: false, status: 'suspended' });
          setSubscriptions(prev => prev.map(sub => 
            sub.subscriptionId === subscriptionId 
              ? { ...sub, status: 'suspended' }
              : sub
          ));
          toast({
            title: "Service Suspended",
            description: `${store.name} has been suspended due to non-payment`,
            variant: "destructive"
          });
          break;
        case 'activate':
          updateStore(store.id, { isActive: true, status: 'active' });
          setSubscriptions(prev => prev.map(sub => 
            sub.subscriptionId === subscriptionId 
              ? { ...sub, status: 'active', daysOverdue: 0 }
              : sub
          ));
          toast({
            title: "Service Activated",
            description: `${store.name} has been reactivated`,
          });
          break;
        case 'terminate':
          updateStore(store.id, { isActive: false, status: 'inactive' });
          setSubscriptions(prev => prev.map(sub => 
            sub.subscriptionId === subscriptionId 
              ? { ...sub, status: 'cancelled' }
              : sub
          ));
          toast({
            title: "Service Terminated",
            description: `${store.name} subscription has been cancelled`,
            variant: "destructive"
          });
          break;
      }
    }
    
    setActionLoading(null);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString();

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.totalRevenue, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const overdueSubscriptions = subscriptions.filter(sub => sub.status === 'past_due').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-gray-600">Monitor and control all customer subscriptions</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{activeSubscriptions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="text-2xl font-bold">{overdueSubscriptions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Overdue Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">{subscriptions.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alerts */}
      {overdueSubscriptions > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{overdueSubscriptions} subscription{overdueSubscriptions > 1 ? 's' : ''}</strong> 
            {overdueSubscriptions > 1 ? ' are' : ' is'} overdue. Review and take action to maintain service quality.
          </AlertDescription>
        </Alert>
      )}

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map(sub => {
                const store = stores.find(s => s.id === sub.storeId);
                return (
                  <TableRow key={sub.subscriptionId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{store?.name || 'Unknown Store'}</div>
                        <div className="text-sm text-gray-500">{store?.address}</div>
                        {sub.daysOverdue > 0 && (
                          <div className="text-xs text-red-600 font-medium">
                            {sub.daysOverdue} days overdue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(sub.plan)}>
                        {sub.plan.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sub.status)}
                        <Badge className={getStatusColor(sub.status)}>
                          {sub.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(sub.monthlyFee)}</TableCell>
                    <TableCell>{formatDate(sub.lastPayment)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(sub.nextBilling)}</span>
                        {sub.gracePeriodEnds && (
                          <span className="text-xs text-orange-600">
                            Grace ends: {formatDate(sub.gracePeriodEnds)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(sub.totalRevenue)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {sub.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction('suspend', sub.subscriptionId)}
                            disabled={actionLoading === sub.subscriptionId + 'suspend'}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        {(sub.status === 'suspended' || sub.status === 'past_due') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceAction('activate', sub.subscriptionId)}
                            disabled={actionLoading === sub.subscriptionId + 'activate'}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction('terminate', sub.subscriptionId)}
                          disabled={actionLoading === sub.subscriptionId + 'terminate'}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="h-3 w-3" />
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
    </div>
  );
};
