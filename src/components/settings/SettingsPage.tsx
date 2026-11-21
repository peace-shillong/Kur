import React, { useState } from 'react';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';
import {
  ArrowLeft,
  Palette,
  Info,
  BookOpen,
  ShieldCheck,
  FileText,
  Trash2,
  Mail,
  Globe,
  ExternalLink,
  Check,
  Heart,
  Sun,
  Moon,
  Brush,
  Link
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { clearAllAppData } = useClan();
  const { language, setLanguage } = useLanguage();
  const { themeMode, customVariant, setThemeMode, setCustomVariant, homeBg, setHomeBg } = useTheme();

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearCache = () => {
    if (window.confirm(language === 'kha' ? 'Phi sngewbha ban pynduh lut ia ki cache bad history baroh?' : 'Are you sure you want to clear all cached data, history, and settings?')) {
      clearAllAppData();
      setClearedNotice(true);
      setTimeout(() => {
        setClearedNotice(false);
        onBack();
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>{language === 'kha' ? 'Phai sha ka Jingwad Kur (Back)' : 'Back to Search'}</span>
        </button>

        <div className="text-left sm:text-right">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {language === 'kha' ? 'Ki Jingpynbeit & Jingtip' : 'Settings & Information'}
          </h1>
          <p className="text-xs text-slate-500">
            Tipkur Tipkha • App Settings
          </p>
        </div>
      </div>

      {/* SECTION 1: Theme Switcher (Light, Dark, Custom) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Palette className="w-5 h-5 text-emerald-600" />
          <h2 className="font-serif font-bold text-lg text-slate-900">
            {language === 'kha' ? 'Ka Rong (Theme) ' : 'Color Theme & Appearance'}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${themeMode === 'light'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs text-amber-500">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Light</span>
                  {themeMode === 'light' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Default crisp white theme
                </p>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${themeMode === 'dark'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                }`}
            >
              <div className="p-2 rounded-xl bg-slate-900 shadow-xs text-emerald-400">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Dark</span>
                  {themeMode === 'dark' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deep charcoal & sea-green
                </p>
              </div>
            </button>

            {/* Custom Theme */}
            <button
              type="button"
              onClick={() => setThemeMode('custom')}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${themeMode === 'custom'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                }`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs text-rose-600">
                <Brush className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Custom Palette</span>
                  {themeMode === 'custom' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Heritage woven & earth colors
                </p>
              </div>
            </button>
          </div>

          {/* Sub-palette selection if Custom is active */}
          {themeMode === 'custom' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in duration-200">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                {language === 'kha' ? 'Jied ia ka Rong ba phi sngewtynnat:' : 'Select your custom theme palette:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'heritage',
                    name: 'Khasi Heritage Woven',
                    sub: 'Rong Ryndia / Terracotta & Gold',
                    color: '#9f1239',
                    bg: '#fbf7f3'
                  },
                  {
                    id: 'forest',
                    name: 'Pine Forest & Mist',
                    sub: 'Rong Khlaw / Sohra Deep Sage',
                    color: '#15803d',
                    bg: '#f4fbf7'
                  },
                  {
                    id: 'dawki',
                    name: 'Dawki Umngot Waters',
                    sub: 'Rong Umngot / Crystal Azure',
                    color: '#0284c7',
                    bg: '#f1f8fa'
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCustomVariant(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${customVariant === item.id
                      ? 'bg-white border-slate-900 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-xs ring-2 ring-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.sub}</div>
                      </div>
                    </div>
                    {customVariant === item.id && <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language Switch */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'kha' ? 'Ka Ktien (Language Toggle):' : 'Display Language:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage('kha')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${language === 'kha'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Khasi (Ktien Khasi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${language === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Home Page Background Image Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                {language === 'kha' ? 'Dur Tyngshop jong ka Home Page (Background Image):' : 'Home Page Background Image:'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'kha' ? 'Jied ia ka dur ban buh ha trai jong ka Home Page (don parallax effect)' : 'Choose a cultural illustration placed at the bottom with a parallax effect'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: None / Blank (Default) */}
              <button
                type="button"
                onClick={() => setHomeBg('none')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${homeBg === 'none'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'kha' ? 'Khlem Dur (Blank)' : 'Blank / None'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'kha' ? 'Ka jinglong kaba khuid & jemnam' : 'Clean & minimal default'}
                  </div>
                </div>
                {homeBg === 'none' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>

              {/* Option 2: Mawbynna */}
              <button
                type="button"
                onClick={() => setHomeBg('mawbynna')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${homeBg === 'mawbynna'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Mawbynna</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'kha' ? 'Ki mawbynna & mawkren hyndai' : 'Ancient Khasi megalith stones'}
                  </div>
                </div>
                {homeBg === 'mawbynna' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>

              {/* Option 3: Jingkieng-jri */}
              <button
                type="button"
                onClick={() => setHomeBg('jingkieng-jri')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${homeBg === 'jingkieng-jri'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Jingkieng-jri</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'kha' ? 'Ki jingkieng jri ba im' : 'Living root bridge of Sohra & War'}
                  </div>
                </div>
                {homeBg === 'jingkieng-jri' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: About the App & Live Statistics */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Info className="w-5 h-5 text-emerald-600" />
          <h2 className="font-serif font-bold text-lg text-slate-900">
            {language === 'kha' ? 'Shaphang ka App' : 'About the App & Archives'}
          </h2>
        </div>

        {/* Live Statistics (Item 31 in Todo: Kurs: 5204, Connections: 114 as of Nov 2026) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-black text-emerald-800">
              5,204
            </div>
            <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              {language === 'kha' ? 'Ki Kur ba la thoh' : 'Documented Khasi Kurs'}
            </div>
            <div className="text-[11px] text-slate-500">
              As of November 2026
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-black text-emerald-800">
              114
            </div>
            <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              {language === 'kha' ? 'Ki Jingiadei (Connections)' : 'Lineage Clusters'}
            </div>
            <div className="text-[11px] text-slate-500">
              Verified Clan Connections
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {language === 'kha'
            ? 'Kane ka application ka don ka jingthmu ban pynneh pynsah ia ka dustur kyntang jong ka jaitbynriew Khasi ha kaba ia dei bad ka Tipkur Tipkha, ka Tipbriew Tipblei, bad ban pynsuk ia ka jingwad bad jingbishar ia ka Sang ka Ma.'
            : 'This application is an interactive cultural genealogy platform dedicated to preserving Khasi matrilineal kinship roots, educating future generations on exogamous customs (Ka Sang), and offering physics-driven graphs of kinship exploration.'}
        </p>

        {/* Contact Information */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            {language === 'kha' ? 'Ki Lad Jingpyntip (Contact Information):' : 'Contact Information:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Email: <a href="mailto:dkhar@kyrshan.com" className="text-emerald-800 underline font-semibold">dkhar@kyrshan.com</a></span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Website: <a href="https://kyrshan.com" target="_blank" rel="noreferrer" className="text-emerald-800 underline font-semibold">https://kyrshan.com</a></span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Credits & Data Sources */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Heart className="w-5 h-5 text-emerald-600" />
          <h2 className="font-serif font-bold text-lg text-slate-900">
            {language === 'kha' ? 'Credits & Data Source' : 'Credits & Historical Sources'}
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          {/* Tynrai */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="font-serif font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-emerald-700" />
              <span>Source of Data: Tynrai</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Clan connection datasets and historical oral citations are sourced from <a href="https://tynrai.in" target="_blank" rel="noreferrer" className="text-emerald-800 underline font-bold">Tynrai (tynrai.in)</a>, working towards comprehensive Khasi historical digital records.
            </p>
          </div>

          {/* Book Citations */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-slate-700 block">
              Literature & Historical Citations:
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li className="text-emerald-800 underline"><a href="https://archive.org/details/in.ernet.dli.2015.464609/mode/2up" target="_blank"><span>Rev. I. Kharkongngor (2004), Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi</span></a></li>
              <li className="text-emerald-800 underline"><a href="https://archive.org/details/in.ernet.dli.2015.464891/mode/2up" target="_blank">Paper (1983), <em>Ka Kolshor U Khasi</em></a></li>
              <li className='text-emerald-800 underline'><a href="https://ia601406.us.archive.org/22/items/in.ernet.dli.2015.464918/2015.464918.Ki-Khun-Ki-Ksiew-U-Hynniew-Trep_text.pdf" target="_blank"> Spiton Kharakor (1931), Ki Khun Ki Ksiew U Hynñiew Trep<em></em></a></li>
              <li className='text-emerald-800 underline'><a href="https://archive.org/stream/in.ernet.dli.2015.462529/2015.462529.The-History_djvu.txt" target="_blank">Hamlet Bareh (1964), <em>The History and Culture of the Khasi People</em></a></li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Developer:</strong> Designed and developed with modern web standards by the Kyrshanlang R. Dkhar, November 2026.
          </div>
        </div>
      </section>

      {/* SECTION 4: Clear Data & Cache Button */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-red-950 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>{language === 'kha' ? 'Pynduh lut ia ki Data & Cache' : 'Clear All Data & Cache'}</span>
            </div>
            <p className="text-xs text-red-700">
              {language === 'kha'
                ? 'Pynkhuid lut ia ki jait ba la wad, ki setting, bad ki draft submission ba la kynshew ha kane ka browser.'
                : 'Deletes local storage cache, search history, draft submissions, and resets all settings.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCache}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-sm"
          >
            {clearedNotice ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{language === 'kha' ? 'La pynkhuid!' : 'Cleared!'}</span>
              </span>
            ) : (
              <span>{language === 'kha' ? 'Pynkhuid Mynta' : 'Clear Data Now'}</span>
            )}
          </button>
        </div>
      </section>

      {/* SECTION 5: Dkhot Baibl (Bible Verse Page at the Bottom) */}
      <section className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <span>Ka Jingkheiñbriew da ki Kur (Numbers 1:2-4)</span>
        </div>

        <blockquote className="italic font-serif text-slate-800 text-sm sm:text-base leading-relaxed pl-4 border-l-4 border-amber-600 my-3">
          'U ong, “Ma me bad u Aaron phin shim ka jingkheiñbriew ïa ki paid Israel da ki kur ki kur bad ki longïing longsem. Thoh ïa ki kyrteng jong ki rangbah baroh kiba arphew snem lane kiba kham heh rta kiba bit na ka bynta ka kam shipai. Khot uwei u rangbah kur na kawei pa kawei ka jait, ban ïarap ïa phi.” '
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold pt-2 text-amber-950 gap-2 border-t border-amber-200">
          <span>JINGKHEIÑ 1:2-4</span>
          <a
            href="https://www.bible.com/bible/1865/NUM.1.2-4.KHACLBSI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 underline"
          >
            <span>Pule ia ka dkhot pura ha Bible.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* FOOTER OF SETTINGS PAGE: Privacy Policy and Terms Modals Links */}
      <footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <span>•</span>

          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service & Disclaimer</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Kur Web App• November 2026
        </div>
      </footer>

      {/* Modals for Privacy and Terms */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

    </div>
  );
};

