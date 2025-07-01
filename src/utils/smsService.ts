
interface SMSMessage {
  customerName: string;
  customerPhone: string;
  businessName: string;
  businessPhone: string;
  items: string;
  total: number;
  paid: number;
  balance: number;
}

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
    .replace(/{businessPhone}/g, message.businessPhone);

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
