
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { Printer, Download } from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

// Store configuration - can be made dynamic from backend later
const STORE_CONFIG = {
  name: 'TOPTEN ELECTRONICS LTD',
  location: 'Githunguri Town Next To Main Market',
  paybill: 'Paybill 247247 Acc 333337',
  phone: '0725333337'
};

export const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Downloading receipt...');
  };

  const mpesaPayment = transaction.paymentSplits.find(split => split.method === 'mpesa');
  const customer = transaction.customerId ? { name: 'CUSTOMER NAME', phone: '0700000000', address: 'CUSTOMER ADDRESS' } : null;

  return (
    <Card className="max-w-md mx-auto bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold uppercase tracking-wide">{STORE_CONFIG.name}</CardTitle>
        <div className="text-sm text-gray-800 space-y-1">
          <p>{STORE_CONFIG.location}</p>
          <p>{STORE_CONFIG.paybill}</p>
          <p>{STORE_CONFIG.phone}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-6">
        {/* Divider */}
        <div className="border-t border-dashed border-gray-400"></div>
        
        {/* Date and Time */}
        <div className="text-sm text-gray-800">
          <p>Date: {new Date(transaction.timestamp).toLocaleDateString('en-GB')} {new Date(transaction.timestamp).toLocaleTimeString('en-GB', { hour12: false })}</p>
        </div>

        {/* Customer Information */}
        {customer && (
          <div className="text-sm text-gray-800 space-y-1">
            <p>Customer: {customer.name}</p>
            <p>Phone Number: {customer.phone}</p>
            <p>Address: {customer.address}</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400"></div>

        {/* Items */}
        <div className="space-y-2">
          {transaction.items.map(item => (
            <div key={item.id} className="text-sm text-gray-800">
              <div className="font-medium uppercase">{item.name}</div>
              <div className="flex justify-between">
                <span>{item.quantity}pcs</span>
                <span>{formatPrice(item.price)}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-400"></div>

        {/* Totals */}
        <div className="space-y-2 text-sm text-gray-800">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(transaction.total)}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Payment</span>
            <span className="font-medium">{formatPrice(transaction.total)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Change</span>
            <span className="font-medium">KSh0.00</span>
          </div>
          
          <div className="text-right">
            <Badge variant="default" className="bg-black text-white font-bold text-lg px-4 py-1">
              PAID
            </Badge>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 bg-black flex items-center justify-center">
            <div className="text-white text-xs text-center">
              QR<br/>CODE
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-center text-sm text-gray-600">
          <p>{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: false })}</p>
        </div>

        {/* Action Buttons */}
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
