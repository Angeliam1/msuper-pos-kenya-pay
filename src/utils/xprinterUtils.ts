
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
    console.log('Attempting to send print data to Xprinter:', settings);
    
    // Convert text to ESC/POS format for thermal printer
    const escPosData = convertToESCPOS(data);
    
    // Try direct network connection (will likely fail in browser due to CORS)
    try {
      const response = await fetch(`http://${settings.ip}:${settings.port}/print`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: escPosData,
      });
      
      console.log('Direct network print request sent (status unknown due to no-cors mode)');
      
      // Since we can't check response status in no-cors mode, wait a bit and assume success
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
      
    } catch (networkError) {
      console.log('Direct network print failed (expected in browser):', networkError);
      
      // Browser fallback: Use window.print with thermal formatting
      console.log('Falling back to browser print with thermal formatting');
      
      const printWindow = window.open('', '_blank', 'width=300,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Xprinter Receipt</title>
              <style>
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                @media print {
                  body { 
                    font-family: 'Courier New', monospace; 
                    font-size: 10px; 
                    margin: 0;
                    padding: 2mm;
                    width: 76mm;
                    line-height: 1.1;
                    color: black;
                  }
                  .center { text-align: center; }
                  .bold { font-weight: bold; }
                  .large { font-size: 12px; }
                  pre {
                    white-space: pre-wrap;
                    margin: 0;
                    font-family: inherit;
                    font-size: inherit;
                  }
                }
                body { 
                  font-family: 'Courier New', monospace; 
                  font-size: 11px; 
                  margin: 0;
                  padding: 4mm;
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
                .print-instructions {
                  background: #f0f0f0;
                  padding: 10px;
                  margin: 10px 0;
                  border-radius: 5px;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="print-instructions">
                <strong>📋 Print Instructions:</strong><br>
                1. Set your browser's default printer to "${settings.ip}" or "Xprinter"<br>
                2. In print dialog, select "More settings"<br>
                3. Set paper size to "Custom" or "80mm"<br>
                4. Set margins to "Minimum" or "None"<br>
                5. Click Print
              </div>
              <hr>
              <pre>${data}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Auto-print after a delay
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => printWindow.close(), 2000);
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
    
    // Generate test receipt
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
your printer connection is working!

Note: Direct network printing from
browsers has limitations due to
security restrictions.
================================
    `;
    
    // Send test print
    const success = await sendToXprinter(testReceipt, { ip, port });
    return success;
  } catch (error) {
    console.error('Xprinter connection test failed:', error);
    return false;
  }
};

// Check if printer IP is reachable (will likely fail in browser)
export const pingXprinter = async (ip: string): Promise<boolean> => {
  try {
    console.log(`Attempting to ping Xprinter at ${ip}`);
    
    // This will likely fail in browser due to CORS, but we try anyway
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`http://${ip}:9100`, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Ping successful (or blocked by CORS)');
    return true;
  } catch (error) {
    console.log('Ping failed (expected in browser):', error);
    return false;
  }
};

// Check if we're running in a mobile app (Capacitor) vs browser
export const isNativeApp = (): boolean => {
  return !!(window as any).Capacitor;
};

// Get platform-specific printing instructions
export const getPrintingInstructions = (): string[] => {
  if (isNativeApp()) {
    return [
      "🔧 For mobile app printing:",
      "• Install a native printer plugin",
      "• Direct network printing is supported",
      "• No browser limitations apply"
    ];
  } else {
    return [
      "🌐 For web browser printing:",
      "• Use browser's print dialog (Ctrl+P)",
      "• Set default printer to your Xprinter",
      "• Or use 'Print to PDF' and send to printer",
      "• Direct network printing is limited by browser security"
    ];
  }
};
