
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { Printer, Download, QrCode, Gift } from 'lucide-react';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
  storeSettings: {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeEmail: string;
    kraPin?: string;
    mpesaPaybill?: string;
    mpesaAccount?: string;
    mpesaTill?: string;
    bankAccount?: string;
    paymentInstructions?: string;
    paybill: string;
    showStoreName: boolean;
    showStoreAddress: boolean;
    showStorePhone: boolean;
    showCustomerName: boolean;
    showCustomerPhone: boolean;
    showCustomerAddress: boolean;
    showNotes: boolean;
    receiptHeader: string;
    receiptFooter: string;
    showBarcode: boolean;
    receiptCodeType: 'qr' | 'barcode';
  };
  customer?: {
    name: string;
    phone: string;
    address: string;
    loyaltyPoints?: number;
  };
  notes?: string;
  loyaltyPointsEarned?: number;
}

export const Receipt: React.FC<ReceiptProps> = ({ 
  transaction, 
  onClose, 
  storeSettings,
  customer,
  notes,
  loyaltyPointsEarned = 0
}) => {
  const formatPrice = (price: number) => `KSh${price.toLocaleString()}.00`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log('Downloading receipt...');
  };

  // Generate QR code data with transaction info for quick search
  const generateQRData = () => {
    const qrData = {
      transactionId: transaction.id,
      store: storeSettings.storeName,
      date: new Date(transaction.timestamp).toISOString().split('T')[0],
      total: transaction.total,
      items: transaction.items.length,
      customer: customer?.name || 'Walk-in'
    };
    return JSON.stringify(qrData);
  };

  const qrCodeData = generateQRData();

  return (
    <Card className="max-w-md mx-auto bg-white">
      <CardHeader className="text-center pb-2">
        {storeSettings.receiptHeader && (
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            {storeSettings.receiptHeader}
          </div>
        )}
        
        {storeSettings.showStoreName && (
          <CardTitle className="text-lg sm:text-xl font-bold uppercase tracking-wide">
            {storeSettings.storeName}
          </CardTitle>
        )}
        
        <div className="text-xs sm:text-sm text-gray-800 space-y-1">
          {storeSettings.showStoreAddress && <p className="font-medium">{storeSettings.storeAddress}</p>}
          {storeSettings.showStorePhone && <p>Tel: {storeSettings.storePhone}</p>}
          {storeSettings.storeEmail && <p>Email: {storeSettings.storeEmail}</p>}
          {storeSettings.kraPin && <p>KRA PIN: {storeSettings.kraPin}</p>}
          
          {/* Payment Options */}
          <div className="mt-2 space-y-1">
            {storeSettings.mpesaPaybill && storeSettings.mpesaAccount && (
              <p className="font-medium">Paybill: {storeSettings.mpesaPaybill} Acc: {storeSettings.mpesaAccount}</p>
            )}
            {storeSettings.mpesaTill && (
              <p className="font-medium">Till: {storeSettings.mpesaTill}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <div className="border-t border-dashed border-gray-400"></div>
        
        <div className="text-xs sm:text-sm text-gray-800">
          <p>Receipt #: {transaction.id}</p>
          <p>Date: {new Date(transaction.timestamp).toLocaleDateString('en-GB')} {new Date(transaction.timestamp).toLocaleTimeString('en-GB', { hour12: false })}</p>
        </div>

        {customer && (
          <div className="text-xs sm:text-sm text-gray-800 space-y-1">
            {storeSettings.showCustomerName && customer.name && <p>Customer: {customer.name}</p>}
            {storeSettings.showCustomerPhone && customer.phone && <p>Phone: {customer.phone}</p>}
            {storeSettings.showCustomerAddress && customer.address && <p>Address: {customer.address}</p>}
          </div>
        )}

        {notes && storeSettings.showNotes && (
          <div className="text-xs sm:text-sm text-gray-800">
            <p>Notes: {notes}</p>
          </div>
        )}

        <div className="border-t border-dashed border-gray-400"></div>

        <div className="space-y-2">
          {transaction.items.map(item => (
            <div key={item.id} className="text-xs sm:text-sm text-gray-800">
              <div className="font-medium uppercase">{item.name}</div>
              <div className="flex justify-between">
                <span>{item.quantity}pcs</span>
                <span>{formatPrice(item.price)}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-400"></div>

        <div className="space-y-2 text-xs sm:text-sm text-gray-800">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(transaction.total)}</span>
          </div>
          
          <div className="flex justify-between text-base sm:text-lg font-bold">
            <span>Grand Total</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>
          
          {/* Payment Methods */}
          <div className="space-y-1">
            <div className="font-medium">Payment Method(s):</div>
            {transaction.paymentSplits.map((split, index) => (
              <div key={index} className="flex justify-between">
                <span className="capitalize">{split.method === 'mpesa' ? 'M-Pesa' : split.method}</span>
                <span className="font-medium">{formatPrice(split.amount)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <span>Change</span>
            <span className="font-medium">KSh0.00</span>
          </div>
          
          <div className="text-right">
            <Badge variant="default" className="bg-black text-white font-bold text-sm sm:text-lg px-3 sm:px-4 py-1">
              PAID
            </Badge>
          </div>
        </div>

        {/* Loyalty Points Section */}
        {customer && (loyaltyPointsEarned > 0 || (customer.loyaltyPoints && customer.loyaltyPoints > 0)) && (
          <div className="border-t border-dashed border-gray-400 pt-3">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-4 w-4 text-blue-600" />
                <div className="text-sm font-medium text-blue-600">Loyalty Points</div>
              </div>
              {loyaltyPointsEarned > 0 && (
                <div className="text-xs text-gray-800">
                  Points Earned: <span className="font-medium text-green-600">+{loyaltyPointsEarned}</span>
                </div>
              )}
              {customer.loyaltyPoints && customer.loyaltyPoints > 0 && (
                <div className="text-xs text-gray-800">
                  Total Points: <span className="font-medium text-blue-600">{customer.loyaltyPoints}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {storeSettings.showBarcode && (
          <div className="flex justify-center py-3 sm:py-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black flex items-center justify-center mb-2">
                <QrCode className="text-white h-12 w-12 sm:h-16 sm:w-16" />
              </div>
              <div className="text-xs text-gray-600 text-center max-w-[200px] break-all">
                Transaction: {transaction.id}
              </div>
            </div>
          </div>
        )}

        {storeSettings.receiptFooter && (
          <div className="text-center text-xs sm:text-sm text-gray-600 border-t border-dashed border-gray-400 pt-3">
            <p>{storeSettings.receiptFooter}</p>
          </div>
        )}

        <div className="text-center text-xs sm:text-sm text-gray-600">
          <p>Printed: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: false })}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1 text-xs sm:text-sm">
            <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1 text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Download
          </Button>
        </div>

        <Button onClick={onClose} className="w-full text-xs sm:text-sm">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};
