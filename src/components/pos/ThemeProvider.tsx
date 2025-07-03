
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'blue' | 'green' | 'orange' | 'purple';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [color, setColor] = useState<ThemeColor>('blue');

  useEffect(() => {
    // Load theme from localStorage
    const savedMode = localStorage.getItem('pos-theme-mode') as ThemeMode;
    const savedColor = localStorage.getItem('pos-theme-color') as ThemeColor;
    
    if (savedMode) setMode(savedMode);
    if (savedColor) setColor(savedColor);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'theme-blue', 'theme-green', 'theme-orange', 'theme-purple');
    
    // Apply new theme classes
    root.classList.add(mode, `theme-${color}`);
    
    // Save to localStorage
    localStorage.setItem('pos-theme-mode', mode);
    localStorage.setItem('pos-theme-color', color);
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
