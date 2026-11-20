import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useClan } from '../context/ClanContext';
import { DevSettingsDrawer } from './settings/DevSettingsDrawer';
import { 
  Network, 
  HeartHandshake, 
  Languages, 
  Sun, 
  Moon, 
  Settings2, 
  Sparkles,
  Server
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'explorer' | 'checker';
  onTabChange: (tab: 'explorer' | 'checker') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isMockMode, isLiveApiReachable } = useClan();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-sand-50/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-sand-200/80 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-tight text-sand-900 dark:text-stone-50">
                  Tipkur Tipkha
                </span>
                {/* Status Indicator */}
                <span 
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isMockMode
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                      : isLiveApiReachable
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
                  }`}
                  title={isMockMode ? "Mock Data Mode Active" : "Live API Configured"}
                >
                  <Server className="w-2.5 h-2.5" />
                  {isMockMode ? 'Mock' : isLiveApiReachable ? 'Live API' : 'API Standby'}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-sand-500 dark:text-stone-400 font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 rounded-2xl bg-sand-200/60 dark:bg-stone-900/90 border border-sand-300/60 dark:border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onTabChange('explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                currentTab === 'explorer'
                  ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-sand-600 dark:text-stone-400 hover:text-sand-900 dark:hover:text-stone-200'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>{t('navSearch')}</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('checker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                currentTab === 'checker'
                  ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-sand-600 dark:text-stone-400 hover:text-sand-900 dark:hover:text-stone-200'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{t('navChecker')}</span>
            </button>
          </nav>

          {/* Controls: Language, Theme, Settings */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-sand-700 dark:text-stone-200 hover:bg-sand-200/70 dark:hover:bg-stone-800 transition border border-sand-200 dark:border-stone-800 cursor-pointer"
              title="Toggle Language (EN / KHA)"
              aria-label="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-sand-700 dark:text-stone-300 hover:bg-sand-200/70 dark:hover:bg-stone-800 transition border border-sand-200 dark:border-stone-800 cursor-pointer"
              title={`Switch Theme (Current: ${resolvedTheme})`}
              aria-label="Toggle Color Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sand-700" />
              )}
            </button>

            {/* Developer / API Settings Drawer Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl text-sand-700 dark:text-stone-300 hover:bg-sand-200/70 dark:hover:bg-stone-800 transition border border-sand-200 dark:border-stone-800 cursor-pointer"
              title="Developer & API Settings"
              aria-label="Open Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal Drawer */}
      <DevSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

