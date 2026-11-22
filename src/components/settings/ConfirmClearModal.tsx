import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

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
        onClose();
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('mousedown', handleMouseDown);
    dialog.addEventListener('click', handleBackdropClick);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('mousedown', handleMouseDown);
      dialog.removeEventListener('click', handleBackdropClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-clear-title"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-md rounded-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-950/65 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[80]"
    >
      {isOpen && (
        <div className="p-6 sm:p-7 space-y-5">
          {/* Top row with close button */}
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/40 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 text-left">
            <h2
              id="confirm-clear-title"
              className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100"
            >
              {language === 'kha' ? 'Pynduh lut ia ki Data & Cache' : 'Clear All Data & Cache'}
            </h2>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              {language === 'kha'
                ? 'Phi sngewbha ban pynduh lut ia ki cache bad history baroh?'
                : 'Are you sure you want to clear all cached data, history, and settings?'}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'kha'
                ? 'Kane kan pynkhuid lut ia ki jait ba la wad, ki setting, bad ki draft submission ba la kynshew ha kane ka browser. Ym lah ban pynphai biang ia kine ki jingtip.'
                : 'This will reset all saved settings, search histories, cached clan networks, and draft submissions stored locally in this browser.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer border border-slate-200 dark:border-[#1f352c]"
            >
              {language === 'kha' ? 'Sangeh (Cancel)' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-red-600/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'kha' ? 'Hooid, Pynduh Lut' : 'Yes, Clear All'}</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

