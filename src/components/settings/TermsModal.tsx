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
      className="m-0 sm:m-auto w-full sm:max-w-lg max-h-[85vh] sm:rounded-3xl rounded-t-3xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-200 backdrop:bg-slate-950/50 backdrop:backdrop-blur-xs fixed bottom-0 sm:bottom-auto inset-x-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[70]"
    >
      <div className="p-6 overflow-y-auto max-h-[85vh] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 id="terms-modal-title" className="font-serif font-bold text-lg text-slate-900">
              {language === 'kha' ? 'Ki Kyndon & Ka Jingpynshai (Terms & Disclaimer)' : 'Terms of Service & Disclaimer'}
            </h3>
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

        {/* Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>{language === 'kha' ? 'Ka Jingmaham kaba Kyntang' : 'Customary Law Advisory'}</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">
            {language === 'kha'
              ? 'Ka rai kaba khatduh halor ka Sang ka Ma ka shong ha ki Longkñi, ki Kpa, ki Tymmen ki San jong ka Kur, bad ka Seng Kur.'
              : 'Final authority on Ka Sang rests with your Longkñi (maternal uncles), Clan elders, and registered Seng Kur.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p>
            • <strong>Informational Cultural Resource:</strong> This app serves to facilitate education, lineage awareness, and matrimonial exogamy research. It does not replace oral consultations with family elders (*Longkñi*).
          </p>
          <p>
            • <strong>Historical Sources:</strong> Kinship ties are derived from published literature and established oral traditions. Minor regional variances may exist across Khasi Hills, Ri-Bhoi, and War Jaiñtia.
          </p>
          <p>
            • <strong>Respect for Tradition:</strong> Users are requested to treat all genealogical information with the sacred respect due to ancestral heritage (*Tipkur Tipkha*).
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
          >
            {language === 'kha' ? 'Khad' : 'Close'}
          </button>
        </div>
      </div>
    </dialog>
  );
};
