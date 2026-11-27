import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ClanGraph } from './components/graph/ClanGraph';
import { NodeDetailModal } from './components/graph/NodeDetailModal';
import { FeatureLockedModal } from './components/modals/FeatureLockedModal';
import { BisharSangHub } from './components/checker/BisharSangHub';
import { SettingsPage } from './components/settings/SettingsPage';
import { KurJaitPage } from './components/kur-jait/KurJaitPage';
import { ClanListPage } from './components/clans/ClanListPage';
import { useClan } from './context/ClanContext';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { HeartHandshake, ArrowLeft, Languages, Settings, BookOpen, ListFilter } from 'lucide-react';

// Environment variable guard: only enabled if VITE_ENABLE_DEV_API='true' or during local development
const isDevApiEnabled = Boolean(
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_API === 'true'
);

// Lazy load DevApiPage so it is code-split and only fetched if accessed
const DevApiPage = React.lazy(() =>
  import('./components/dev/DevApiPage').then(module => ({ default: module.DevApiPage }))
);

export const App: React.FC = () => {
  const { isGraphOpen, setIsGraphOpen, recentSearches, query, searchClan } = useClan();
  const { language, toggleLanguage, t } = useLanguage();
  const { homeBg } = useTheme();
  const [showChecker, setShowChecker] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showKurJait, setShowKurJait] = useState<boolean>(false);
  const [showClanList, setShowClanList] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    return hash === '#clans' || hash === '#/clans' || hash === '#thup';
  });
  const [showDevPage, setShowDevPage] = useState<boolean>(() => {
    if (!isDevApiEnabled || typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search;
    return (
      hash === '#dev' ||
      hash === '#/dev' ||
      hash === '#api' ||
      hash === '#/api' ||
      window.location.pathname === '/dev' ||
      new URLSearchParams(search).has('dev')
    );
  });
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  // Helper to ensure mobile virtual keyboard stays dismissed when returning to homepage
  const dismissMobileKeyboard = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Handle Physical / Browser Back Press & Hash Navigation
  useEffect(() => {
    const handlePopState = () => {
      dismissMobileKeyboard();
      if (showClanList) {
        setShowClanList(false);
      } else if (showDevPage) {
        setShowDevPage(false);
      } else if (showSettings) {
        setShowSettings(false);
      } else if (showKurJait) {
        setShowKurJait(false);
      } else if (showChecker) {
        setShowChecker(false);
      } else if (isGraphOpen) {
        setIsGraphOpen(false);
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#clans' || hash === '#/clans' || hash === '#thup') {
        setShowClanList(true);
        setShowSettings(false);
        setShowKurJait(false);
        setShowChecker(false);
        setShowDevPage(false);
      } else if (isDevApiEnabled && (hash === '#dev' || hash === '#/dev' || hash === '#api' || hash === '#/api')) {
        setShowDevPage(true);
        setShowSettings(false);
        setShowKurJait(false);
        setShowChecker(false);
        setShowClanList(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [showChecker, showSettings, showKurJait, showClanList, showDevPage, isGraphOpen, setIsGraphOpen]);

  const openClanList = () => {
    setShowClanList(true);
    setShowSettings(false);
    setShowKurJait(false);
    setShowChecker(false);
    setShowDevPage(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.history.pushState({ page: 'clans' }, '', '#clans');
  };

  const closeClanList = () => {
    dismissMobileKeyboard();
    setShowClanList(false);
    if (
      window.location.hash === '#clans' ||
      window.location.hash === '#/clans' ||
      window.location.hash === '#thup'
    ) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleSelectClanFromList = (clanName: string) => {
    closeClanList();
    searchClan(clanName);
  };

  const openDevPage = () => {
    if (!isDevApiEnabled) return;
    setShowDevPage(true);
    setShowSettings(false);
    setShowChecker(false);
    setShowKurJait(false);
    setShowClanList(false);
    window.history.pushState({ page: 'dev' }, '', '#dev');
  };

  const closeDevPage = () => {
    dismissMobileKeyboard();
    setShowDevPage(false);
    if (
      window.location.hash === '#dev' ||
      window.location.hash === '#/dev' ||
      window.location.hash === '#api' ||
      window.location.hash === '#/api'
    ) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const openChecker = () => {
    // When the user has not done any previous search and there is no recent search, show lock modal
    const hasPreviousSearch = recentSearches.length > 0 || Boolean(query && query.trim());
    if (!hasPreviousSearch) {
      setShowLockedModal(true);
      return;
    }
    setShowChecker(true);
    setShowSettings(false);
    setShowKurJait(false);
    setShowClanList(false);
    setShowDevPage(false);
    window.history.pushState({ page: 'checker' }, '');
  };

  const closeChecker = () => {
    dismissMobileKeyboard();
    setShowChecker(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowChecker(false);
    setShowKurJait(false);
    setShowClanList(false);
    setShowDevPage(false);
    window.history.pushState({ page: 'settings' }, '');
  };

  const closeSettings = () => {
    dismissMobileKeyboard();
    setShowSettings(false);
  };

  const openKurJait = () => {
    setShowKurJait(true);
    setShowSettings(false);
    setShowChecker(false);
    setShowClanList(false);
    setShowDevPage(false);
    window.history.pushState({ page: 'kur-jait' }, '');
  };

  const closeKurJait = () => {
    dismissMobileKeyboard();
    setShowKurJait(false);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors ${!showSettings && !showKurJait && !showChecker && !showClanList && !(isDevApiEnabled && showDevPage) ? 'dark:bg-black' : ''}`}>
      {/* Accessibility Skip Link (WCAG 2.1 AA / GIGW standard for India) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-semibold"
      >
        {language === 'kha' ? 'Kyntait sha ka bynta bakongsan (Skip to content)' : 'Skip to main content'}
      </a>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col">
        {showClanList ? (
          /* Public Clan Lists Page */
          <ClanListPage onBack={closeClanList} onSelectClan={handleSelectClanFromList} />
        ) : isDevApiEnabled && showDevPage ? (
          /* Developer API Testing Console (Loaded lazily when enabled) */
          <React.Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
                Loading developer console...
              </div>
            }
          >
            <DevApiPage onBack={closeDevPage} />
          </React.Suspense>
        ) : showSettings ? (
          /* Single Settings Page (Full Page / Fullscreen View, No Tabs) */
          <SettingsPage
            onBack={closeSettings}
            onOpenDev={isDevApiEnabled ? openDevPage : undefined}
            onOpenClanList={openClanList}
          />
        ) : showKurJait ? (
          /* Ka Kur Ka Jait Cultural Heritage Page */
          <KurJaitPage onBack={closeKurJait} onOpenChecker={openChecker} />
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
            <HomePage onOpenClanList={openClanList} />

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

      {/* Clean Minimalist Footer (Hidden when Settings, Kur Jait, ClanList, Dev, or Graph is open) */}
      {!showSettings && !showKurJait && !showClanList && !(isDevApiEnabled && showDevPage) && (
        <footer className={`w-full border-t py-6 px-4 text-xs text-center space-y-3 transition-colors ${homeBg !== 'none'
          ? 'bg-white/85 dark:bg-black/85 backdrop-blur-md border-slate-200/70 dark:border-neutral-900 text-slate-700 dark:text-slate-300 shadow-xs'
          : 'bg-slate-50/50 dark:bg-black/60 border-slate-100 dark:border-neutral-900 text-slate-500 dark:text-slate-400'
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

            {/* Ka Kur Ka Jait Link (Heritage Document & Origins) */}
            <button
              type="button"
              onClick={openKurJait}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition cursor-pointer"
              title="Ka Kur Ka Jait • Ki Nongrim Tynrai"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ka Kur Ka Jait</span>
            </button>

            {/* Clan Lists / Directory Button */}
            <button
              type="button"
              onClick={openClanList}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition cursor-pointer"
              title="Thup ki Kur • Clan Lists (516 Documented Clans)"
            >
              <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'kha' ? 'Thup ki Kur' : 'Clan Lists'}</span>
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
            <span>{t('disclaimerText')}</span>
          </div><br />Powered by <a href='https://tynrai.in' className='underline text-emerald-800' target='_blank' rel='noopener noreferrer' >Tynrai-AI</a>
        </footer>
      )}
    </div>
  );
};
