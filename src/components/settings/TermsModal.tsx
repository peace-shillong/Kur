import React, { useRef, useEffect } from 'react';
import { X, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-lg max-h-[85vh] rounded-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-950/65 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[70]"
    >
      <div className="p-6 overflow-y-auto max-h-[85vh] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f352c]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 id="terms-modal-title" className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              {language === 'kha' ? 'Ki Kyndon & Ka Jingpynshai (Terms & Disclaimer)' : 'Terms of Service & Disclaimer'}
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

        {/* Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>{language === 'kha' ? 'Ka Jingmaham kaba Kyrpang' : 'Customary Law Advisory'}</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200/90">
            {language === 'kha'
              ? 'Ka rai kaba khatduh halor ka Sang ka Ma ka shong ha ki Longkñi, ki Kpa, ki Tymmen ki San jong ka Kur, bad ka Seng Kur.'
              : 'Final authority on Ka Sang rests with your Longkñi (maternal uncles), Clan elders, and registered Seng Kur.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed bg-slate-50 dark:bg-[#15221d] p-4 rounded-2xl border border-slate-200 dark:border-[#1f352c]">
          <p>
            • <strong>Informational Cultural Resource:</strong> This app serves to facilitate education, lineage awareness, and matrimonial exogamy research. It does not replace oral consultations with family elders (*Longkñi*).
          </p>
          <p>
            • <strong>Historical Sources:</strong> Kinship ties are derived from published literature and established oral traditions. Minor regional variances may exist across Khasi Hills, Ri-Bhoi, and War Jaiñtia.
          </p>
          <p>
            • <strong>Respect for Tradition:</strong> Users are requested to treat all genealogical information with the sacred respect due to ancestral heritage (Tipkur Tipkha).
          </p>
        </div>
      </div>
    </dialog>
  );
};

