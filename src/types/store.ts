
export interface ReceiptSettings {
  size: '58mm' | '80mm' | 'A4';
  showLogo: boolean;
  showAddress: boolean;
  showPhone: boolean;
  header: string;
  footer: string;
  autoprint?: boolean;
  copies?: number;
}

export interface StoreLocationExtended extends StoreLocation {
  receiptSettings?: ReceiptSettings;
}
