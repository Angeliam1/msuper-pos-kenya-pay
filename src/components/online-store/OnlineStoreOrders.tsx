
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: string;
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const OnlineStoreOrders: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);

  // Mock orders data
  const [orders] = useState<OnlineOrder[]>([
    {
      id: '1',
      orderNumber: 'DD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+254712345678',
      items: [
        { id: '1', name: 'iPhone 15 Pro Max', price: 125000, quantity: 1 },
        { id: '2', name: 'AirPods Pro', price: 25000, quantity: 1 }
      ],
      total: 150000,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'M-Pesa',
      shippingAddress: '123 Main St, Nairobi',
      orderDate: new Date('2024-01-15'),
      notes: 'Please handle with care'
    },
    {
      id: '2',
      orderNumber: 'DD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+254723456789',
      items: [
        { id: '3', name: 'MacBook Air M3', price: 155000, quantity: 1 }
      ],
      total: 155000,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '456 Oak Ave, Mombasa',
      orderDate: new Date('2024-01-14'),
      deliveryDate: new Date('2024-01-16')
    },
    {
      id: '3',
      orderNumber: 'DD-2024-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      customerPhone: '+254734567890',
      items: [
        { id: '4', name: 'Samsung Galaxy Watch', price: 45000, quantity: 2 }
      ],
      total: 90000,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Cash on Delivery',
      shippingAddress: '789 Pine Rd, Kisumu',
      orderDate: new Date('2024-01-16')
    }
  ]);

  // Enhanced search that includes customer name, order number, and email
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Order Updated",
      description: `Order status updated to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Online Store Orders</h2>
          <p className="text-gray-600">Manage and track your online orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredOrders.length} orders</Badge>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order number, customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{order.customerName}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{order.orderDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map(item => (
                      <p key={item.id} className="text-sm">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <strong>Delivery:</strong> {order.shippingAddress}
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold mb-2">Customer Information</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                              <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                              <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                              <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {selectedOrder.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold text-green-600">
                                {formatPrice(selectedOrder.total)}
                              </span>
                            </div>
                          </div>

                          {/* Status Update */}
                          <div>
                            <h4 className="font-semibold mb-2">Update Order Status</h4>
                            <Select 
                              value={selectedOrder.status}
                              onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Select 
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? `No orders match "${searchTerm}"` : 'No orders available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
