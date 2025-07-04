
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PrinterStatusProps {
  connectionStatus: 'idle' | 'testing' | 'connected' | 'failed';
  testingStep: string;
  isNative: boolean;
}

export const PrinterStatus: React.FC<PrinterStatusProps> = ({ 
  connectionStatus, 
  testingStep, 
  isNative 
}) => {
  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h4 className="font-medium flex items-center gap-2">
        Printer Status
      </h4>
      <div className="flex items-center gap-2">
        {getConnectionStatusIcon()}
        {testingStep && (
          <div className="text-xs text-gray-600 p-2 bg-yellow-50 rounded">
            🔄 {testingStep}
          </div>
        )}
        {connectionStatus === 'connected' && (
          <Badge variant="default" className="bg-green-600">
            ✅ {isNative ? 'Test Print Sent' : 'Print Dialog Opened'}
          </Badge>
        )}
      </div>
    </div>
  );
};
