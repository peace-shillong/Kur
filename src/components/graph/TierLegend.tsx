import React from 'react';
import { ClanTier } from '../../types';
import { useClan, SEA_GREEN_PALETTE } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';

export const TierLegend: React.FC = () => {
  const { activeTiers, toggleTier, triggerResetView, graphData } = useClan();
  const { t, language } = useLanguage();

  const tiers: { id: ClanTier; labelKha: string; labelEn: string; color: string; desc: string }[] = [
    {
      id: 'kpoh',
      labelKha: 'Ka juh ka kpoh',
      labelEn: 'Direct Bloodline',
      color: SEA_GREEN_PALETTE.kpoh,
      desc: t('tierKpohDesc')
    },
    {
      id: 'shikur',
      labelKha: 'Ba ia dei kur',
      labelEn: 'Sister Clans (Shikur)',
      color: SEA_GREEN_PALETTE.shikur,
      desc: t('tierShikurDesc')
    },
    {
      id: 'tehkur',
      labelKha: 'Ba ia teh kur',
      labelEn: 'Treaty Bound (Teh Kur)',
      color: SEA_GREEN_PALETTE.tehkur,
      desc: t('tierTehkurDesc')
    },
    {
      id: 'distant',
      labelKha: 'Ba don jingiadei',
      labelEn: 'Distant Alliance',
      color: SEA_GREEN_PALETTE.distant,
      desc: t('tierDistantDesc')
    }
  ];

  const tierCounts = React.useMemo(() => {
    const counts: Record<string, number> = { origin: 1, kpoh: 0, shikur: 0, tehkur: 0, distant: 0 };
    graphData.nodes.forEach(n => {
      counts[n.tier] = (counts[n.tier] || 0) + 1;
    });
    return counts;
  }, [graphData.nodes]);

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-lg text-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-emerald-950 uppercase">
            {t('legendTitle')}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            {graphData.nodes.length} {t('nodeCountLabel')}
          </span>
        </div>

        <button
          type="button"
          onClick={triggerResetView}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('resetView')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiers.map(tier => {
          const isActive = activeTiers.has(tier.id);
          const count = tierCounts[tier.id] || 0;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => toggleTier(tier.id)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-50/70 border-emerald-200/80 shadow-xs'
                  : 'bg-slate-50/60 border-dashed border-slate-200 opacity-60'
              }`}
              title={tier.desc}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-white"
                  style={{ backgroundColor: tier.color }}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {language === 'kha' ? tier.labelKha : tier.labelEn}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'kha' ? tier.labelEn : tier.labelKha}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-white text-slate-700 border border-slate-200">
                  {count}
                </span>
                {isActive ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
