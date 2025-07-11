
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Smartphone, MessageSquare } from 'lucide-react';

interface SMSSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  onTestSMS: () => void;
}

export const SMSSettings: React.FC<SMSSettingsProps> = ({
  settings,
  onSettingChange,
  onTestSMS
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="smsEnabled" className="text-sm">Enable SMS Notifications</Label>
            <Switch
              id="smsEnabled"
              checked={settings.smsEnabled || false}
              onCheckedChange={(checked) => onSettingChange('smsEnabled', checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="smsProvider" className="text-sm">SMS Provider</Label>
            <Select
              value={settings.smsProvider || 'phone'}
              onValueChange={(value) => onSettingChange('smsProvider', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">My Phone Number</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                <SelectItem value="api">SMS API Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessPhone" className="text-sm">Business Phone Number</Label>
            <Input
              id="businessPhone"
              value={settings.businessPhone || ''}
              onChange={(e) => onSettingChange('businessPhone', e.target.value)}
              placeholder="0725333337"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="businessName" className="text-sm">Business Name for SMS</Label>
            <Input
              id="businessName"
              value={settings.businessName || ''}
              onChange={(e) => onSettingChange('businessName', e.target.value)}
              placeholder="Your Business Name"
              className="mt-1"
            />
          </div>

          <Button onClick={onTestSMS} variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Test SMS Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">SMS Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hirePurchaseTemplate" className="text-sm">Hire Purchase SMS Template</Label>
            <Textarea
              id="hirePurchaseTemplate"
              value={settings.hirePurchaseTemplate || 'Hi {customerName}, you have purchased {items} for KES {total}. Paid: KES {paid}, Balance: KES {balance}. Payment Link: {paymentLink} - {businessName}'}
              onChange={(e) => onSettingChange('hirePurchaseTemplate', e.target.value)}
              placeholder="Hi {customerName}, you have purchased..."
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {'{customerName}'}, {'{items}'}, {'{total}'}, {'{paid}'}, {'{balance}'}, {'{paymentLink}'}, {'{businessName}'}, {'{transactionId}'}
            </p>
          </div>

          <div>
            <Label htmlFor="paymentReminderTemplate" className="text-sm">Payment Reminder Template</Label>
            <Textarea
              id="paymentReminderTemplate"
              value={settings.paymentReminderTemplate || 'Hi {customerName}, your payment of KES {amount} is pending at {businessName} ({businessPhone}) and is {daysLate} days late. Pay now: {paymentLink}'}
              onChange={(e) => onSettingChange('paymentReminderTemplate', e.target.value)}
              placeholder="Hi {customerName}, your payment..."
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {'{customerName}'}, {'{amount}'}, {'{businessName}'}, {'{businessPhone}'}, {'{daysLate}'}, {'{paymentLink}'}
            </p>
          </div>

          <div>
            <Label htmlFor="paymentConfirmTemplate" className="text-sm">Payment Confirmation Template</Label>
            <Textarea
              id="paymentConfirmTemplate"
              value={settings.paymentConfirmTemplate || 'Hi {customerName}, payment received! Amount: KES {amount}. New balance: KES {balance}. Thank you! - {businessName}'}
              onChange={(e) => onSettingChange('paymentConfirmTemplate', e.target.value)}
              placeholder="Hi {customerName}, payment received..."
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {'{customerName}'}, {'{amount}'}, {'{balance}'}, {'{businessName}'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
