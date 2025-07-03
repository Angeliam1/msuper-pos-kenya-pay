
interface SMSMessage {
  customerName: string;
  customerPhone: string;
  businessName: string;
  businessPhone: string;
  items: string;
  total: number;
  paid: number;
  balance: number;
  paymentLink?: string;
  transactionId?: string;
}

interface PaymentSettings {
  mpesaPaybill?: string;
  mpesaAccount?: string;
  mpesaTill?: string;
  bankAccount?: string;
  paymentInstructions?: string;
}

export const generatePaymentLink = (
  customerId: string, 
  amount: number, 
  transactionId: string,
  paymentSettings: PaymentSettings
): string => {
  // Generate a payment link with payment options
  const paymentOptions = [];
  
  if (paymentSettings.mpesaPaybill && paymentSettings.mpesaAccount) {
    paymentOptions.push(`M-Pesa Paybill: ${paymentSettings.mpesaPaybill} Account: ${paymentSettings.mpesaAccount}`);
  }
  
  if (paymentSettings.mpesaTill) {
    paymentOptions.push(`M-Pesa Till: ${paymentSettings.mpesaTill}`);
  }
  
  if (paymentSettings.bankAccount) {
    paymentOptions.push(`Bank: ${paymentSettings.bankAccount}`);
  }
  
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/payment?customer=${customerId}&amount=${amount}&transaction=${transactionId}`;
  
  return `${paymentUrl}\n\nPayment Options:\n${paymentOptions.join('\n')}`;
};

export const sendHirePurchaseSMS = async (
  message: SMSMessage,
  template: string,
  provider: 'phone' | 'whatsapp' | 'api'
) => {
  // Replace template variables
  const formattedMessage = template
    .replace(/{customerName}/g, message.customerName)
    .replace(/{items}/g, message.items)
    .replace(/{total}/g, message.total.toLocaleString())
    .replace(/{paid}/g, message.paid.toLocaleString())
    .replace(/{balance}/g, message.balance.toLocaleString())
    .replace(/{businessName}/g, message.businessName)
    .replace(/{businessPhone}/g, message.businessPhone)
    .replace(/{paymentLink}/g, message.paymentLink || '')
    .replace(/{transactionId}/g, message.transactionId || '');

  console.log('Sending SMS:', {
    provider,
    to: message.customerPhone,
    message: formattedMessage
  });

  try {
    switch (provider) {
      case 'whatsapp':
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${message.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(formattedMessage)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'phone':
        // Open default SMS app with pre-filled message
        const smsUrl = `sms:${message.customerPhone}?body=${encodeURIComponent(formattedMessage)}`;
        window.location.href = smsUrl;
        break;
      case 'api':
        // Here you would integrate with an SMS API service
        console.log('SMS API integration not configured');
        // For now, fall back to opening SMS app
        const fallbackSmsUrl = `sms:${message.customerPhone}?body=${encodeURIComponent(formattedMessage)}`;
        window.location.href = fallbackSmsUrl;
        break;
    }
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

export const sendPaymentConfirmationSMS = async (
  customerName: string,
  customerPhone: string,
  amountPaid: number,
  newBalance: number,
  businessName: string,
  template: string,
  provider: 'phone' | 'whatsapp' | 'api'
) => {
  const formattedMessage = template
    .replace(/{customerName}/g, customerName)
    .replace(/{amount}/g, amountPaid.toLocaleString())
    .replace(/{balance}/g, newBalance.toLocaleString())
    .replace(/{businessName}/g, businessName);

  console.log('Sending payment confirmation SMS:', {
    provider,
    to: customerPhone,
    message: formattedMessage
  });

  try {
    switch (provider) {
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(formattedMessage)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'phone':
        const smsUrl = `sms:${customerPhone}?body=${encodeURIComponent(formattedMessage)}`;
        window.location.href = smsUrl;
        break;
      case 'api':
        console.log('SMS API integration not configured');
        const fallbackSmsUrl = `sms:${customerPhone}?body=${encodeURIComponent(formattedMessage)}`;
        window.location.href = fallbackSmsUrl;
        break;
    }
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation SMS:', error);
    return false;
  }
};
