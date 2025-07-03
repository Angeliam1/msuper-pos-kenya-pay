
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const phoneNumber = '+254725333337';
  const defaultMessage = 'Hi! I need help with your online store.';

  const openWhatsApp = (customMessage?: string) => {
    const finalMessage = customMessage || message || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
  };

  const quickMessages = [
    'I need help with product information',
    'What are your delivery options?',
    'Can I get a discount on bulk orders?',
    'I have a question about my order',
    'Do you have this product in stock?'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {!isOpen && (
          <Badge 
            className="absolute -top-2 -left-2 bg-red-500 text-white animate-pulse"
          >
            Help
          </Badge>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 max-w-[90vw] z-50 shadow-xl">
          <div className="bg-green-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Digital Den Support</h3>
                <p className="text-sm opacity-90">Usually replies instantly</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm">
                👋 Hello! How can we help you today?
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick questions:</p>
              {quickMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs"
                  onClick={() => openWhatsApp(msg)}
                >
                  {msg}
                </Button>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && openWhatsApp()}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button
                  onClick={() => openWhatsApp()}
                  className="bg-green-500 hover:bg-green-600"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Powered by WhatsApp
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
