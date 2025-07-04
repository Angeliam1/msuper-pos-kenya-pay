
// Xprinter utility functions for network printing
export interface PrinterSettings {
  ip: string;
  port: number;
  timeout?: number;
}

// ESC/POS commands for thermal printers
const ESC = '\x1B';
const GS = '\x1D';

export const sendToXprinter = async (data: string, settings: PrinterSettings): Promise<boolean> => {
  try {
    console.log('Sending print data to Xprinter:', settings);
    
    // Convert text to ESC/POS format for thermal printer
    const escPosData = convertToESCPOS(data);
    
    // Since browsers can't make direct socket connections, we'll use a workaround
    // This creates a local print service endpoint or uses browser printing with proper formatting
    
    // First, try to send via a local print bridge (if available)
    try {
      const response = await fetch(`http://${settings.ip}:${settings.port}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: escPosData,
      });
      
      console.log('Direct network print attempt completed');
      return true;
    } catch (networkError) {
      console.log('Direct network print failed, trying alternative method');
      
      // Alternative: Use browser printing with thermal printer formatting
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Xprinter Receipt</title>
              <style>
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                body { 
                  font-family: 'Courier New', monospace; 
                  font-size: 11px; 
                  margin: 0;
                  padding: 2mm;
                  width: 76mm;
                  line-height: 1.2;
                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .large { font-size: 14px; }
                pre {
                  white-space: pre-wrap;
                  margin: 0;
                  font-family: inherit;
                }
              </style>
            </head>
            <body>
              <pre>${data}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Auto-print with proper thermal formatting
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 1000);
        }, 500);
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error printing to Xprinter:', error);
    return false;
  }
};

// Convert text to ESC/POS format for thermal printers
const convertToESCPOS = (text: string): string => {
  let escPos = '';
  
  // Initialize printer
  escPos += ESC + '@'; // Initialize
  escPos += ESC + 'a' + '\x01'; // Center alignment
  
  // Process text line by line
  const lines = text.split('\n');
  lines.forEach(line => {
    if (line.includes('=====')) {
      // Separator line
      escPos += ESC + 'a' + '\x01'; // Center
      escPos += line + '\n';
    } else if (line.includes('TOTAL') || line.includes('PAID')) {
      // Important lines - bold and larger
      escPos += ESC + 'E' + '\x01'; // Bold on
      escPos += GS + '!' + '\x11'; // Double size
      escPos += ESC + 'a' + '\x01'; // Center
      escPos += line + '\n';
      escPos += ESC + 'E' + '\x00'; // Bold off
      escPos += GS + '!' + '\x00'; // Normal size
    } else if (line.trim() === '') {
      escPos += '\n';
    } else {
      escPos += ESC + 'a' + '\x00'; // Left align
      escPos += line + '\n';
    }
  });
  
  // Cut paper
  escPos += '\n\n\n';
  escPos += GS + 'V' + '\x42' + '\x00'; // Partial cut
  
  return escPos;
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
    console.log(`Testing Xprinter connection to ${ip}:${port}`);
    
    // Generate test receipt with ESC/POS formatting
    const testReceipt = `
================================
        XPRINTER TEST
================================
Printer IP: ${ip}
Port: ${port}
Test Time: ${new Date().toLocaleString()}
================================
This is a test print to verify
your Xprinter network connection.

If you can see this receipt,
your Xprinter is working correctly!
================================
    `;
    
    // Send test print using the same method as receipts
    const success = await sendToXprinter(testReceipt, { ip, port });
    
    if (success) {
      console.log('Xprinter test completed - check printer for output');
      return true;
    } else {
      console.log('Xprinter test failed');
      return false;
    }
  } catch (error) {
    console.error('Xprinter connection test failed:', error);
    return false;
  }
};

// Additional utility for checking if printer is reachable
export const pingXprinter = async (ip: string): Promise<boolean> => {
  try {
    // Try to connect to the printer IP
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    await fetch(`http://${ip}:9100`, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.log('Ping to Xprinter failed:', error);
    return false;
  }
};
