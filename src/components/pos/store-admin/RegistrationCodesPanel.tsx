
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Copy } from 'lucide-react';

interface RegistrationCodesPanelProps {
  registrationCodes: Record<string, string>;
  stores: any[];
  onCopyToClipboard: (code: string) => void;
}

export const RegistrationCodesPanel: React.FC<RegistrationCodesPanelProps> = ({
  registrationCodes,
  stores,
  onCopyToClipboard
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(registrationCodes).map(([storeId, code]) => {
            const store = stores.find(s => s.id === storeId);
            return (
              <Alert key={storeId}>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{store?.name}</strong> - Registration Code: <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyToClipboard(code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
