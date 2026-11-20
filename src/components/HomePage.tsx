import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Loader2, Sparkles, History } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { searchClan, loading, recentSearches } = useClan();
  const { language } = useLanguage();
  const [jaitInput, setJaitInput] = useState<string>('');

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

  const handleSearch = (clanToSearch?: string) => {
    const target = clanToSearch ?? jaitInput;
    if (target && target.trim()) {
      searchClan(target.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Modern Web Guidance: IME-safe Enter handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || (e.nativeEvent as any).keyCode === 229) {
        return;
      }
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 max-w-3xl mx-auto w-full text-center">
      {/* Decorative Brand Accent */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Tipkur Tipkha • Khasi Ancestral Kinship</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 mb-4 sm:mb-6 animate-in fade-in duration-600">
        Wad ki kur jong phi
      </h1>

      {/* Single Clear Question */}
      <p className="text-lg sm:text-2xl font-serif font-medium text-emerald-800 mb-8 sm:mb-10 animate-in fade-in duration-700">
        {language === 'kha' ? 'Kaei ka jait jong phi?' : 'What is your clan surname? (Kaei ka jait jong phi?)'}
      </p>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
        <div className="relative flex items-center shadow-lg shadow-emerald-900/5 rounded-2xl sm:rounded-3xl border border-emerald-200 bg-white p-1.5 sm:p-2 transition-all focus-within:ring-3 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
          <input
            type="text"
            value={jaitInput}
            onChange={e => setJaitInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'kha' ? "Buh ia ka jait jong phi (e.g: Diengdoh, Laloo)..." : "Enter your surname (e.g. Diengdoh, Laloo)..."}
            className="w-full pl-4 sm:pl-6 pr-4 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            autoFocus
            required
          />

          <button
            type="submit"
            disabled={loading || !jaitInput.trim()}
            className="shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm sm:text-base transition-all flex items-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Wad kur</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Pyrshang da kine:</span>
          {quickSuggestions.map(clan => (
            <button
              key={clan}
              type="button"
              onClick={() => {
                setJaitInput(clan);
                handleSearch(clan);
              }}
              className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 font-medium transition cursor-pointer"
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
    </div>
  );
};
