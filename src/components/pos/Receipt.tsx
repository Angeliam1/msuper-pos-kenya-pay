
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { Printer, Download } from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Downloading receipt...');
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg">MSUPER POS</CardTitle>
        <p className="text-sm text-gray-600">Receipt</p>
        <p className="text-xs text-gray-500">
          Transaction #{transaction.id}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center border-b pb-2">
          <p className="text-xs text-gray-600">
            {new Date(transaction.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="space-y-2">
          {transaction.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>
        </div>

        <div className="border-t pt-2 text-center">
          <p className="text-sm font-medium">
            Payment Method: {transaction.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}
          </p>
          {transaction.mpesaReference && (
            <p className="text-xs text-gray-600">
              Ref: {transaction.mpesaReference}
            </p>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 border-t pt-2">
          <p>Thank you for your business!</p>
          <p>Karibu tena!</p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};
