
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';

interface OrderHistoryProps {
  customer: Customer;
  onBack: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  customer,
  onBack,
}) => {
  // Mock orders data - in a real app, this would come from the database
  const mockOrders = [
    {
      id: 'MSU-123456',
      date: new Date('2024-01-15'),
      items: [
        { name: 'Coca Cola 500ml', quantity: 2, price: 80 },
        { name: 'Bread', quantity: 1, price: 60 },
      ],
      total: 220,
      status: 'delivered' as const,
      deliveryAddress: customer.address || 'Nairobi, Kenya',
    },
    {
      id: 'MSU-123457',
      date: new Date('2024-01-10'),
      items: [
        { name: 'Milk 1L', quantity: 1, price: 120 },
        { name: 'Sugar 1kg', quantity: 1, price: 150 },
      ],
      total: 270,
      status: 'processing' as const,
      deliveryAddress: customer.address || 'Nairobi, Kenya',
    },
  ];

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
      </div>

      {mockOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <Button onClick={onBack}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockOrders.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {order.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Order Summary */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Delivery to: {order.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
