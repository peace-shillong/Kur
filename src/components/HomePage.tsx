import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useClan } from '../context/ClanContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Loader2, History, UserGroupIcon } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { searchClan, loading, recentSearches } = useClan();
  const { language } = useLanguage();
  const { palette, homeBg } = useTheme();
  const [jaitInput, setJaitInput] = useState<string>('');
  const [parallaxOffset, setParallaxOffset] = useState({ y: 0, scale: 1 });

  // Parallax calculation on screen resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      // Parallax effect: subtle vertical shift and scale responding smoothly to screen width/resize
      const yShift = (w % 120) * 0.15;
      const dynamicScale = Math.min(1.06, Math.max(0.98, w / 1400));
      setParallaxOffset({ y: yShift, scale: dynamicScale });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const quickSuggestions = [
    'Diengdoh',
    'Nongkynrih',
    'Kharkongor',
    'Laloo',
    'Shadap',
    'Syiemlieh',
    'Marbaniang',
    'Mawlong',
    'Pyngrope'
  ];

  // Helper to hide soft keyboard on mobile devices
  const dismissKeyboard = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSearch = (clanToSearch?: string) => {
    dismissKeyboard();
    const target = clanToSearch ?? jaitInput;
    if (target && target.trim()) {
      searchClan(target.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dismissKeyboard();
    handleSearch();
  };

  // Modern Web Guidance: IME-safe Enter handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || (e.nativeEvent as any).keyCode === 229) {
        return;
      }
      e.preventDefault();
      dismissKeyboard();
      handleSearch();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">
      {/* Main Home Content with Smooth Pop-up Ease-In Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 max-w-3xl mx-auto w-full text-center relative z-10"
      >
        {/* Decorative Brand Accent */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-3 duration-500 transition-colors"
          style={{
            backgroundColor: `${palette.primary}12`,
            color: palette.primary,
            border: `1px solid ${palette.primary}35`
          }}
        >
          <UserGroupIcon className="w-3.5 h-3.5" style={{ color: palette.primary }} />
          <span>Tipkur Tipkha • Khasi Ancestral Kinship</span>
        </div>

        {/* Title (Normal case, strictly not capitalized) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold normal-case tracking-tight text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 animate-in fade-in duration-600">
          Wad ki kur jong phi
        </h1>

        {/* Single Clear Question (Normal case, strictly not capitalized) */}
        <p className="text-lg sm:text-2xl font-sans font-normal normal-case text-slate-700 dark:text-slate-300 mb-8 sm:mb-10 animate-in fade-in duration-700">
          {language === 'kha' ? 'Kaei ka jait jong phi?' : 'What is your clan/surname?'}
        </p>

        {/* Main Search Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
          <div className="relative flex items-center shadow-lg rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a16] p-1.5 sm:p-2 transition-all focus-within:ring-3 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
            <input
              type="text"
              value={jaitInput}
              onChange={e => setJaitInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'kha' ? "Thoh ka jait jong phi hangne" : "Enter your surname (e.g Laloo)"}
              className="w-full pl-4 sm:pl-6 pr-4 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
              autoFocus
              required
            />

            <button
              type="submit"
              disabled={loading || !jaitInput.trim()}
              style={{ backgroundColor: palette.primary }}
              className="shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold text-sm sm:text-base transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 hover:brightness-110 active:brightness-90"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Pyrshang da kine:</span>
            {quickSuggestions.map(clan => (
              <button
                key={clan}
                type="button"
                onClick={() => {
                  setJaitInput(clan);
                  handleSearch(clan);
                }}
                className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#15221d] hover:bg-slate-100 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-medium transition cursor-pointer"
              >
                {clan}
              </button>
            ))}
          </div>

          {/* Recent Search History if present */}
          {recentSearches.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Dang shu wad shen:</span>
              {recentSearches.slice(0, 5).map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setJaitInput(item);
                    handleSearch(item);
                  }}
                  className="underline hover:text-emerald-700 cursor-pointer mx-1 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </form>
      </motion.div>

      {/* Optional Cultural Background Image (Mawbynna on Left, Jingkieng-jri on Right-cropped) with Parallax */}
      {homeBg !== 'none' && (
        <div
          aria-hidden="true"
          className={`fixed pointer-events-none z-0 transition-transform duration-500 ease-out overflow-hidden flex items-end ${
            homeBg === 'mawbynna'
              ? 'inset-x-0 bottom-0 justify-center max-h-[38vh] sm:max-h-[46vh] md:inset-x-auto md:left-0 md:bottom-0 md:w-[42vw] md:max-w-2xl md:max-h-[65vh] md:justify-start'
              : 'inset-x-0 bottom-0 justify-center max-h-[38vh] sm:max-h-[46vh] md:inset-x-auto md:right-0 md:bottom-0 md:w-[45vw] md:max-w-2xl md:max-h-[65vh] md:justify-end'
          }`}
          style={{
            transform: `translate3d(0, ${parallaxOffset.y}px, 0) scale(${parallaxOffset.scale})`
          }}
        >
          {/* Subtle gradient overlay to blend seamlessly into page background */}
          <div
            className={`absolute inset-0 z-10 ${
              homeBg === 'mawbynna'
                ? 'bg-gradient-to-t from-transparent via-white/40 to-white dark:via-[#090e0c]/50 dark:to-[#090e0c] md:bg-gradient-to-r md:from-transparent md:via-white/20 md:to-white dark:md:via-[#090e0c]/30 dark:md:to-[#090e0c]'
                : 'bg-gradient-to-t from-transparent via-white/40 to-white dark:via-[#090e0c]/50 dark:to-[#090e0c] md:bg-gradient-to-l md:from-transparent md:via-white/20 md:to-white dark:md:via-[#090e0c]/30 dark:md:to-[#090e0c]'
            }`}
          />

          <img
            src={homeBg === 'mawbynna' ? '/Mawbynna.webp' : '/jingkieng-jri.webp'}
            alt=""
            className={`w-full max-w-5xl opacity-30 dark:opacity-25 select-none pointer-events-none transition-all duration-700 ${
              homeBg === 'mawbynna'
                ? 'object-contain object-bottom md:object-left-bottom md:w-full md:h-full'
                : 'object-contain object-bottom md:object-cover md:object-right md:w-full md:h-full'
            }`}
          />
        </div>
      )}
    </div>
  );
};
