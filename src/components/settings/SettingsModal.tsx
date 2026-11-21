import React, { useRef, useEffect, useState } from 'react';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  X, 
  Settings, 
  Palette, 
  Info, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Mail, 
  Globe, 
  Sparkles,
  ExternalLink,
  Heart,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { clearAllAppData } = useClan();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [activeTab, setActiveTab] = useState<'about' | 'theme' | 'bible' | 'credits' | 'privacy' | 'terms'>('about');
  const [clearedNotice, setClearedNotice] = useState(false);

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

  const handleClearCache = () => {
    if (window.confirm(language === 'kha' ? 'Phi sngewbha ban pynduh lut ia ki cache bad history baroh?' : 'Are you sure you want to clear all cached data, history, and settings?')) {
      clearAllAppData();
      setClearedNotice(true);
      setTimeout(() => {
        setClearedNotice(false);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="settings-title"
      className="m-0 sm:m-auto w-full sm:max-w-2xl max-h-[90vh] sm:rounded-3xl rounded-t-3xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-200 backdrop:bg-slate-950/50 backdrop:backdrop-blur-xs fixed bottom-0 sm:bottom-auto inset-x-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[60]"
    >
      <div className="flex flex-col h-[85vh] sm:h-[680px]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-title" className="font-serif font-bold text-lg text-slate-900">
                {language === 'kha' ? 'Ki Jingpynbeit & Jingtip' : 'Settings & Information'}
              </h2>
              <p className="text-xs text-slate-500">
                Tipkur Tipkha App Settings
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-100 overflow-x-auto text-xs font-semibold bg-slate-50/60 shrink-0">
          {[
            { id: 'about', label: language === 'kha' ? 'Shaphang ka App' : 'About App', icon: Info },
            { id: 'bible', label: language === 'kha' ? 'Dkhot Baibl' : 'Bible Verse', icon: BookOpen },
            { id: 'theme', label: language === 'kha' ? 'Theme & Ktien' : 'Theme & Lang', icon: Palette },
            { id: 'credits', label: language === 'kha' ? 'Credits & Tynrai' : 'Credits', icon: Heart },
            { id: 'privacy', label: language === 'kha' ? 'Privacy' : 'Privacy', icon: ShieldCheck },
            { id: 'terms', label: language === 'kha' ? 'Terms & Disclaimer' : 'Terms', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          
          {/* TAB 1: About the App & Contact */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Tipkur Tipkha Platform</span>
                </div>
                <p className="leading-relaxed text-xs sm:text-sm text-slate-700">
                  {language === 'kha'
                    ? 'Kane ka dei ka web application ba la shna khnang na ka bynta ban kynshew, wad, bad bishar ia ki thied ki kur, ki shikur, ki teh kur bad ka dustur Tipkur Tipkha jong ka jaitbynriew Khasi.'
                    : 'A modern bilingual genealogy platform dedicated to preserving, navigating, and respecting traditional Khasi matrilineal kinship bonds (Tipkur Tipkha) and customary exogamous principles.'}
                </p>
              </div>

              {/* Statistics (Item 31 in Todo: Kurs: 5204, Connections: 114 as of Nov 2026) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-800">
                    5,204
                  </div>
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {language === 'kha' ? 'Ki Kur ba la thoh' : 'Documented Kurs'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    As of November 2026
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-800">
                    114
                  </div>
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {language === 'kha' ? 'Ki Jingiadei (Connections)' : 'Clan Connections'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Documented Clusters
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 pt-2">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {language === 'kha' ? 'Ki Lad Jingkynpham / Contact Information' : 'Contact & Community Feedback'}
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    <span>Email: <a href="mailto:contact@kyrshan.com" className="text-emerald-700 underline font-medium">contact@kyrshan.com</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    <span>Website: <a href="https://kur.kyrshan.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">https://kur.kyrshan.com</a></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Bible Verse Page (Item 24 & 26-29 in Todo) */}
          {activeTab === 'bible' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                  <span>Ka Jingkheiñbriew da ki Kur (Numbers 1:2-4)</span>
                </div>

                <blockquote className="italic font-serif text-slate-800 text-sm sm:text-base leading-relaxed pl-4 border-l-3 border-amber-600 my-2">
                  'U ong, “Ma me bad u Aaron phin shim ka jingkheiñbriew ïa ki paid Israel da ki kur ki kur bad ki longïing longsem. Thoh ïa ki kyrteng jong ki rangbah baroh kiba arphew snem lane kiba kham heh rta kiba bit na ka bynta ka kam shipai. Khot uwei u rangbah kur na kawei pa kawei ka jait, ban ïarap ïa phi.” '
                </blockquote>

                <div className="flex items-center justify-between text-xs font-semibold pt-1 text-amber-950">
                  <span>JINGKHEIÑ 1:2-4</span>
                  <a 
                    href="https://www.bible.com/bible/1865/NUM.1.2-4.KHACLBSI" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-800 hover:underline"
                  >
                    <span>Pule ha Bible.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                Naduh hyndai hynthai, ka jingkheiñ bad ka jingkynshew ia ki jait ki kur ka dei ka kambah ba kyntang kaba pynsah ia ka nongrim jong ka longïing longsem bad ka burom jong ka jaitbynriew.
              </p>
            </div>
          )}

          {/* TAB 3: Theme Switch & Language (Item 33 in Todo) */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {language === 'kha' ? 'Ka Rong ka Phang (Theme Switch)' : 'App Theme Color'}
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'light', label: 'White / Light (Default)' },
                    { id: 'earth', label: 'Sea-Green Earth' },
                    { id: 'dark', label: 'Dark Mode' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTheme(m.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-semibold transition text-center cursor-pointer ${
                        theme === m.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {language === 'kha' ? 'Ka Ktien (Language)' : 'Display Language'}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('kha')}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition text-center cursor-pointer ${
                      language === 'kha'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Khasi (Ktien Khasi)
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition text-center cursor-pointer ${
                      language === 'en'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Credits & Data Sources (Item 24 in Todo) */}
          {activeTab === 'credits' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-serif font-bold text-sm text-slate-900">
                    Source of Data: Tynrai
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Genealogical and clan linkage archives are proudly sourced from <a href="https://tynrai.in" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">Tynrai (tynrai.in)</a>, dedicated to authentic Khasi historical documentation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-serif font-bold text-sm text-slate-900">
                    Literature & Book Citations
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Rev. I. Kharkongngor (2004), <em>Ka Kolshor bad ki Kur Khasi</em></li>
                    <li>Medro Singh Diengdoh, <em>Genealogical Records of Ka Ïaw Shi Bdi</em></li>
                    <li>Dr. H. Lyngdoh (1961), <em>Ka Niam Khasi bad Ki Kur</em></li>
                    <li>H. Bareh (1985), <em>The History and Culture of the Khasi People</em></li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-serif font-bold text-sm text-slate-900">
                    Developer & Technology
                  </div>
                  <p className="text-xs text-slate-600">
                    Built with React, D3.js, Vite & Modern Web Guidelines by the Kur App Development Team (<a href="https://kur.kyrshan.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline">https://kur.kyrshan.com</a>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Privacy Policy (Item 35 in Todo) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Privacy and Data Collection Policy</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  "We do not collect any user data. Please do not submit sensitive information in the app."
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p>
                  • All search inquiries, language selections, and graph interaction preferences are processed locally within your browser's private memory and <code>localStorage</code>.
                </p>
                <p>
                  • No tracking cookies or telemetry analytics profile your lineage inquiries.
                </p>
                <p>
                  • Any clan submissions through the voluntary information form are stored solely for editorial review and are never sold or shared with commercial entities.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: Terms & Disclaimer (Item 37, 39 & Clear Data in Todo) */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  Terms of Service & Cultural Disclaimer
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p>
                    <strong>Customary Advisory:</strong> This tool is an informational and cultural aid. Final authority on traditional marriage customs, genealogical lineage, and <em>Ka Sang</em> rests solely with your <strong>Longkñi (maternal clan elders)</strong>, clan councils, and registered <strong>Seng Kur</strong> bodies.
                  </p>
                  <p>
                    The data presented is synthesized from recognized historical literature and oral traditions. While every effort is made for utmost historical precision, oral lineages across different Khasi districts (Ri-Bhoi, War, Maram, Sohra, Jaiñtia) can have localized nuances.
                  </p>
                </div>
              </div>

              {/* Clear Data & Cache Button (Item 22 in Todo) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold text-red-950 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span>{language === 'kha' ? 'Pynduh lut ia ki Data & Cache' : 'Clear All Data & Cache'}</span>
                    </div>
                    <p className="text-[11px] text-red-700">
                      {language === 'kha' 
                        ? 'Pynkhuid lut ia ki jait ba la wad shen, ki settings bad ki submission ba la kynshew.' 
                        : 'Wipes all local storage, recent lookups, draft submissions, and saved state.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer shrink-0"
                  >
                    {clearedNotice ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'kha' ? 'La pynkhuid!' : 'Cleared!'}</span>
                      </span>
                    ) : (
                      <span>{language === 'kha' ? 'Pynkhuid Mynta' : 'Clear Data Now'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[11px] text-slate-400">
            Tipkur Tipkha v1.2 • November 2026
          </span>
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
