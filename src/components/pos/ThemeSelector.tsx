
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme, ThemeMode, ThemeColor } from './ThemeProvider';

export const ThemeSelector: React.FC = () => {
  const { mode, color, setMode, setColor } = useTheme();

  const colorOptions: { value: ThemeColor; name: string; class: string }[] = [
    { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { value: 'green', name: 'Green', class: 'bg-green-500' },
    { value: 'orange', name: 'Orange', class: 'bg-orange-500' },
    { value: 'purple', name: 'Purple', class: 'bg-purple-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Appearance</h4>
          <div className="flex gap-2">
            <Button
              variant={mode === 'light' ? 'default' : 'outline'}
              onClick={() => setMode('light')}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'default' : 'outline'}
              onClick={() => setMode('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Color Theme</h4>
          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((option) => (
              <Button
                key={option.value}
                variant={color === option.value ? 'default' : 'outline'}
                onClick={() => setColor(option.value)}
                className="flex items-center gap-2 justify-start"
              >
                <div className={`w-4 h-4 rounded-full ${option.class}`} />
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
