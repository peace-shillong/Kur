import React, { useRef, useEffect, useState } from 'react';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { ClanSubmission } from '../../types';
import { X, Send, CheckCircle2, HeartHandshake } from 'lucide-react';

interface ClanSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSurname?: string;
}

export const ClanSubmitModal: React.FC<ClanSubmitModalProps> = ({ 
  isOpen, 
  onClose,
  initialSurname = ''
}) => {
  const { query } = useClan();
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [jait, setJait] = useState(initialSurname || query);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [shikurClans, setShikurClans] = useState('');
  const [tehKurClans, setTehKurClans] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialSurname || query) {
      setJait(initialSurname || query);
    }
  }, [initialSurname, query, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jait.trim()) return;

    const submission: ClanSubmission = {
      id: Date.now().toString(),
      jait: jait.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      shikurClans: shikurClans.trim(),
      tehKurClans: tehKurClans.trim(),
      notes: notes.trim(),
      submittedAt: new Date().toISOString()
    };

    // Save locally to submissions
    try {
      const existing = JSON.parse(localStorage.getItem('tipkur-user-submissions') || '[]');
      existing.push(submission);
      localStorage.setItem('tipkur-user-submissions', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="submit-clan-title"
      className="m-0 sm:m-auto w-full sm:max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-200 backdrop:bg-slate-950/50 backdrop:backdrop-blur-xs fixed bottom-0 sm:bottom-auto inset-x-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[60]"
    >
      <div className="p-6 overflow-y-auto max-h-[90vh] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 id="submit-clan-title" className="font-serif font-bold text-lg text-slate-900">
                {language === 'kha' ? 'Ai Jingtip shaphang ka Jait jong phi' : 'Submit Clan Lineage Information'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'kha' ? 'Ïarap ban pynsuk ia ka jingthoh jingtar jong ka jaitbynriew' : 'Help expand and preserve authentic community clan records'}
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

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif font-bold text-lg text-slate-900">
              {language === 'kha' ? 'Khublei shibun!' : 'Thank you!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {language === 'kha' 
                ? 'La kynshew ia ka jingtip ba phi la phah. Ngin sa peit bniah bad ki Seng Kur.' 
                : 'Your submission has been saved. We will review and incorporate it.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Surname */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider">
                {language === 'kha' ? 'Ka Jait (Surname) *' : 'Surname / Clan *'}
              </label>
              <input
                type="text"
                value={jait}
                onChange={e => setJait(e.target.value)}
                placeholder="kumba: Kharpran, Marngar..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  {language === 'kha' ? 'Kyrteng ba pura jong phi' : 'Your Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Kyrteng"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  {language === 'kha' ? 'Email jong phi' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Shikur Clans */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {language === 'kha' ? 'Ki Jait ba phi ïadei Shikur (Maternal sister clans)' : 'Shikur Clans (Comma-separated)'}
              </label>
              <input
                type="text"
                value={shikurClans}
                onChange={e => setShikurClans(e.target.value)}
                placeholder="kumba: Jait A, Jait B, Jait C..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Teh Kur Clans */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {language === 'kha' ? 'Ki Jait ba phi ïateh Kur (Covenant-bound clans)' : 'Teh Kur Clans (Comma-separated)'}
              </label>
              <input
                type="text"
                value={tehKurClans}
                onChange={e => setTehKurClans(e.target.value)}
                placeholder="kumba: Jait X, Jait Y..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Historical Notes */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {language === 'kha' ? 'Ka Parom / Ki Jingbatai shuh shuh' : 'Oral Lore or Historical Context'}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder={language === 'kha' ? 'Iathuh lem shaphang ka thymmei, ka hima ne ka shnong...' : 'Add any additional lineage or village references...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Phah ia ka Jingtip' : 'Submit Information'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};

