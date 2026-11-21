import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Lock, Search, X } from 'lucide-react';

interface FeatureLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchNow?: () => void;
}

export const FeatureLockedModal: React.FC<FeatureLockedModalProps> = ({
  isOpen,
  onClose,
  onSearchNow
}) => {
  const { language } = useLanguage();
  const { palette } = useTheme();
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

    const handleClose = () => {
      onClose();
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('mousedown', handleMouseDown);
    dialog.addEventListener('click', handleBackdropClick);
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('mousedown', handleMouseDown);
      dialog.removeEventListener('click', handleBackdropClick);
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="locked-feature-title"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-md rounded-3xl bg-white dark:bg-[#111a16] text-slate-900 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-950/65 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[70]"
    >
      {isOpen && (
        <div className="p-6 sm:p-7 text-center space-y-5">
          {/* Top Close Button */}
          <div className="flex justify-end -mt-2 -mr-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
            <Lock className="w-8 h-8 animate-bounce duration-1000" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2
              id="locked-feature-title"
              className="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-100"
            >
              {language === 'kha' ? 'Kane ka bynta ka dang khang' : 'Feature Locked'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {language === 'kha'
                ? 'Plie ia kane ka bynta hadien ba phi la wad ia ka kur/jait jong phi.'
                : 'Unlock this feature after you have searched for you kur/clan.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSearchNow) onSearchNow();
              }}
              style={{ backgroundColor: palette.primary }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'kha' ? 'Wad Kur Mynta' : 'Search Clan First'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-[#1a2a24] hover:bg-slate-200 dark:hover:bg-[#233830] text-slate-700 dark:text-slate-200 font-semibold text-sm transition cursor-pointer"
            >
              {language === 'kha' ? 'Khad' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};
