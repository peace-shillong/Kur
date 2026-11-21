import React, { useRef, useEffect } from 'react';
import { ClanTier } from '../../types';
import { useClan, SEA_GREEN_PALETTE } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Eye, EyeOff, RotateCcw, Filter, SlidersHorizontal, Check } from 'lucide-react';

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
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Sync with native <dialog> element per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Click outside fallback per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isContent) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [onClose]);

  if (!isOpen) return null;

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

  const rawCounts: Record<string, number> = { origin: 1, kpoh: 0, shikur: 0, tehkur: 0, distant: 0 };
  rawGraphData.nodes.forEach(n => {
    rawCounts[n.tier] = (rawCounts[n.tier] || 0) + 1;
  });

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="kyrdan-kur-title"
      className="m-0 md:m-auto w-full md:max-w-2xl max-h-[88vh] md:rounded-3xl rounded-t-3xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-200 backdrop:bg-slate-950/50 backdrop:backdrop-blur-xs fixed bottom-0 md:bottom-auto inset-x-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[60]"
    >
      {/* Mobile drag affordance bar */}
      <div className="md:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3" />

      <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(88vh-20px)] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 id="kyrdan-kur-title" className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                {language === 'kha' ? 'Ki Kyrdan Jingiadei Kur (Legends)' : 'Kinship Tiers & Legend Details'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'kha' ? 'Ki jingbatai bad ka jingpeit ia ki thied ki kur' : 'Tier descriptions, filters and clan limits'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Links / Show All Clans Toggle (Item 17 in Todo) */}
        {hasMoreThan20 && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  {language === 'kha' ? 'Pyni tang ki kur ba jan tam (Minimal Links)' : 'Show Minimal Links (Clans > 20)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {minimalLinks 
                  ? (language === 'kha' ? 'La buh max 12 (ka juh ka kpoh), max 7 (shikur), max 5 (kiwei)' : 'Capped at max 12 direct bloodline, 7 sister clans, 5 other links for clarity.')
                  : (language === 'kha' ? `Dang pyni lut baroh ki ${totalLinksCount} ki kur` : `Currently showing all ${totalLinksCount} related clans.`)}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleMinimalLinks}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                minimalLinks 
                  ? 'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800'
                  : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              {minimalLinks ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{minimalLinks ? (language === 'kha' ? 'Pyni Baroh' : 'Show All') : (language === 'kha' ? 'Pyni Minimal' : 'Show Minimal')}</span>
            </button>
          </div>
        )}

        {/* Detailed Tiers List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{language === 'kha' ? 'Ki 4 Kyrdan' : '4 Kinship Tiers'}</span>
            <button
              type="button"
              onClick={triggerResetView}
              className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer normal-case"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('resetView')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tiers.map(tier => {
              const isActive = activeTiers.has(tier.id);
              const count = rawCounts[tier.id] || 0;

              return (
                <div
                  key={tier.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 shadow-xs ring-2 ring-white"
                        style={{ backgroundColor: tier.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-slate-900">
                            {language === 'kha' ? tier.labelKha : tier.labelEn}
                          </span>
                          <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {count} {language === 'kha' ? 'ki jait' : 'clans'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {tier.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTier(tier.id)}
                      className={`p-2 rounded-xl transition shrink-0 cursor-pointer ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                      }`}
                      title={isActive ? "Hide this tier" : "Show this tier"}
                    >
                      {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
          >
            {t('closeButton')}
          </button>
        </div>
      </div>
    </dialog>
  );
};

