import React, { useEffect } from 'react';
import { ClanTier } from '../../types';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  X, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  SlidersHorizontal, 
  Check, 
  Heart, 
  Users, 
  Shield 
} from 'lucide-react';

interface KyrdanKurModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KyrdanKurModal: React.FC<KyrdanKurModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeTiers, 
    toggleTier, 
    triggerResetView, 
    rawGraphData,
    minimalLinks,
    toggleMinimalLinks,
    hasMoreThan20,
    totalLinksCount
  } = useClan();
  const { t, language } = useLanguage();
  const { palette } = useTheme();

  // Close on Escape key per accessibility guidelines
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate clan counts per tier
  const rawCounts: Record<string, number> = { origin: 1, kpoh: 0, shikur: 0, tehkur: 0, distant: 0 };
  rawGraphData.nodes.forEach(n => {
    rawCounts[n.tier] = (rawCounts[n.tier] || 0) + 1;
  });

  // Top 3 Core Levels for Quick Toggle on top of Bottom Sheet
  const coreLevels: { id: ClanTier; labelKha: string; labelEn: string; color: string; icon: typeof Heart }[] = [
    {
      id: 'kpoh',
      labelKha: 'Level 1: Kpoh',
      labelEn: 'Level 1: Kpoh',
      color: palette.kpoh,
      icon: Heart
    },
    {
      id: 'shikur',
      labelKha: 'Level 2: Shikur',
      labelEn: 'Level 2: Shikur',
      color: palette.shikur,
      icon: Users
    },
    {
      id: 'tehkur',
      labelKha: 'Level 3: Teh Kur',
      labelEn: 'Level 3: Teh Kur',
      color: palette.tehkur,
      icon: Shield
    }
  ];

  // All 4 Kinship Tiers for Detailed List below the 3 icons
  const tiers: { id: ClanTier; labelKha: string; labelEn: string; color: string; desc: string }[] = [
    {
      id: 'kpoh',
      labelKha: 'Ka juh ka kpoh',
      labelEn: 'Direct Bloodline',
      color: palette.kpoh,
      desc: t('tierKpohDesc')
    },
    {
      id: 'shikur',
      labelKha: 'Ba ia dei kur',
      labelEn: 'Sister Clans (Shikur)',
      color: palette.shikur,
      desc: t('tierShikurDesc')
    },
    {
      id: 'tehkur',
      labelKha: 'Ba ia teh kur',
      labelEn: 'Treaty Bound (Teh Kur)',
      color: palette.tehkur,
      desc: t('tierTehkurDesc')
    },
    {
      id: 'distant',
      labelKha: 'Ba don jingiadei',
      labelEn: 'Distant Alliance',
      color: palette.distant,
      desc: t('tierDistantDesc')
    }
  ];

  return (
    <>
      {/* Dimmed Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[60] animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Kinship Tiers Bottom Sheet (Opens up to half screen height: max-h-[50vh]) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyrdan-kur-title"
        className="fixed inset-x-0 bottom-0 z-[61] w-full sm:max-w-xl sm:mx-auto h-[50vh] max-h-[50vh] rounded-t-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 shadow-2xl border-t sm:border-x border-slate-200 dark:border-[#1f352c] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 pb-[env(safe-area-inset-bottom,0px)]"
      >
        {/* Drag Handle Affordance on Top */}
        <div 
          onClick={onClose}
          className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0 cursor-grab active:cursor-grabbing hover:bg-slate-400 dark:hover:bg-slate-600 transition"
          title="Close sheet"
        />

        {/* Top Sheet Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-[#1f352c] shrink-0">
          <div>
            <h2 id="kyrdan-kur-title" className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              {language === 'kha' ? 'Ki Kyrdan Jingiadei Kur' : 'Kinship Tiers Legend'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'kha' ? 'Khnjot ki icon ban pyni/rieh ia ki kyrdan' : 'Tap level icons to show/hide circles in graph'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={triggerResetView}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
              title={t('resetView')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
              aria-label="Close sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* On Top: ONLY THE ICONS OF THE THREE LEVELS (Tap to Show/Hide circles for each level) */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-[#15221d]/80 border-b border-slate-100 dark:border-[#1f352c] shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {coreLevels.map(lvl => {
              const isActive = activeTiers.has(lvl.id);
              const count = rawCounts[lvl.id] || 0;
              const IconComponent = lvl.icon;

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => toggleTier(lvl.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-white dark:bg-[#111a16] shadow-xs hover:brightness-105'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-dashed border-slate-300 dark:border-slate-700 opacity-45'
                  }`}
                  style={{
                    borderColor: isActive ? lvl.color : undefined,
                  }}
                  title={isActive ? `Hide ${lvl.labelEn}` : `Show ${lvl.labelEn}`}
                  aria-pressed={isActive}
                >
                  {/* Status Indicator Icon */}
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div 
                      className="w-7 h-7 rounded-xl flex items-center justify-center transition"
                      style={{ 
                        backgroundColor: isActive ? `${lvl.color}20` : undefined,
                        color: isActive ? lvl.color : '#94a3b8' 
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Level Name */}
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full text-center">
                    {language === 'kha' ? lvl.labelKha.replace('Level ', 'Lvl ') : lvl.labelEn.replace('Level ', 'Lvl ')}
                  </span>

                  {/* Count & State Badge */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span 
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded-full"
                      style={{ 
                        backgroundColor: isActive ? `${lvl.color}25` : '#64748b20',
                        color: isActive ? lvl.color : '#64748b' 
                      }}
                    >
                      {count}
                    </span>
                    {isActive ? (
                      <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Below the Three Icons: Kinship Tiers Details and Descriptions (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Minimal Links / Show All Clans Toggle (when clans > 20) */}
          {hasMoreThan20 && (
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    {language === 'kha' ? 'Pyni tang ki kur ba jan tam (Minimal Links)' : 'Show Minimal Links'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {minimalLinks 
                    ? (language === 'kha' ? 'Max 12 (kpoh), 7 (shikur), 5 (kiwei)' : 'Capped direct bloodline and sister clans for clarity')
                    : (language === 'kha' ? `Dang pyni lut baroh ki ${totalLinksCount} ki kur` : `Showing all ${totalLinksCount} clans`)}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleMinimalLinks}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                  minimalLinks 
                    ? 'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800'
                    : 'bg-white dark:bg-[#15221d] text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {minimalLinks ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{minimalLinks ? (language === 'kha' ? 'Baroh' : 'All') : (language === 'kha' ? 'Minimal' : 'Minimal')}</span>
              </button>
            </div>
          )}

          {/* Detailed Tiers Cards */}
          <div className="space-y-2.5">
            {tiers.map(tier => {
              const isActive = activeTiers.has(tier.id);
              const count = rawCounts[tier.id] || 0;

              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#111a16] border-slate-200 dark:border-[#1f352c] shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 shadow-xs ring-2 ring-white dark:ring-[#111a16]"
                        style={{ backgroundColor: tier.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                            {language === 'kha' ? tier.labelKha : tier.labelEn}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-[#15221d] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#1f352c]">
                            {count} {language === 'kha' ? 'ki jait' : 'clans'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {tier.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTier(tier.id)}
                      className={`p-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                        isActive
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
                          : 'text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                      }`}
                      title={isActive ? "Hide this tier" : "Show this tier"}
                    >
                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
