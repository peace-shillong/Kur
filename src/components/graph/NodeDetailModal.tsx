import React, { useRef, useEffect } from 'react';
import { useClan, SEA_GREEN_PALETTE } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, BookOpen, AlertTriangle, ShieldCheck, GitCommitHorizontal, Sparkles } from 'lucide-react';

export const NodeDetailModal: React.FC = () => {
  const { selectedNode, setSelectedNode, query } = useClan();
  const { t, language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openTimeRef = useRef<number>(0);

  // Sync with native <dialog> element per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedNode) {
      if (!dialog.open) {
        dialog.showModal();
        openTimeRef.current = Date.now();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [selectedNode]);

  // Fallback for click outside backdrop dismissal per Modern Web Guidance
  // Uses mousedown tracking and a grace period to prevent trailing clicks from canvas dismissing the modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    let backdropMouseDown = false;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        backdropMouseDown = !isContent;
      } else {
        backdropMouseDown = false;
      }
    };

    const handleBackdropClick = (event: MouseEvent) => {
      // Prevent trailing click from canvas tap from immediately closing the modal
      if (Date.now() - openTimeRef.current < 350) {
        backdropMouseDown = false;
        return;
      }

      if (event.target !== dialog || !backdropMouseDown) {
        backdropMouseDown = false;
        return;
      }
      backdropMouseDown = false;
      const rect = dialog.getBoundingClientRect();
      const isContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isContent) {
        setSelectedNode(null);
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      setSelectedNode(null);
    };

    dialog.addEventListener('mousedown', handleMouseDown);
    dialog.addEventListener('click', handleBackdropClick);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('mousedown', handleMouseDown);
      dialog.removeEventListener('click', handleBackdropClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [setSelectedNode]);

  if (!selectedNode) return null;

  const tierColor = selectedNode.color || SEA_GREEN_PALETTE.origin;

  const getTierLabel = () => {
    switch (selectedNode.tier) {
      case 'origin':
        return language === 'kha' ? 'Ka Jait ba wad (Origin)' : 'Search Origin Surname';
      case 'kpoh':
        return language === 'kha' ? 'Ka juh ka kpoh (Direct Bloodline)' : 'Direct Lineage (Same Womb)';
      case 'shikur':
        return language === 'kha' ? 'Ba ia dei kur (Shikur Clans)' : 'Maternal Sister Clan (Shikur)';
      case 'tehkur':
        return language === 'kha' ? 'Ba ia teh kur (Treaty Bound)' : 'Covenant Bound Clan (Teh Kur)';
      case 'distant':
        return language === 'kha' ? 'Ba don jingiadei jngai' : 'Distant Clan Connection';
      default:
        return '';
    }
  };

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="dialog-clan-title"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-xl max-h-[85vh] rounded-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-950/65 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[60]"
    >
      {/* Top Banner Accent */}
      <div 
        className="h-3 w-full"
        style={{ backgroundColor: tierColor }}
      />

      <div className="p-6 overflow-y-auto max-h-[calc(85vh-24px)] space-y-5">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 text-white shadow-xs"
              style={{ backgroundColor: tierColor }}
            >
              <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
              {getTierLabel()}
            </div>
            <h2 id="dialog-clan-title" className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
              {selectedNode.label}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
            aria-label="Close"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Relationship Path Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm">
          <div className="text-emerald-900 font-semibold flex items-center gap-1.5 mb-1">
            <GitCommitHorizontal className="w-4 h-4 text-emerald-600" />
            {t('relationshipPath')} <span className="underline font-bold">{query}</span>:
          </div>
          <div className="font-medium text-slate-800">
            {language === 'kha' ? selectedNode.relationshipPath?.khasi : selectedNode.relationshipPath?.english}
          </div>
        </div>

        {/* Ancestral Cluster Title */}
        {selectedNode.clusterTitle && (
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t('maternalCluster')}
            </div>
            <div className="font-serif font-medium text-base text-slate-900">
              {selectedNode.clusterTitle}
            </div>
          </div>
        )}

        {/* Summary Description */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            {t('historicalSummary')}
          </div>
          <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {language === 'kha' 
              ? (selectedNode.summaryKhasi || "Ka jingtip bniah shaphang kane ka kur.")
              : (selectedNode.summaryEnglish || "Historical and genealogical tradition of this lineage.")}
          </p>
        </div>

        {/* Marriage Prohibition / Sang Verdict Alert */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          selectedNode.tier === 'distant'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {selectedNode.tier === 'distant' ? (
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm">
            <div className="font-bold">
              {selectedNode.tier === 'distant' 
                ? (language === 'kha' ? 'Ka Jingiadei Jngai' : 'Extended Kinship Notice') 
                : (language === 'kha' ? 'Ka Sang ka Ma (Prohibited Union)' : 'Strict Exogamous Taboo (Sang)')}
            </div>
            <div className="mt-0.5 opacity-90 leading-normal">
              {selectedNode.tier === 'distant'
                ? t('verdictCautionHeader')
                : t('sangWarning')}
            </div>
          </div>
        </div>

        {/* Citation */}
        {selectedNode.citation && (
          <div className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-[#1f352c]">
            <span className="font-semibold not-italic">{t('citationSource')}:</span> {selectedNode.citation}
          </div>
        )}
      </div>
    </dialog>
  );
};
