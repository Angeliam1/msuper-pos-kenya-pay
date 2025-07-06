
import { StoreLocation, ReceiptSettings } from './index';

export interface StoreLocationExtended extends StoreLocation {
  receiptSettings?: ReceiptSettings;
  ownerEmail?: string;
  currency?: string;
}
