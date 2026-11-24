import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Send,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { sanitizeClanInput, sanitizeTextInput } from '../../utils/sanitize';

interface ClanReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClan?: string;
}

export interface ClanMistakeReport {
  id: string;
  clanName: string;
  relatedClan: string;
  mistakeType: string;
  description: string;
  reporterName: string;
  reporterContact: string;
  timestamp: string;
}

export const ClanReportModal: React.FC<ClanReportModalProps> = ({
  isOpen,
  onClose,
  defaultClan = ''
}) => {
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [clanName, setClanName] = useState(defaultClan);
  const [relatedClan, setRelatedClan] = useState('');
  const [mistakeType, setMistakeType] = useState('shikur_wrong');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg('');
      setClanName(defaultClan);
      setRelatedClan('');
      setDescription('');
      setReporterName('');
      setReporterContact('');
    }
  }, [isOpen, defaultClan]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanClan = sanitizeClanInput(clanName);
    const cleanRelated = sanitizeClanInput(relatedClan);
    const cleanDesc = sanitizeTextInput(description, 1000);
    const cleanName = sanitizeTextInput(reporterName, 100);
    const cleanContact = sanitizeTextInput(reporterContact, 150);

    if (!cleanClan) {
      setErrorMsg(
        language === 'kha'
          ? 'Sngewbha thoh ia ka kyrteng jong ka kur ba don jingbakla.'
          : 'Please enter the clan surname that has an error.'
      );
      return;
    }

    if (!cleanDesc || cleanDesc.length < 10) {
      setErrorMsg(
        language === 'kha'
          ? 'Sngewbha batai kham bniah ia ka jingbakla (duna eh 10 tylli ki dak).'
          : 'Please describe the error in more detail (at least 10 characters).'
      );
      return;
    }

    const report: ClanMistakeReport = {
      id: `report-${Date.now()}`,
      clanName: cleanClan,
      relatedClan: cleanRelated,
      mistakeType,
      description: cleanDesc,
      reporterName: cleanName,
      reporterContact: cleanContact,
      timestamp: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem('tipkur-clan-mistake-reports');
      const reports: ClanMistakeReport[] = existing ? JSON.parse(existing) : [];
      reports.push(report);
      localStorage.setItem('tipkur-clan-mistake-reports', JSON.stringify(reports));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    setSubmitted(true);
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] sm:w-full sm:max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#111a16] text-slate-800 dark:text-slate-100 p-0 shadow-2xl border border-slate-200 dark:border-[#1f352c] backdrop:bg-slate-900/60 backdrop:backdrop-blur-xs overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
      onClick={handleBackdropClick}
      aria-labelledby="clan-report-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-[#1f352c] bg-amber-50/50 dark:bg-[#1c2317] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="clan-report-title" className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-50">
              {language === 'kha' ? 'Ujor Jingbakla ha ka Jingïadei Kur' : 'Report Mistakes in Clan Kinship'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kha' ? 'Pyntip lada don ki jingbakla ha ka jingïateh kur / shikur' : 'Submit corrections or lineage inaccuracies for historical verification'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body / Success Screen - Only this inner container scrolls */}
      <div className="overflow-y-auto p-5 sm:p-6 flex-1">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-50">
                {language === 'kha' ? 'Khublei Shibun! La Pdiang ia ka Jingujor' : 'Thank You! Report Received'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {language === 'kha'
                  ? 'Ngin sa bishar bniah ryngkat bad ki rangbah kur bad ki kot tynrai ban pynbeit ia kane ka jingbakla.'
                  : 'Your correction report has been securely saved. It will be verified against historical records and clan elders.'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#22382f] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a2a24] transition cursor-pointer"
              >
                {language === 'kha' ? 'Ujor biang sa kawei' : 'Submit Another Report'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                {language === 'kha' ? 'Khang (Close)' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Clan with mistake */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {language === 'kha' ? 'Ka Kur / Jait ba don jingbakla:' : 'Clan with Mistake:'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                placeholder={language === 'kha' ? 'e.g. Nongkynrih, Dkhar, Laloo' : 'e.g. Nongkynrih, Dkhar, Laloo'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition"
                required
              />
            </div>

            {/* Related Clan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {language === 'kha' ? 'Ka Kur ba ïadei (Lada don):' : 'Related Clan (If applicable):'}
              </label>
              <input
                type="text"
                maxLength={100}
                value={relatedClan}
                onChange={(e) => setRelatedClan(e.target.value)}
                placeholder={language === 'kha' ? 'e.g. Diengdoh, Kharkongor' : 'e.g. Diengdoh, Kharkongor'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition"
              />
            </div>

            {/* Nature / Type of Mistake */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {language === 'kha' ? 'Ka Jait Jingbakla:' : 'Category of Error:'}
              </label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition cursor-pointer"
              >
                <option value="shikur_wrong">
                  {language === 'kha' ? 'Buh bakla kum Shikur (Incorrectly marked as Shikur)' : 'Incorrectly marked as Shikur'}
                </option>
                <option value="tehkur_wrong">
                  {language === 'kha' ? 'Buh bakla kum Teh Kur (Incorrectly marked as Teh Kur)' : 'Incorrectly marked as Teh Kur'}
                </option>
                <option value="no_relation">
                  {language === 'kha' ? 'Ym don jingïadei kur shuh (Clans should be distinct)' : 'Clans should be distinct (No kinship connection)'}
                </option>
                <option value="missing_connection">
                  {language === 'kha' ? 'Duna jingïadei ba dei ban don (Missing connection)' : 'Missing clan connection'}
                </option>
                <option value="spelling_error">
                  {language === 'kha' ? 'Jingbakla ha ka Jingthoh / Kyrteng (Spelling / Name issue)' : 'Spelling / Naming error'}
                </option>
                <option value="other">
                  {language === 'kha' ? 'Kawei pat ka jingbakla (Other)' : 'Other issue'}
                </option>
              </select>
            </div>

            {/* Explanation & Oral History / Citations */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {language === 'kha' ? 'Ka Jingbatai Bniah & Ki Kot / Parom Tynrai:' : 'Detailed Explanation & Citations/Sources:'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'kha'
                    ? 'Batai shai kiei ki jingbakla, bad lada don ki kot lane ki jingthoh na ki rangbah kur ban pynshisha...'
                    : 'Provide details on the error, including oral tradition, clan elder consensus, or published references...'
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition resize-none"
                required
              />
            </div>

            {/* Optional Reporter Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {language === 'kha' ? 'Kyrteng jong phi (Optional):' : 'Your Name (Optional):'}
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="U/Ka..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {language === 'kha' ? 'Email (Optional):' : 'Email (Optional):'}
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="contact@..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#22382f] bg-slate-50/60 dark:bg-[#16231e] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {language === 'kha' ? 'Da kaba phah ia kane ka phorm phi mynjur ban sam ia ki jingtip bad ngi.' : 'By submitting this form you consent to share the information with us.'}
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#1f352c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer"
              >
                {language === 'kha' ? 'Sangeh (Cancel)' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Phah ka Jingujor' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};
