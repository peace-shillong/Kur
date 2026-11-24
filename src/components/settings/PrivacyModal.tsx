import React, { useRef, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
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

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-lg max-h-[85vh] rounded-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-950/65 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[70]"
    >
      <div className="p-6 overflow-y-auto max-h-[85vh] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f352c]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 id="privacy-modal-title" className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              {language === 'kha' ? 'Ka Policy Halor ka Privacy & Data' : 'Privacy & Data Policy'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
            aria-label="Close"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Statement */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-1">
          <p className="text-sm font-bold">
            "We do not collect any user data. Please do not submit sensitive information in the app."
          </p>
          <p className="text-xs text-emerald-800 dark:text-emerald-300">
            {language === 'kha'
              ? 'Ngim ju lum lane kynshew ia ki data shimet jong phi. Sngewbha nai phah ia ki jingtip ba dei shimet lane kiba kyrpang jong phi.'
              : 'Your searches and lineage checks are processed privately on your local browser.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed bg-slate-50 dark:bg-[#15221d] p-4 rounded-2xl border border-slate-200 dark:border-[#1f352c]">
          <p>
            • <strong>Local Processing:</strong> All clan link queries, compatibility calculations, and view preferences are handled directly in your browser memory and private <code>localStorage</code>.
          </p>
          <p>
            • <strong>No Tracking / No Cookies:</strong> There are no advertising trackers, or personal identifier cookies embedded in this application. We only collect app usage analytics data which are public and available from your end.
          </p>
          <p>
            • <strong>Community Submissions:</strong> Any clan details voluntarily submitted via the "Ai Jingtip" or "Ujor jingbakla" forms are archived solely for community genealogical review and shared with Tynrai, are never commercialized.
          </p>
          <p>
            • <strong>Indian Data Protection (DPDPA 2023):</strong> Designed in full alignment with India's Digital Personal Data Protection Act, 2023. You have complete rights to data erasure and privacy, exercisable at any time using the "Pynduh lut ia ki Data & Cache" button.
          </p>
        </div>
      </div>
    </dialog>
  );
};

