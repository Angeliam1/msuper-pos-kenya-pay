
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette, Monitor, Sun, Moon } from 'lucide-react';

interface ThemeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  const themes = [
    { id: 'light', name: 'Light', icon: Sun, colors: ['#ffffff', '#f8fafc', '#3b82f6'] },
    { id: 'dark', name: 'Dark', icon: Moon, colors: ['#1f2937', '#111827', '#60a5fa'] },
    { id: 'blue', name: 'Blue', icon: Monitor, colors: ['#dbeafe', '#3b82f6', '#1e40af'] },
    { id: 'green', name: 'Green', icon: Monitor, colors: ['#dcfce7', '#22c55e', '#15803d'] },
    { id: 'purple', name: 'Purple', icon: Monitor, colors: ['#f3e8ff', '#a855f7', '#7c3aed'] },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme" className="text-sm">Select Theme</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <Button
                    key={theme.id}
                    variant={settings.theme === theme.id ? 'default' : 'outline'}
                    onClick={() => onSettingChange('theme', theme.id)}
                    className="h-20 flex-col relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{theme.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="accentColor" className="text-sm">Accent Color</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                <Button
                  key={color}
                  variant={settings.accentColor === color ? 'default' : 'outline'}
                  onClick={() => onSettingChange('accentColor', color)}
                  className="h-12 p-0"
                  style={{ backgroundColor: settings.accentColor === color ? color : undefined }}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="fontSize" className="text-sm">Font Size</Label>
            <Select
              value={settings.fontSize || 'medium'}
              onValueChange={(value) => onSettingChange('fontSize', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="compactMode" className="text-sm">Layout Style</Label>
            <Select
              value={settings.compactMode || 'normal'}
              onValueChange={(value) => onSettingChange('compactMode', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
