import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ClanGraph } from './components/graph/ClanGraph';
import { NodeDetailModal } from './components/graph/NodeDetailModal';
import { CompatibilityChecker } from './components/checker/CompatibilityChecker';
import { SettingsModal } from './components/settings/SettingsModal';
import { useClan } from './context/ClanContext';
import { useLanguage } from './context/LanguageContext';
import { HeartHandshake, ShieldCheck, ArrowLeft, Languages, Settings } from 'lucide-react';

export const App: React.FC = () => {
  const { isGraphOpen, setIsGraphOpen } = useClan();
  const { language, toggleLanguage, t } = useLanguage();
  const [showChecker, setShowChecker] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Handle Physical / Browser Back Press (Item 3 in Todo)
  useEffect(() => {
    const handlePopState = () => {
      if (showChecker) {
        setShowChecker(false);
      } else if (showSettings) {
        setShowSettings(false);
      } else if (isGraphOpen) {
        setIsGraphOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showChecker, showSettings, isGraphOpen, setIsGraphOpen]);

  const openChecker = () => {
    setShowChecker(true);
    window.history.pushState({ page: 'checker' }, '');
  };

  const closeChecker = () => {
    setShowChecker(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {showChecker ? (
          <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={closeChecker}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-700" />
                <span>Phai sha ka Jingwad Kur (Back)</span>
              </button>
            </div>

            <CompatibilityChecker />
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

      {/* Settings Modal (Item 22-39 in Todo) */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Clean Minimalist Footer */}
      <footer className="w-full border-t border-slate-100 py-6 px-4 bg-slate-50/50 text-xs text-center text-slate-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {/* Feature: Bishar ia ka Sang on the Footer Link */}
          <button
            type="button"
            onClick={openChecker}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Bishar ia ka Sang</span>
          </button>

          {/* Settings Modal Link (Item 22 in Todo) */}
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition cursor-pointer"
            title="App Settings, About, Credits, Policy"
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
        </div>

        <div className="flex items-center justify-center gap-1.5 font-medium text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('disclaimerText')}</span>
        </div>
      </footer>
    </div>
  );
};
