
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { Printer, Download } from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

// Store configuration - can be made dynamic from backend later
const STORE_CONFIG = {
  name: 'TOPTEN ELECTRONICS LTD.',
  location: 'GITHUNGURI TOWN OPP MAANDAMANO BAR',
  phones: ['0725333337', '0735333394'],
  mpesaTill: '9951109'
};

export const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Downloading receipt...');
  };

  const primaryPaymentMethod = transaction.paymentSplits[0]?.method || 'cash';
  const mpesaPayment = transaction.paymentSplits.find(split => split.method === 'mpesa');

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-bold">{STORE_CONFIG.name}</CardTitle>
        <div className="text-xs text-gray-600 space-y-1">
          <p>{STORE_CONFIG.location}</p>
          <p>Tel: {STORE_CONFIG.phones.join('/')}</p>
          <p>M-Pesa Till: {STORE_CONFIG.mpesaTill}</p>
        </div>
        <div className="border-t pt-2 mt-2">
          <p className="text-sm font-medium">RECEIPT</p>
          <p className="text-xs text-gray-500">
            Transaction #{transaction.id}
          </p>
        </div>
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

        <div className="border-t pt-2">
          <p className="text-sm font-medium mb-2">Payment Methods:</p>
          {transaction.paymentSplits.map((split, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span className="capitalize">
                {split.method === 'mpesa' ? 'M-Pesa' : split.method}:
              </span>
              <span>{formatPrice(split.amount)}</span>
            </div>
          ))}
          {mpesaPayment?.reference && (
            <p className="text-xs text-gray-600 mt-2">
              M-Pesa Ref: {mpesaPayment.reference}
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
