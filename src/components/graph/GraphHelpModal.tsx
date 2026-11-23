import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  HelpCircle,
  Smartphone,
  Monitor,
  Move,
  ZoomIn,
  MousePointerClick,
  Hand,
  Maximize2,
  Table as TableIcon
} from 'lucide-react';

interface GraphHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraphHelpModal: React.FC<GraphHelpModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Sync with native <dialog>
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

  // Lock outer background body scrolling on Desktop/Mobile when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInside = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInside) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#111a16] text-slate-800 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-900/60 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
      onClick={handleBackdropClick}
      aria-labelledby="graph-help-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-[#1f352c] bg-slate-50/70 dark:bg-[#16231e] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="graph-help-title" className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-50">
              {language === 'kha' ? 'Jingbatai Kumno ban Pyndonkam ia ka Graph' : 'Clan Graph Navigation & Controls'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kha' ? 'Ki hand gestures (Mobile) & mouse events (Desktop)' : 'Hand gestures for mobile & mouse controls for desktop'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer"
          aria-label="Close Help"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body - Only this inner container scrolls */}
      <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">

        {/* SECTION 1: Mobile Hand Gestures */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <Smartphone className="w-4 h-4" />
            <span>{language === 'kha' ? 'Ha Mobile (Hand Gestures)' : 'Mobile Devices (Hand Gestures)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Tap Node */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <Hand className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Tba ha ka Node Kur (Tap)' : 'Tap on Clan Node'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Plie ia ka jingtip shaphang katei ka kur bad plie ia ka bottom sheet.'
                    : 'Selects the clan node and opens the detail bottom sheet.'}
                </p>
              </div>
            </div>

            {/* Drag/Swipe to Pan */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <Move className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Ring / Tan da ka shympriahkti (Pan)' : 'Swipe / Drag Canvas'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Pynkhih ia ka dur jong ka graph sha kano kano ka liang ban wad ia kiwei ki kur.'
                    : 'Pan around the graph to explore distant clusters and connections.'}
                </p>
              </div>
            </div>

            {/* Pinch Zoom */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <ZoomIn className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Pinch ban Pynheh / Pynrit (Zoom)' : 'Pinch to Zoom In / Out'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Pynheh lane pynrit ia ka view da kaba pynkhim lane pyniar da ar tylli ki shympriahkti.'
                    : 'Pinch two fingers together or apart to zoom in or zoom out.'}
                </p>
              </div>
            </div>

            {/* Bottom Sheet Drag */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Ring ia ka Bottom Sheet' : 'Drag Bottom Sheet'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Tan sha neng ban pynheh sha ka shiteng screen, lane tan shapoh ban khang noh ia ka.'
                    : 'Drag upward to expand up to half the screen, or drag down to dismiss.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Desktop Mouse Events */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <Monitor className="w-4 h-4" />
            <span>{language === 'kha' ? 'Ha Desktop & Laptop (Mouse Controls)' : 'Desktop & Laptop (Mouse Events)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Left Click */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Left Click' : 'Left Click on Node'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Nion ha kano kano ka node kur ban plie ia ka modal bad peit ia ki jingiadei kur.'
                    : 'Click any clan node to focus and open full lineage details.'}
                </p>
              </div>
            </div>

            {/* Click & Drag */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <Move className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Click & Drag (Ring ia ka Canvas)' : 'Click & Drag to Pan'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Nion ia u mouse bad ring ban pynkhih ia ka graph canvas.'
                    : 'Hold left click on empty canvas to pan around the graph space smoothly.'}
                </p>
              </div>
            </div>

            {/* Scroll Wheel Zoom */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <ZoomIn className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Scroll Wheel (Pynheh / Pynrit)' : 'Mouse Scroll Wheel'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Pynkhih ia ka wheel jong u mouse shaphrang ban pynheh, lane shadien ban pynrit.'
                    : 'Roll wheel forward to zoom in closely; roll backward to see the full cluster.'}
                </p>
              </div>
            </div>

            {/* Floating Dock Features */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16231e] border border-slate-200/80 dark:border-[#22382f] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-[#1a2b25] shadow-xs text-emerald-700 dark:text-emerald-400 shrink-0">
                <TableIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Ki Button ha ka Mon (Dock)' : 'Floating Side Dock'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {language === 'kha'
                    ? 'Kylla sha ka Table View ban peit bad nion ha ki row, lane sam ia ka dur sha WhatsApp.'
                    : 'Switch to Table View with clickable rows, or share graph image to WhatsApp.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-[#1f352c] bg-slate-50/70 dark:bg-[#16231e] flex items-center justify-end shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
        >
          {language === 'kha' ? 'Sngewthuh / Khang' : 'Got it / Close'}
        </button>
      </div>
    </dialog>
  );
};
