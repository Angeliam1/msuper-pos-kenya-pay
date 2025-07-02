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
    { id: 'light', name: 'Light', icon: Sun, colors: ['#ffffff', '#f8fafc', '#000000'] },
    { id: 'dark', name: 'Dark', icon: Moon, colors: ['#000000', '#1f2937', '#ffffff'] },
    { id: 'blue', name: 'Blue', icon: Monitor, colors: ['#ffffff', '#3b82f6', '#000000'] },
    { id: 'green', name: 'Green', icon: Monitor, colors: ['#ffffff', '#22c55e', '#000000'] },
    { id: 'orange', name: 'Orange', icon: Monitor, colors: ['#ffffff', '#f97316', '#000000'] },
    { id: 'purple', name: 'Purple', icon: Monitor, colors: ['#ffffff', '#a855f7', '#000000'] },
  ];

  const applyThemeImmediately = (theme: string, accentColor: string, fontSize: string, compactMode: string) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    document.body.classList.remove('dark', 'theme-blue', 'theme-green', 'theme-orange', 'theme-purple');
    
    // Set base colors - always use white background with black text for readability
    root.style.setProperty('--background', '255 255 255'); // Pure white
    root.style.setProperty('--foreground', '0 0 0'); // Pure black
    root.style.setProperty('--card', '255 255 255'); // White cards
    root.style.setProperty('--card-foreground', '0 0 0'); // Black text
    root.style.setProperty('--popover', '255 255 255'); // White popover
    root.style.setProperty('--popover-foreground', '0 0 0'); // Black text
    root.style.setProperty('--secondary', '249 250 251'); // Very light gray
    root.style.setProperty('--secondary-foreground', '0 0 0'); // Black text
    root.style.setProperty('--muted', '249 250 251'); // Very light gray
    root.style.setProperty('--muted-foreground', '107 114 128'); // Gray text
    root.style.setProperty('--accent', '249 250 251'); // Light gray accent
    root.style.setProperty('--accent-foreground', '0 0 0'); // Black text
    root.style.setProperty('--destructive', '239 68 68'); // Red for destructive
    root.style.setProperty('--destructive-foreground', '255 255 255'); // White text on red
    root.style.setProperty('--border', '229 231 235'); // Light gray border
    root.style.setProperty('--input', '255 255 255'); // White input
    
    // Apply theme-specific adjustments
    switch (theme) {
      case 'dark':
        document.body.classList.add('dark');
        root.style.setProperty('--background', '0 0 0'); // Pure black
        root.style.setProperty('--foreground', '255 255 255'); // Pure white
        root.style.setProperty('--card', '24 24 27'); // Dark gray
        root.style.setProperty('--card-foreground', '255 255 255'); // White text
        root.style.setProperty('--popover', '24 24 27');
        root.style.setProperty('--popover-foreground', '255 255 255');
        root.style.setProperty('--secondary', '39 39 42');
        root.style.setProperty('--secondary-foreground', '255 255 255');
        root.style.setProperty('--muted', '39 39 42');
        root.style.setProperty('--muted-foreground', '161 161 170');
        root.style.setProperty('--accent', '39 39 42');
        root.style.setProperty('--accent-foreground', '255 255 255');
        root.style.setProperty('--border', '39 39 42');
        root.style.setProperty('--input', '39 39 42');
        root.style.setProperty('--primary', '255 255 255'); // White primary in dark mode
        root.style.setProperty('--primary-foreground', '0 0 0'); // Black text on white
        root.style.setProperty('--ring', '255 255 255');
        break;
      case 'orange':
        root.style.setProperty('--primary', '249 115 22'); // Orange primary
        root.style.setProperty('--primary-foreground', '255 255 255'); // White text on orange
        root.style.setProperty('--ring', '249 115 22');
        break;
      default:
        // Light theme or other colored themes use black primary by default
        root.style.setProperty('--primary', '0 0 0'); // Black primary
        root.style.setProperty('--primary-foreground', '255 255 255'); // White text on black
        root.style.setProperty('--ring', '0 0 0');
        break;
    }

    // Apply accent color override - this is the key customization
    if (accentColor && accentColor !== '#3b82f6') {
      try {
        const hex = accentColor.replace('#', '');
        if (hex.length === 6) {
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          
          // Set the accent color as the primary color
          root.style.setProperty('--primary', `${r} ${g} ${b}`);
          root.style.setProperty('--ring', `${r} ${g} ${b}`);
          
          // Determine text color based on brightness
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          root.style.setProperty('--primary-foreground', brightness > 128 ? '0 0 0' : '255 255 255');
        }
      } catch (error) {
        console.warn('Invalid accent color:', accentColor);
      }
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

  const handleThemeChange = (themeId: string) => {
    onSettingChange('theme', themeId);
    applyThemeImmediately(themeId, settings.accentColor || '#3b82f6', settings.fontSize || 'medium', settings.compactMode || 'normal');
  };

  const handleAccentChange = (color: string) => {
    onSettingChange('accentColor', color);
    applyThemeImmediately(settings.theme || 'light', color, settings.fontSize || 'medium', settings.compactMode || 'normal');
  };

  const handleFontSizeChange = (size: string) => {
    onSettingChange('fontSize', size);
    applyThemeImmediately(settings.theme || 'light', settings.accentColor || '#3b82f6', size, settings.compactMode || 'normal');
  };

  const handleCompactModeChange = (mode: string) => {
    onSettingChange('compactMode', mode);
    applyThemeImmediately(settings.theme || 'light', settings.accentColor || '#3b82f6', settings.fontSize || 'medium', mode);
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
            <Label htmlFor="accentColor" className="text-sm">Accent Color (Overrides theme colors)</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#f97316', '#8b5cf6', '#ec4899'].map((color) => (
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
            <p className="text-xs text-gray-500 mt-1">
              Select an accent color to customize buttons, cart, and highlights
            </p>
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
