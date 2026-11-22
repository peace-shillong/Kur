import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ClanGraph } from './components/graph/ClanGraph';
import { NodeDetailModal } from './components/graph/NodeDetailModal';
import { FeatureLockedModal } from './components/modals/FeatureLockedModal';
import { BisharSangHub } from './components/checker/BisharSangHub';
import { SettingsPage } from './components/settings/SettingsPage';
import { useClan } from './context/ClanContext';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { HeartHandshake, ShieldCheck, ArrowLeft, Languages, Settings } from 'lucide-react';

export const App: React.FC = () => {
  const { isGraphOpen, setIsGraphOpen, recentSearches, query } = useClan();
  const { language, toggleLanguage, t } = useLanguage();
  const { homeBg } = useTheme();
  const [showChecker, setShowChecker] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  // Handle Physical / Browser Back Press
  useEffect(() => {
    const handlePopState = () => {
      if (showSettings) {
        setShowSettings(false);
      } else if (showChecker) {
        setShowChecker(false);
      } else if (isGraphOpen) {
        setIsGraphOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showChecker, showSettings, isGraphOpen, setIsGraphOpen]);

  const openChecker = () => {
    // When the user has not done any previous search and there is no recent search, show lock modal
    const hasPreviousSearch = recentSearches.length > 0 || Boolean(query && query.trim());
    if (!hasPreviousSearch) {
      setShowLockedModal(true);
      return;
    }
    setShowChecker(true);
    setShowSettings(false);
    window.history.pushState({ page: 'checker' }, '');
  };

  const closeChecker = () => {
    setShowChecker(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowChecker(false);
    window.history.pushState({ page: 'settings' }, '');
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors">
      {/* Accessibility Skip Link (WCAG 2.1 AA / GIGW standard for India) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-semibold"
      >
        {language === 'kha' ? 'Kyntait sha ka bynta bakongsan (Skip to content)' : 'Skip to main content'}
      </a>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col">
        {showSettings ? (
          /* Single Settings Page (Full Page / Fullscreen View, No Tabs) */
          <SettingsPage onBack={closeSettings} />
        ) : showChecker ? (
          /* Sang Compatibility Checker View */
          <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={closeChecker}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-700" />
                <span>{language === 'kha' ? 'Phai sha ka Jingwad Kur (Back)' : 'Back to Search'}</span>
              </button>
            </div>

            <BisharSangHub />
          </div>
        ) : (
          <>
            {/* Minimal Clean Home Page */}
            <HomePage />

            {/* Fullscreen Interactive Graph (shown when user searches) */}
            {isGraphOpen && <ClanGraph />}
          </>
        )}
      </main>

      {/* Floating Modal for Clan Node Details */}
      <NodeDetailModal />

      {/* Feature Locked Alert Modal (when no prior search done) */}
      <FeatureLockedModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />

      {/* Clean Minimalist Footer (Hidden when Settings or Graph is open) */}
      {!showSettings && (
        <footer className={`w-full border-t py-6 px-4 text-xs text-center space-y-3 transition-colors ${
          homeBg !== 'none'
            ? 'bg-white/85 dark:bg-[#090e0c]/85 backdrop-blur-md border-slate-200/70 dark:border-slate-800/70 text-slate-700 dark:text-slate-300 shadow-xs'
            : 'bg-slate-50/50 dark:bg-[#090e0c]/40 border-slate-100 dark:border-slate-800/40 text-slate-500 dark:text-slate-400'
        }`}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">

            {/* Settings Page Link (Opens Fullscreen Settings Page) */}
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition cursor-pointer"
              title="Settings, About, Credits, Theme"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'kha' ? 'Jingpynbeit & Jingtip' : 'Settings & Info'}</span>
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition cursor-pointer"
              title="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Feature: Bishar ia ka Sang on the Footer Link */}
            <button
              type="button"
              onClick={openChecker}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              <span>Bishar ia ka Sang</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 font-medium text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('disclaimerText')}</span>
          </div>
        </footer>
      )}
    </div>
  );
};
