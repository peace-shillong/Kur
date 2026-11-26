import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CLAN_NAMES, TOTAL_DOCUMENTED_CLANS } from '../../data/clanList';
import {
  ArrowLeft,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  BookOpen,
  Users
} from 'lucide-react';

interface ClanListPageProps {
  onBack: () => void;
  onSelectClan?: (clanName: string) => void;
}

type SortField = 'index' | 'name';
type SortDirection = 'asc' | 'desc';

// Helper to normalize Khasi characters for diacritic-insensitive search
function normalizeKhasi(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, 'i')
    .replace(/[ññ]/g, 'n')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const ClanListPage: React.FC<ClanListPageProps> = ({ onBack, onSelectClan }) => {
  const { language } = useLanguage();
  const topRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to the top of the page when the Clan List loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    const timer = setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [copiedClan, setCopiedClan] = useState<string | null>(null);

  // Pre-indexed items with their original sequence number
  const originalItems = useMemo(() => {
    return CLAN_NAMES.map((name, idx) => ({
      originalIndex: idx + 1,
      name,
      firstLetter: name.charAt(0).toUpperCase()
    }));
  }, []);

  // Compute available initial letters with item counts
  const letterCounts = useMemo(() => {
    const map = new Map<string, number>();
    originalItems.forEach(item => {
      const letter = item.firstLetter;
      map.set(letter, (map.get(letter) || 0) + 1);
    });
    return map;
  }, [originalItems]);

  // Unique alphabet letters present in the dataset (sorted)
  const availableLetters = useMemo(() => {
    const letters = Array.from(letterCounts.keys());
    return letters.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  }, [letterCounts]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...originalItems];

    // 1. Filter by letter
    if (selectedLetter !== 'ALL') {
      result = result.filter(item => item.firstLetter === selectedLetter);
    }

    // 2. Filter by search query (supporting normal & normalized Khasi)
    const trimmed = searchQuery.trim();
    if (trimmed) {
      const normalizedQuery = normalizeKhasi(trimmed);
      result = result.filter(item => {
        const rawMatch = item.name.toLowerCase().includes(trimmed.toLowerCase());
        const normMatch = normalizeKhasi(item.name).includes(normalizedQuery);
        return rawMatch || normMatch;
      });
    }

    // 3. Sort items
    result.sort((a, b) => {
      if (sortField === 'index') {
        return sortDirection === 'asc'
          ? a.originalIndex - b.originalIndex
          : b.originalIndex - a.originalIndex;
      } else {
        const comp = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
        return sortDirection === 'asc' ? comp : -comp;
      }
    });

    return result;
  }, [originalItems, selectedLetter, searchQuery, sortField, sortDirection]);

  // Toggle sorting on column header click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Copy clan name to clipboard
  const handleCopyClan = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(name);
      setCopiedClan(name);
      setTimeout(() => setCopiedClan(null), 1800);
    }
  };

  // Highlight search term inside clan name
  const renderHighlightedName = (name: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return name;

    const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-emerald-200 dark:bg-emerald-800/80 text-emerald-950 dark:text-emerald-100 px-0.5 rounded font-bold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={topRef} className="flex-1 max-w-5xl mx-auto px-4 py-6 sm:py-10 w-full space-y-6">
      {/* Top Header / Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{language === 'kha' ? 'Phai (Back)' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{TOTAL_DOCUMENTED_CLANS} Documented Clans</span>
          </span>
        </div>
      </div>

      {/* Hero Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'kha' ? 'Thup ki Kur ba don ha ka App' : 'Directory of Documented Clans'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {language === 'kha'
            ? 'Kane ka dei ka thup jong ki 259 tylli ki jait kur ba la dep kynthup bad pynkheiñ jingïadei ha kane ka platform. Phi lah ban wad, bishar, ne jied ban pyni ha ka graph.'
            : 'Explore all 259 Khasi clans and surnames currently cataloged in this application. Search by name, filter by initial letter, sort alphabetically, or click to explore connections.'}
        </p>
      </div>

      {/* Controls Card: Search Input & Alphabet Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              language === 'kha'
                ? 'Wad kyrteng kur (e.g. Diengdoh, Nongkynrih, Laloo, Ïaw Shi Bdi)...'
                : 'Search clan name (e.g. Diengdoh, Nongkynrih, Laloo, Ïaw Shi Bdi)...'
            }
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Alphabet Quick Filter Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
            <span>{language === 'kha' ? 'Jied katkum u Dak Thoh:' : 'Filter by Initial Letter:'}</span>
            <span>
              {language === 'kha'
                ? `La pyni: ${filteredAndSortedItems.length} na ${TOTAL_DOCUMENTED_CLANS}`
                : `Showing: ${filteredAndSortedItems.length} of ${TOTAL_DOCUMENTED_CLANS}`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedLetter === 'ALL'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a2b24] hover:bg-slate-200 dark:hover:bg-[#223930] text-slate-700 dark:text-slate-300'
                }`}
            >
              {language === 'kha' ? 'Baroh (All)' : 'All'}
            </button>

            {availableLetters.map(letter => {
              const count = letterCounts.get(letter) || 0;
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(isSelected ? 'ALL' : letter)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1a2b24] hover:bg-slate-200 dark:hover:bg-[#223930] text-slate-700 dark:text-slate-300'
                    }`}
                  title={`${count} clans starting with ${letter}`}
                >
                  <span>{letter}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredAndSortedItems.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {language === 'kha' ? 'Ym shem ïa ka Kur ba wad' : 'No matching clans found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {language === 'kha'
                  ? `Ym don ka kur ba ïadei bad "${searchQuery}". Pyrshang da kiwei pat ki dak thoh lane khmih ha ka thup baroh.`
                  : `No clans matched "${searchQuery}". Check the spelling, try a different letter, or browse all clans.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedLetter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {language === 'kha' ? 'Pynphai sha ka thup baroh' : 'Reset filters'}
            </button>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#16231e] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold select-none">
                  {/* Column 1: Index Number */}
                  <th scope="col" className="py-3.5 px-4 sm:px-6 w-16 sm:w-20">
                    <button
                      type="button"
                      onClick={() => handleSort('index')}
                      className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer font-bold"
                      title="Sort by index"
                    >
                      <span>#</span>
                      {sortField === 'index' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </th>

                  {/* Column 2: Clan Name */}
                  <th scope="col" className="py-3.5 px-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleSort('name')}
                      className="inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer font-bold"
                      title="Sort by Clan Name (A-Z)"
                    >
                      <span>{language === 'kha' ? 'Kyrteng Kur / Jait' : 'Clan / Surname'}</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </th>

                  {/* Column 3: Initial */}
                  <th scope="col" className="py-3.5 px-3 sm:px-4 text-center w-20 hidden sm:table-cell">
                    <span>{language === 'kha' ? 'Dak' : 'Initial'}</span>
                  </th>

                  {/* Column 4: Actions */}
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right w-36 sm:w-48">
                    <span>{language === 'kha' ? 'Jingleh' : 'Actions'}</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredAndSortedItems.map(item => (
                  <tr
                    key={item.name}
                    className="hover:bg-emerald-50/40 dark:hover:bg-[#182721] transition-colors group cursor-pointer"
                    onClick={() => onSelectClan && onSelectClan(item.name)}
                  >
                    {/* Index */}
                    <td className="py-3 px-4 sm:px-6 font-mono text-xs text-slate-400 dark:text-slate-500">
                      {String(item.originalIndex).padStart(3, '0')}
                    </td>

                    {/* Clan Name */}
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {renderHighlightedName(item.name)}
                        </span>
                      </div>
                    </td>

                    {/* Initial Badge */}
                    <td className="py-3 px-3 sm:px-4 text-center hidden sm:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-[#1c2e27] text-slate-600 dark:text-slate-300 font-mono">
                        {item.firstLetter}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={e => handleCopyClan(item.name, e)}
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
                          title={`Copy ${item.name}`}
                        >
                          {copiedClan === item.name ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Explore in App / Graph */}
                        {onSelectClan && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onSelectClan(item.name);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/80 dark:border-emerald-800/80 transition cursor-pointer shadow-2xs"
                            title={`Search ${item.name} in Clan Graph`}
                          >
                            <Search className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                            <span className="hidden sm:inline">
                              {language === 'kha' ? 'Wad' : 'Search'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Historical Citation & Note Footer Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="font-serif font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{language === 'kha' ? 'Ki Nongrim & Jingtip' : 'Historical Data & Citations'}</span>
        </div>
        <p className="leading-relaxed">
          {language === 'kha'
            ? 'Kine ki 259 tylli ki jait kur ki dei kiba la pynshisha lyngba ki kot tynrai kum ka "Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi" da Rev. I. Kharkongngor (2004), ka Khasi Social Custom of Lineage Act 1997, bad ki rekhor na Tynrai-AI. Lada phi shem ba don ka kur ba dang sah ne bakla, sngewbha pyntip lem ia ngi.'
            : 'These 259 clans are cataloged based on historical Khasi ethnographic texts including Rev. I. Kharkongngor (2004), the KHADC Lineage Act of 1997, and oral lineage archives from Tynrai-AI. If your clan or lineage branch is missing or has inaccurate links, please submit a correction in Settings.'}
        </p>
      </div>
    </div>
  );
};
