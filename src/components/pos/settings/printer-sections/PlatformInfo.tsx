
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Globe, Smartphone } from 'lucide-react';

interface PlatformInfoProps {
  isNative: boolean;
  printingInstructions: string[];
}

export const PlatformInfo: React.FC<PlatformInfoProps> = ({
  isNative,
  printingInstructions
}) => {
  return (
    <Alert>
      <div className="flex items-center gap-2">
        {isNative ? <Smartphone className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
        <Info className="h-4 w-4" />
      </div>
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">
            {isNative ? "🔧 Mobile App Mode - Full Printer Support" : "🌐 Web Browser Mode - Limited Printer Support"}
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {printingInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};
