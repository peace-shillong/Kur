import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useClan } from '../../context/ClanContext';
import { Search, History, Sparkles, X, Loader2 } from 'lucide-react';
import { sanitizeClanInput } from '../../utils/sanitize';

export const ClanSearchBar: React.FC = () => {
  const { t } = useLanguage();
  const { query, searchClan, recentSearches, clearHistory, loading } = useClan();
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = (clanToSearch?: string) => {
    const target = clanToSearch ?? searchInput;
    const clean = sanitizeClanInput(target);
    if (clean) {
      searchClan(clean);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Centered Search Form */}
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-sand-400 dark:text-stone-500">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchInputPlaceholder')}
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-sand-300 dark:border-stone-800 text-sand-900 dark:text-stone-50 placeholder:text-sand-400 dark:placeholder:text-stone-500 text-sm sm:text-base font-medium shadow-md shadow-sand-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-28 p-1 rounded-full text-sand-400 hover:text-sand-700 dark:hover:text-stone-200 transition"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-600/25 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{t('searchButton')}</span>
          </button>
        </div>
      </form>

      {/* Autocomplete / Recent Searches & Quick Suggestions */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 text-sand-500 dark:text-stone-400 font-medium mr-1">
            <History className="w-3.5 h-3.5" />
            <span>{t('recentSearches')}</span>
          </div>

          {recentSearches.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSearchInput(item);
                handleSearch(item);
              }}
              className={`px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                query.toLowerCase() === item.toLowerCase()
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold'
                  : 'bg-sand-100/70 dark:bg-stone-800/80 border-sand-200 dark:border-stone-700 text-sand-700 dark:text-stone-300 hover:bg-sand-200 dark:hover:bg-stone-700'
              }`}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            onClick={clearHistory}
            className="text-[11px] text-sand-400 hover:text-sand-600 dark:hover:text-stone-300 underline ml-1 cursor-pointer"
          >
            {t('clearHistory')}
          </button>
        </div>
      )}
    </div>
  );
};

