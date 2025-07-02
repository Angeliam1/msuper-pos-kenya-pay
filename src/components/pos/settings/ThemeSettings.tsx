
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon } from 'lucide-react';

interface ThemeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Light theme with blue accents' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme with blue accents' },
  ];

  const applyTheme = (themeId: string) => {
    // Remove existing theme classes
    document.body.classList.remove('dark');
    
    // Apply new theme
    if (themeId === 'dark') {
      document.body.classList.add('dark');
    }

    // Apply font size
    const root = document.documentElement;
    switch (settings.fontSize || 'medium') {
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
  };

  const handleThemeChange = (themeId: string) => {
    onSettingChange('theme', themeId);
    applyTheme(themeId);
  };

  const handleFontSizeChange = (size: string) => {
    onSettingChange('fontSize', size);
    applyTheme(settings.theme || 'light');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <Button
                    key={theme.id}
                    variant={settings.theme === theme.id ? 'default' : 'outline'}
                    onClick={() => handleThemeChange(theme.id)}
                    className="h-20 flex-col"
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{theme.name}</span>
                    <span className="text-xs text-muted-foreground">{theme.description}</span>
                  </Button>
                );
              })}
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
        </CardContent>
      </Card>
    </div>
  );
};
