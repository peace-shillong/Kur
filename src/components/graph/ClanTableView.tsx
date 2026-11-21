import React, { useState } from 'react';
import { ClanTier } from '../../types';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Info, ExternalLink } from 'lucide-react';

export const ClanTableView: React.FC = () => {
  const { graphData, query, setSelectedNode, activeTiers } = useClan();
  const { language } = useLanguage();
  const { palette } = useTheme();
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  const nonOriginNodes = graphData.nodes.filter(n => n.tier !== 'origin');

  const filteredNodes = nonOriginNodes.filter(node => {
    const matchesTier = selectedTierFilter === 'all' || node.tier === selectedTierFilter;
    const matchesActive = activeTiers.has(node.tier);
    const matchesSearch = !filterQuery.trim() || 
      node.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (node.clusterTitle && node.clusterTitle.toLowerCase().includes(filterQuery.toLowerCase()));

    return matchesTier && matchesActive && matchesSearch;
  });

  const getTierBadge = (tier: ClanTier) => {
    const color = (palette as any)[tier] || '#2E8B57';
    switch (tier) {
      case 'kpoh':
        return {
          label: language === 'kha' ? 'Ka juh ka kpoh' : 'Direct Bloodline',
          color,
          bg: 'bg-emerald-900/10 text-emerald-950 dark:text-emerald-300 border-emerald-900/20'
        };
      case 'shikur':
        return {
          label: language === 'kha' ? 'Ba ia dei kur' : 'Sister Clan (Shikur)',
          color,
          bg: 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border-emerald-600/20'
        };
      case 'tehkur':
        return {
          label: language === 'kha' ? 'Ba ia teh kur' : 'Treaty Bound (Teh Kur)',
          color,
          bg: 'bg-emerald-400/15 text-emerald-900 dark:text-emerald-200 border-emerald-400/30'
        };
      case 'distant':
        return {
          label: language === 'kha' ? 'Ba don jingiadei' : 'Distant Alliance',
          color,
          bg: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
        };
      default:
        return { label: 'Kur', color, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <div id="clan-table-container" className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-[#111a16] rounded-3xl border border-slate-200 dark:border-[#1f352c] shadow-sm animate-in fade-in duration-200">
      {/* Top filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1f352c]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder={language === 'kha' ? 'Wad ha kane ka table...' : 'Filter table...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#15221d] border border-slate-200 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
            {filteredNodes.length} {language === 'kha' ? 'ki jait' : 'clans'}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: language === 'kha' ? 'Baroh' : 'All' },
            { id: 'kpoh', label: language === 'kha' ? 'Ka juh ka kpoh' : 'Direct' },
            { id: 'shikur', label: language === 'kha' ? 'Shikur' : 'Sister' },
            { id: 'tehkur', label: language === 'kha' ? 'Teh Kur' : 'Bound' },
            { id: 'distant', label: language === 'kha' ? 'Jingiadei' : 'Distant' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTierFilter(tab.id)}
              style={selectedTierFilter === tab.id ? { backgroundColor: palette.primary } : undefined}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer text-xs ${
                selectedTierFilter === tab.id
                  ? 'text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#15221d] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1f352c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table: Exactly 3 columns on Mobile (#, Ka jait, Jingbatai) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1f352c]">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#15221d] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-[#1f352c] text-[11px] sm:text-xs uppercase tracking-wider">
              {/* 1. Index Column */}
              <th className="py-3 px-3 sm:px-4 w-10 sm:w-12">#</th>
              {/* 2. Clan Surname Column */}
              <th className="py-3 px-3 sm:px-4">{language === 'kha' ? 'Ka Jait' : 'Clan Surname'}</th>
              {/* Desktop Only Columns */}
              <th className="py-3 px-4 hidden sm:table-cell">{language === 'kha' ? 'Ka Kyrdan' : 'Kinship Tier'}</th>
              <th className="py-3 px-4 hidden md:table-cell">{language === 'kha' ? 'Ka Tyngshop / Cluster' : 'Ancestral Cluster'}</th>
              <th className="py-3 px-4 hidden sm:table-cell">{language === 'kha' ? 'Ka Jingiadei' : 'Relationship'}</th>
              {/* 3. Jingbatai Column (Shows description & quick view on mobile, action on desktop) */}
              <th className="py-3 px-3 sm:px-4 text-left sm:text-right">{language === 'kha' ? 'Jingbatai' : 'Description'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1f352c]">
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node, index) => {
                const badge = getTierBadge(node.tier);
                return (
                  <tr 
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNode(node);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${node.label}`}
                    className="hover:bg-slate-50/90 dark:hover:bg-[#15221d]/90 transition-colors cursor-pointer group focus:outline-none focus:bg-slate-100 dark:focus:bg-[#1a2c25]"
                  >
                    {/* 1. Index */}
                    <td className="py-3 px-3 sm:px-4 text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* 2. Ka Jait */}
                    <td className="py-3 px-3 sm:px-4 font-serif font-bold text-slate-900 dark:text-slate-100">
                      {node.label}
                    </td>

                    {/* Desktop Only Columns */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                        <span 
                          className="w-2 h-2 rounded-full shrink-0" 
                          style={{ backgroundColor: badge.color }} 
                        />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs hidden md:table-cell max-w-xs truncate">
                      {node.clusterTitle || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs hidden sm:table-cell">
                      {language === 'kha' ? node.relationshipPath?.khasi : node.relationshipPath?.english}
                    </td>

                    {/* 3. Jingbatai Column */}
                    <td className="py-3 px-3 sm:px-4 text-left sm:text-right">
                      {/* Mobile View Content: Tier badge + relationship text + inline tap */}
                      <div className="sm:hidden space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ backgroundColor: badge.color }} 
                            />
                            <span>{badge.label}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode(node);
                            }}
                            className="p-1 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Peit bniah"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {language === 'kha' ? node.relationshipPath?.khasi : node.relationshipPath?.english}
                        </p>
                      </div>

                      {/* Desktop View Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node);
                        }}
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#15221d] group-hover:bg-slate-200 dark:group-hover:bg-[#1f352c] text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
                      >
                        <span>{language === 'kha' ? 'Peit' : 'View'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  {language === 'kha' ? 'Ym shem jait kiba iahap bad kane ka jingwad.' : 'No clans match your filter query.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Watermark at Bottom of Table for Share & Export (Item 15 in Todo) */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1f352c] gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <Info className="w-3.5 h-3.5" style={{ color: palette.primary }} />
          <span>Origin Surname: <strong className="text-slate-800 dark:text-slate-200">{query}</strong></span>
        </div>
        <div className="italic text-center sm:text-right font-sans">
          Generated by Kur App (https://kur.kyrshan.com), Data Sourced from tynrai.in
        </div>
      </div>
    </div>
  );
};
