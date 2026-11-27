import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useClan } from '../context/ClanContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Loader2, History, UserGroupIcon, ListFilter, Shuffle } from 'lucide-react';
import { sanitizeClanInput } from '../utils/sanitize';
import { COMMON_SURNAMES_LIST } from '../data/commonSurnames';

interface HomePageProps {
  onOpenClanList?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenClanList }) => {
  const { searchClan, loading, recentSearches, setPrimarySurname } = useClan();
  const { language } = useLanguage();
  const { palette, homeBg } = useTheme();
  const [jaitInput, setJaitInput] = useState<string>('');
  const [parallaxOffset, setParallaxOffset] = useState({ y: 0, scale: 1 });
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus management: Only focus on Desktop view (>= 768px).
  // On Mobile view (< 768px) or when pressing Back, NEVER auto-open the soft keyboard.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) {
        inputRef.current?.focus({ preventScroll: true });
      } else {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    }
  }, []);

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

  // Select 9 random common surnames from COMMON_SURNAMES_LIST (26 common clans)
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>(() => {
    const shuffled = [...COMMON_SURNAMES_LIST].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  });

  const handleShuffleSuggestions = () => {
    const shuffled = [...COMMON_SURNAMES_LIST].sort(() => 0.5 - Math.random());
    setQuickSuggestions(shuffled.slice(0, 9));
  };

  // Helper to hide soft keyboard on mobile devices
  const dismissKeyboard = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSearch = (clanToSearch?: string) => {
    dismissKeyboard();
    const target = clanToSearch ?? jaitInput;
    const clean = sanitizeClanInput(target);
    if (clean) {
      try {
        if (!localStorage.getItem('primarySurname')) {
          localStorage.setItem('primarySurname', clean);
          setPrimarySurname(clean);
        }
      } catch {
        // ignore
      }
      searchClan(clean);
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
    <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden dark:bg-black transition-colors duration-300">
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
              ref={inputRef}
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
            <div className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
              <span>{language === 'kha' ? 'Pyrshang da kine:' : 'Try these common clans:'}</span>
              <button
                type="button"
                onClick={handleShuffleSuggestions}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                title={language === 'kha' ? 'Pynkylla ki kur' : 'Shuffle suggestions'}
              >
                <Shuffle className="w-3 h-3" />
              </button>
            </div>
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

          {/* Quick link to view all 516 Documented Clans */}
          {onOpenClanList && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenClanList}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer transition py-1 px-2 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>
                  {language === 'kha'
                    ? 'Peit baroh ki 516 tylli ki Kur ba don ha ka App →'
                    : 'View all 516 Documented Clans in the App →'}
                </span>
              </button>
            </div>
          )}

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

      {/* Optional Cultural Background Image (Mawbynna on Left, Jingkieng-jri on Center-Right on Desktop) with Parallax */}
      {homeBg !== 'none' && (
        <div
          aria-hidden="true"
          className={`fixed pointer-events-none z-0 transition-transform duration-500 ease-out overflow-hidden flex ${homeBg === 'mawbynna'
              ? 'inset-x-0 bottom-16 sm:bottom-20 md:bottom-0 justify-center items-end max-h-[42vh] sm:max-h-[50vh] md:inset-x-auto md:left-0 md:w-[42vw] md:max-w-xl md:max-h-[68vh] md:justify-start'
              : 'inset-x-0 bottom-16 sm:bottom-20 max-h-[42vh] sm:max-h-[50vh] justify-center items-end md:inset-x-auto md:right-0 md:bottom-auto md:inset-y-0 md:h-screen md:max-h-none md:w-auto md:items-center md:justify-end'
            }`}
          style={{
            transform: `translate3d(0, ${parallaxOffset.y}px, 0) scale(${parallaxOffset.scale})`
          }}
        >
          {/* Framed container: bottom-anchored on mobile, center-right on desktop */}
          <div className={`relative flex ${homeBg === 'mawbynna'
              ? 'w-full h-full items-end justify-center md:justify-start'
              : 'w-full h-full items-end justify-center md:h-[72vh] md:aspect-[1/2] md:overflow-hidden md:items-center md:justify-end'
            }`}>
            {/* Subtle gradient overlay to blend seamlessly into page background */}
            <div
              className={`absolute inset-0 z-10 ${homeBg === 'mawbynna'
                  ? 'bg-gradient-to-t from-transparent via-white/30 to-white dark:via-black/40 dark:to-black md:bg-gradient-to-r md:from-transparent md:via-white/20 md:to-white dark:md:via-black/30 dark:md:to-black'
                  : 'bg-gradient-to-t from-transparent via-white/30 to-white dark:via-black/40 dark:to-black md:bg-gradient-to-r md:from-white md:via-white/20 md:to-transparent dark:md:from-black dark:md:via-black/30 dark:md:to-transparent'
                }`}
            />

            {/* Image Wrapper: Mirrored/Reflected horizontally on Desktop only for Jingkieng-jri */}
            <div className={`w-full h-full flex ${homeBg === 'jingkieng-jri'
                ? 'items-end justify-center md:items-center md:justify-end md:scale-x-[-1]'
                : 'items-end justify-center md:justify-start'
              }`}>
              <img
                src={homeBg === 'mawbynna' ? '/Mawbynna.webp' : '/jingkieng-jri.webp'}
                alt=""
                className={`opacity-35 dark:opacity-30 dark:invert dark:mix-blend-screen select-none pointer-events-none transition-all duration-700 ${homeBg === 'mawbynna'
                    ? 'w-full max-w-5xl object-contain object-bottom md:object-left-bottom md:w-full md:h-full'
                    : 'w-full max-w-5xl object-contain object-bottom md:w-[200%] md:max-w-none md:h-full md:object-cover md:object-right'
                  }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Symmetrical Desktop Duplicate for Jingkieng-jri (Left Side of Desktop Screen) */}
      {homeBg === 'jingkieng-jri' && (
        <div
          aria-hidden="true"
          className="hidden md:flex fixed pointer-events-none z-0 inset-y-0 left-0 h-screen w-auto items-center justify-start overflow-hidden transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(0, ${parallaxOffset.y}px, 0) scale(${parallaxOffset.scale})`
          }}
        >
          {/* Framed container on desktop left side */}
          <div className="relative flex h-[72vh] aspect-[1/2] overflow-hidden items-center justify-start">
            {/* Subtle gradient overlay fading inward toward center */}
            <div className="absolute inset-0 z-10 bg-gradient-to-l from-white via-white/20 to-transparent dark:from-black dark:via-black/30 dark:to-transparent" />

            {/* Left Duplicate Image (flipped horizontally to mirror the right side) */}
            <div className="w-full h-full flex items-center justify-start scale-x-[-1]">
              <img
                src="/jingkieng-jri.webp"
                alt=""
                className="opacity-35 dark:opacity-30 dark:invert dark:mix-blend-screen select-none pointer-events-none transition-all duration-700 w-[200%] max-w-none h-full object-cover object-right"
              />
            </div>
          </div>
        </div>
      )}

      {/* Symmetrical Desktop Duplicate for Mawbynna (Right Side of Desktop Screen, Mirror Image) */}
      {homeBg === 'mawbynna' && (
        <div
          aria-hidden="true"
          className="hidden md:flex fixed pointer-events-none z-0 bottom-0 right-0 w-[42vw] max-w-xl max-h-[68vh] items-end justify-end overflow-hidden transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(0, ${parallaxOffset.y}px, 0) scale(${parallaxOffset.scale})`
          }}
        >
          {/* Framed container on desktop right side */}
          <div className="relative w-full h-full flex items-end justify-end">
            {/* Subtle gradient overlay fading inward toward center */}
            <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-white/20 to-white dark:from-transparent dark:via-black/30 dark:to-black" />

            {/* Right Mirror Image */}
            <div className="w-full h-full flex items-end justify-end scale-x-[-1]">
              <img
                src="/Mawbynna.webp"
                alt=""
                className="opacity-35 dark:opacity-30 dark:invert dark:mix-blend-screen select-none pointer-events-none transition-all duration-700 w-full max-w-5xl object-contain object-bottom md:object-left-bottom md:w-full md:h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
