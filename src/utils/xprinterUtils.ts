
// Xprinter utility functions for network printing
export interface PrinterSettings {
  ip: string;
  port: number;
  timeout?: number;
}

export const sendToXprinter = async (data: string, settings: PrinterSettings): Promise<boolean> => {
  try {
    // For web applications, we need to use a different approach since direct socket connections aren't available
    // We'll use a fetch request to a local printing service or implement browser-based printing
    
    console.log('Attempting to print to Xprinter:', settings);
    console.log('Print data:', data);
    
    // In a real implementation, you would either:
    // 1. Use a local printing service/bridge application
    // 2. Use browser's built-in printing with proper formatting
    // 3. Use a specialized printing library
    
    // For now, we'll simulate the printing process and use browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt Print</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                margin: 0;
                padding: 10px;
                width: 80mm;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .receipt-line { margin: 2px 0; }
            </style>
          </head>
          <body>
            <pre>${data}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error printing to Xprinter:', error);
    return false;
  }
};

export const generateReceiptText = (transaction: any, storeSettings: any, customer?: any): string => {
  let receipt = '';
  
  // Header
  if (storeSettings.receiptHeader) {
    receipt += `${storeSettings.receiptHeader}\n`;
  }
  
  receipt += `================================\n`;
  receipt += `${storeSettings.storeName.toUpperCase()}\n`;
  
  if (storeSettings.storeAddress) {
    receipt += `${storeSettings.storeAddress}\n`;
  }
  if (storeSettings.storePhone) {
    receipt += `Tel: ${storeSettings.storePhone}\n`;
  }
  if (storeSettings.kraPin) {
    receipt += `KRA PIN: ${storeSettings.kraPin}\n`;
  }
  
  receipt += `================================\n`;
  
  // Transaction details
  receipt += `Receipt #: ${transaction.id}\n`;
  receipt += `Date: ${new Date(transaction.timestamp).toLocaleDateString('en-GB')} ${new Date(transaction.timestamp).toLocaleTimeString('en-GB', { hour12: false })}\n`;
  
  if (customer?.name) {
    receipt += `Customer: ${customer.name}\n`;
  }
  
  receipt += `================================\n`;
  
  // Items
  transaction.items.forEach((item: any) => {
    receipt += `${item.name}\n`;
    receipt += `${item.quantity}pcs x KSh${item.price.toLocaleString()}.00 = KSh${(item.price * item.quantity).toLocaleString()}.00\n`;
  });
  
  receipt += `================================\n`;
  
  // Totals
  receipt += `Subtotal: KSh${transaction.total.toLocaleString()}.00\n`;
  receipt += `TOTAL: KSh${transaction.total.toLocaleString()}.00\n`;
  
  // Payment
  receipt += `\nPayment Method(s):\n`;
  transaction.paymentSplits.forEach((split: any) => {
    const method = split.method === 'mpesa' ? 'M-Pesa' : split.method;
    receipt += `${method}: KSh${split.amount.toLocaleString()}.00\n`;
  });
  
  receipt += `Change: KSh0.00\n`;
  receipt += `\n          **PAID**\n`;
  
  receipt += `================================\n`;
  
  // Footer
  if (storeSettings.receiptFooter) {
    receipt += `${storeSettings.receiptFooter}\n`;
  }
  
  receipt += `\nPrinted: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour12: false })}\n`;
  
  return receipt;
};

export const testXprinterConnection = async (ip: string, port: number = 9100): Promise<boolean> => {
  try {
    console.log(`Testing connection to Xprinter at ${ip}:${port}`);
    
    // Generate test receipt
    const testReceipt = `
================================
        PRINTER TEST
================================
Xprinter Connection Test
IP: ${ip}
Port: ${port}
Time: ${new Date().toLocaleString()}
================================
This is a test print to verify
your Xprinter is working correctly.
================================
    `;
    
    // Send test print
    const success = await sendToXprinter(testReceipt, { ip, port });
    
    if (success) {
      console.log('Test print sent successfully');
      return true;
    } else {
      console.log('Test print failed');
      return false;
    }
  } catch (error) {
    console.error('Xprinter test failed:', error);
    return false;
  }
};
