
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

  const handleThemeChange = (themeId: string) => {
    onSettingChange('theme', themeId);
    applyThemeImmediately(themeId, settings.accentColor, settings.fontSize, settings.compactMode);
  };

  const handleAccentChange = (color: string) => {
    onSettingChange('accentColor', color);
    applyThemeImmediately(settings.theme, color, settings.fontSize, settings.compactMode);
  };

  const handleFontSizeChange = (size: string) => {
    onSettingChange('fontSize', size);
    applyThemeImmediately(settings.theme, settings.accentColor, size, settings.compactMode);
  };

  const handleCompactModeChange = (mode: string) => {
    onSettingChange('compactMode', mode);
    applyThemeImmediately(settings.theme, settings.accentColor, settings.fontSize, mode);
  };

  const applyThemeImmediately = (theme: string, accentColor: string, fontSize: string, compactMode: string) => {
    const root = document.documentElement;
    
    // Apply theme colors
    switch (theme) {
      case 'dark':
        document.body.className = 'dark';
        root.style.setProperty('--background', '18 18 23');
        root.style.setProperty('--foreground', '250 250 250');
        break;
      case 'blue':
        document.body.className = '';
        root.style.setProperty('--background', '219 234 254');
        root.style.setProperty('--primary', '59 130 246');
        break;
      case 'green':
        document.body.className = '';
        root.style.setProperty('--background', '220 252 231');
        root.style.setProperty('--primary', '34 197 94');
        break;
      case 'purple':
        document.body.className = '';
        root.style.setProperty('--background', '243 232 255');
        root.style.setProperty('--primary', '168 85 247');
        break;
      default: // light
        document.body.className = '';
        root.style.setProperty('--background', '255 255 255');
        root.style.setProperty('--foreground', '9 9 11');
        break;
    }

    // Apply accent color
    if (accentColor) {
      const hex = accentColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      root.style.setProperty('--primary', `${r} ${g} ${b}`);
    }

    // Apply font size
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }

    // Apply compact mode
    switch (compactMode) {
      case 'compact':
        root.style.setProperty('--spacing', '0.5rem');
        break;
      case 'spacious':
        root.style.setProperty('--spacing', '2rem');
        break;
      default:
        root.style.setProperty('--spacing', '1rem');
        break;
    }
  };

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
                    onClick={() => handleThemeChange(theme.id)}
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
                  onClick={() => handleAccentChange(color)}
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
              onValueChange={handleFontSizeChange}
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
              onValueChange={handleCompactModeChange}
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
