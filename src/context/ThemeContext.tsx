import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, CustomVariant } from '../types';

interface ThemeContextType {
  themeMode: ThemeMode;
  customVariant: CustomVariant;
  setThemeMode: (mode: ThemeMode) => void;
  setCustomVariant: (variant: CustomVariant) => void;
  resolvedTheme: 'light' | 'dark';
  // Aliases for convenience
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('tipkur-theme-mode') as ThemeMode) || 'light';
  });

  const [customVariant, setCustomVariantState] = useState<CustomVariant>(() => {
    return (localStorage.getItem('tipkur-theme-custom') as CustomVariant) || 'heritage';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('tipkur-theme-mode', mode);
  };

  const setCustomVariant = (variant: CustomVariant) => {
    setCustomVariantState(variant);
    localStorage.setItem('tipkur-theme-custom', variant);
  };

  const resolvedTheme: 'light' | 'dark' = themeMode === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const root = document.documentElement;
    
    // Clean old theme classes / data attributes
    root.classList.remove('dark', 'theme-light', 'theme-dark', 'theme-heritage', 'theme-forest', 'theme-dawki');
    
    if (themeMode === 'dark') {
      root.classList.add('dark', 'theme-dark');
      root.setAttribute('data-theme', 'dark');
    } else if (themeMode === 'custom') {
      root.classList.add(`theme-${customVariant}`);
      root.setAttribute('data-theme', `custom-${customVariant}`);
    } else {
      root.classList.add('theme-light');
      root.setAttribute('data-theme', 'light');
    }

    // Modern Web Guidance: sync <meta name="color-scheme">
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', resolvedTheme);
    }
  }, [themeMode, customVariant, resolvedTheme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        themeMode, 
        customVariant, 
        setThemeMode, 
        setCustomVariant, 
        resolvedTheme,
        theme: themeMode,
        setTheme: setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
