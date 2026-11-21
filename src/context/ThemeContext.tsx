import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeMode, CustomVariant, ThemePalette } from '../types';

export const getThemePalette = (mode: ThemeMode, custom: CustomVariant): ThemePalette => {
  if (mode === 'dark') {
    return {
      primary: '#10B981',
      primaryHover: '#059669',
      accent: '#34D399',
      origin: '#10B981',
      kpoh: '#059669',
      shikur: '#34D399',
      tehkur: '#6EE7B7',
      distant: '#047857',
      canvasBg: '#090e0c',
      canvasRadial: 'from-[#13221b] via-[#0d1612] to-[#090e0c]',
      canvasTextColor: '#f1f5f9',
      canvasTextHalo: '#090e0c',
      ringColors: [
        'rgba(16, 185, 129, 0.22)',
        'rgba(52, 211, 153, 0.18)',
        'rgba(110, 231, 183, 0.14)',
        'rgba(5, 150, 105, 0.10)'
      ],
      linkKpoh: 'rgba(5, 150, 105, 0.75)',
      linkShikur: 'rgba(52, 211, 153, 0.65)',
      linkTehkur: 'rgba(110, 231, 183, 0.50)',
      linkDistant: 'rgba(16, 185, 129, 0.35)'
    };
  }

  if (mode === 'custom') {
    if (custom === 'heritage') {
      return {
        primary: '#C85A32',
        primaryHover: '#A94420',
        accent: '#DE7347',
        origin: '#C85A32',
        kpoh: '#8C3518',
        shikur: '#DE7347',
        tehkur: '#F0A17D',
        distant: '#5A200E',
        canvasBg: '#FBF7F3',
        canvasRadial: 'from-[#f7ede2] via-[#fbf7f3] to-[#fbf7f3]',
        canvasTextColor: '#271a17',
        canvasTextHalo: '#FBF7F3',
        ringColors: [
          'rgba(200, 90, 50, 0.22)',
          'rgba(222, 115, 71, 0.18)',
          'rgba(240, 161, 125, 0.14)',
          'rgba(90, 32, 14, 0.08)'
        ],
        linkKpoh: 'rgba(140, 53, 24, 0.70)',
        linkShikur: 'rgba(200, 90, 50, 0.60)',
        linkTehkur: 'rgba(222, 115, 71, 0.50)',
        linkDistant: 'rgba(90, 32, 14, 0.30)'
      };
    }
    if (custom === 'forest') {
      return {
        primary: '#1C5434',
        primaryHover: '#133A24',
        accent: '#2A7A4C',
        origin: '#1C5434',
        kpoh: '#0D2B1A',
        shikur: '#2A7A4C',
        tehkur: '#52A676',
        distant: '#06170D',
        canvasBg: '#F3F9F5',
        canvasRadial: 'from-[#e4f3ea] via-[#f3f9f5] to-[#f3f9f5]',
        canvasTextColor: '#122419',
        canvasTextHalo: '#F3F9F5',
        ringColors: [
          'rgba(28, 84, 52, 0.24)',
          'rgba(42, 122, 76, 0.20)',
          'rgba(82, 166, 118, 0.15)',
          'rgba(13, 43, 26, 0.09)'
        ],
        linkKpoh: 'rgba(13, 43, 26, 0.75)',
        linkShikur: 'rgba(28, 84, 52, 0.60)',
        linkTehkur: 'rgba(82, 166, 118, 0.50)',
        linkDistant: 'rgba(6, 23, 13, 0.30)'
      };
    }
    if (custom === 'dawki') {
      return {
        primary: '#008080',
        primaryHover: '#006666',
        accent: '#17A2B8',
        origin: '#008080',
        kpoh: '#004D4D',
        shikur: '#17A2B8',
        tehkur: '#5DD3E0',
        distant: '#002828',
        canvasBg: '#F1F8FA',
        canvasRadial: 'from-[#ddf1f7] via-[#f1f8fa] to-[#f1f8fa]',
        canvasTextColor: '#0f2330',
        canvasTextHalo: '#F1F8FA',
        ringColors: [
          'rgba(0, 128, 128, 0.24)',
          'rgba(23, 162, 184, 0.20)',
          'rgba(93, 211, 224, 0.15)',
          'rgba(0, 40, 40, 0.09)'
        ],
        linkKpoh: 'rgba(0, 77, 77, 0.75)',
        linkShikur: 'rgba(0, 128, 128, 0.60)',
        linkTehkur: 'rgba(23, 162, 184, 0.50)',
        linkDistant: 'rgba(0, 40, 40, 0.30)'
      };
    }
  }

  // Light / Default Monochromatic Sea Green Theme (#2E8B57)
  return {
    primary: '#2E8B57',
    primaryHover: '#246e45',
    accent: '#40BF77',
    origin: '#2E8B57',
    kpoh: '#1C5434',
    shikur: '#40BF77',
    tehkur: '#75D19D',
    distant: '#0A1F13',
    canvasBg: '#ffffff',
    canvasRadial: 'from-slate-50 via-white to-white',
    canvasTextColor: '#1e293b',
    canvasTextHalo: '#ffffff',
    ringColors: [
      'rgba(46, 139, 87, 0.16)',
      'rgba(64, 191, 119, 0.14)',
      'rgba(117, 209, 157, 0.12)',
      'rgba(10, 31, 19, 0.08)'
    ],
    linkKpoh: 'rgba(28, 84, 52, 0.45)',
    linkShikur: 'rgba(64, 191, 119, 0.40)',
    linkTehkur: 'rgba(117, 209, 157, 0.45)',
    linkDistant: 'rgba(10, 31, 19, 0.25)'
  };
};

interface ThemeContextType {
  themeMode: ThemeMode;
  customVariant: CustomVariant;
  setThemeMode: (mode: ThemeMode) => void;
  setCustomVariant: (variant: CustomVariant) => void;
  resolvedTheme: 'light' | 'dark';
  palette: ThemePalette;
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

  const palette = useMemo(() => {
    return getThemePalette(themeMode, customVariant);
  }, [themeMode, customVariant]);

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
        palette,
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
