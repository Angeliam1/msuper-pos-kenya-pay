
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Delete, Users } from 'lucide-react';
import { Attendant } from '@/types';

interface StaffLoginProps {
  onLogin: (attendant: Attendant) => void;
  onBack: () => void;
  attendants: Attendant[];
  error?: string;
}

export const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin, onBack, attendants, error }) => {
  const [pin, setPin] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Attendant | null>(null);

  const handleNumberClick = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      if (newPin.length === 4 && selectedStaff) {
        setTimeout(() => {
          if (selectedStaff.pin === newPin) {
            onLogin(selectedStaff);
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleStaffSelect = (attendant: Attendant) => {
    setSelectedStaff(attendant);
    setPin('');
  };

  useEffect(() => {
    if (error) {
      setPin('');
    }
  }, [error]);

  // Filter active attendants with PINs
  const activeStaff = attendants.filter(a => a.isActive && a.pin);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Staff Login
          </CardTitle>
          <p className="text-sm text-gray-600">Select staff member and enter PIN</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedStaff ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-center">Select Staff Member:</p>
              {activeStaff.map((attendant) => (
                <Button
                  key={attendant.id}
                  variant="outline"
                  onClick={() => handleStaffSelect(attendant)}
                  className="w-full h-16 flex flex-col items-center justify-center"
                >
                  <span className="font-medium">{attendant.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{attendant.role}</span>
                </Button>
              ))}
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="font-medium">{selectedStaff.name}</p>
                <p className="text-sm text-gray-500 capitalize">{selectedStaff.role}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStaff(null)}
                  className="mt-2 text-xs"
                >
                  Change Staff
                </Button>
              </div>

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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
