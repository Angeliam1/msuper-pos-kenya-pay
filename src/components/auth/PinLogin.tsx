
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Delete } from 'lucide-react';

interface PinLoginProps {
  onLogin: (pin: string) => void;
  onBack: () => void;
  storeName: string;
  error?: string;
}

export const PinLogin: React.FC<PinLoginProps> = ({ onLogin, onBack, storeName, error }) => {
  const [pin, setPin] = useState('');

  const handleNumberClick = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => onLogin(newPin), 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  useEffect(() => {
    if (error) {
      setPin('');
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl">{storeName}</CardTitle>
          <p className="text-sm text-gray-600">Enter your 4-digit PIN</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center space-x-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 ${
                  index < pin.length ? 'bg-primary border-primary' : 'border-gray-300'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick(number.toString())}
                className="h-12 text-lg font-semibold"
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              onClick={handleClear}
              className="h-12 text-sm"
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNumberClick('0')}
              className="h-12 text-lg font-semibold"
            >
              0
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDelete}
              className="h-12"
            >
              <Delete className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
