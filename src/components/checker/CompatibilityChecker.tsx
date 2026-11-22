import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useClan } from '../../context/ClanContext';
import { checkBisharSang } from '../../services/api';
import { BisharSangResponse, Level3CheckItem } from '../../types';
import {
  HeartHandshake,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Loader2,
  HelpCircle,
  Users,
  GitBranch,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const CompatibilityChecker: React.FC = () => {
  const { language } = useLanguage();
  const { primarySurname } = useClan();

  // Wizard Steps:
  // 1 = Level 1 Input (Maternal Clan Check)
  // 2 = Level 1 Result
  // 3 = Level 2 Input (Paternal / Other Parent's Clan Check)
  // 4 = Level 2 Result (Combined Level 1 & 2)
  // 5 = Level 3 Input (Cousin Relation Link / Khun u Kñii)
  // 6 = Level 3 Result (Combined Level 1, 2 & 3)
  // 7 = Level 4 Overview & Family Tree / Traditional Guidance
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Inputs
  const [person1Clan, setPerson1Clan] = useState<string>(() => primarySurname || 'Nongkynrih');
  const [person2Clan, setPerson2Clan] = useState<string>('Nongbri');
  const [fatherClan, setFatherClan] = useState<string>('');
  const [kniiClansInput, setKniiClansInput] = useState<string>('');

  // Results State
  const [loading, setLoading] = useState<boolean>(false);
  const [level1Result, setLevel1Result] = useState<BisharSangResponse | null>(null);
  const [level2Result, setLevel2Result] = useState<BisharSangResponse | null>(null);
  const [level3Results, setLevel3Results] = useState<Level3CheckItem[]>([]);

  // Authentic test preset pairings from docs/iashongkha *.json
  const presets = [
    {
      p1: 'Nongkynrih',
      p2: 'Nongbri',
      badge: 'Sang (Prohibited)',
      descKhasi: 'Kajuh ka Kpoh / Shikur (Sang)',
      descEnglish: 'Same Clan Lineage (Sang)'
    },
    {
      p1: 'Nongbsap Pyrtuh',
      p2: 'Mylliem Pyrtuh',
      badge: 'Ym Sang (Distinct)',
      descKhasi: 'Pher ki kur (Bit ban ïashongkha)',
      descEnglish: 'Distinct Clans (Permitted)'
    },
    {
      p1: 'Nongkynrih',
      p2: 'Nongrum',
      badge: 'Needs Verify',
      descKhasi: 'Ym shem jingïateh (Kylli Longkñii)',
      descEnglish: 'Unmapped (Verify Kinship)'
    },
    {
      p1: 'Diengdoh',
      p2: 'Laloo',
      badge: 'Shikur (Sang)',
      descKhasi: 'Shikur Ïaw Shi Bdi (Sang)',
      descEnglish: 'Sister Clan (Sang)'
    },
    {
      p1: 'Diengdoh',
      p2: 'Syngngai',
      badge: 'Teh Kur (Sang)',
      descKhasi: 'Ïateh Kur ha Sohra (Sang)',
      descEnglish: 'Covenant Bound (Sang)'
    }
  ];

  // Helper: check if a response indicates a matrimonial taboo
  const isSang = (res?: BisharSangResponse | null) => res?.verdict === 'SANG_PROHIBITED';
  const isClear = (res?: BisharSangResponse | null) => res?.verdict === 'DISTINCT_CLANS';

  // Level 1: Direct Maternal Clan Check (Para-ar-kmie)
  const handleLevel1Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!person1Clan.trim() || !person2Clan.trim()) return;

    setLoading(true);
    try {
      const res = await checkBisharSang(person1Clan.trim(), person2Clan.trim());
      setLevel1Result(res);
      setCurrentStep(2);
    } catch (err) {
      console.error('Error running Level 1 check:', err);
    } finally {
      setLoading(false);
    }
  };

  // Level 2: Paternal / Other Parent's Clan Check (Kur u Kpa & Ai Khaw Kylliang)
  const handleLevel2Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fatherClan.trim()) return;

    setLoading(true);
    try {
      const res = await checkBisharSang(fatherClan.trim(), person2Clan.trim());
      setLevel2Result(res);
      setCurrentStep(4);
    } catch (err) {
      console.error('Error running Level 2 check:', err);
    } finally {
      setLoading(false);
    }
  };

  // Level 3: Cousin Relation Link Check (Shi-Parakha & Sohpet-Parakha / Khun u Kñii)
  const handleLevel3Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clans = kniiClansInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (clans.length === 0) return;

    setLoading(true);
    try {
      const results: Level3CheckItem[] = [];
      for (const clan of clans) {
        const res = await checkBisharSang(clan, person2Clan.trim());
        results.push({ kñiiClan: clan, response: res });
      }
      setLevel3Results(results);
      setCurrentStep(6);
    } catch (err) {
      console.error('Error running Level 3 check:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCurrentStep(1);
    setLevel1Result(null);
    setLevel2Result(null);
    setLevel3Results([]);
    setFatherClan('');
    setKniiClansInput('');
  };

  // Modern Web Guidance: IME-safe Enter handling
  const handleKeyDown = (event: React.KeyboardEvent, submitFn: () => void) => {
    if (event.key === 'Enter') {
      if (event.nativeEvent.isComposing || (event.nativeEvent as any).keyCode === 229) {
        return;
      }
      event.preventDefault();
      submitFn();
    }
  };

  // Render verdict card helper
  const renderVerdictCard = (res: BisharSangResponse, subtitlePrefix?: string) => {
    const prohibited = isSang(res);
    const clear = isClear(res);

    return (
      <div
        className={`p-5 rounded-3xl border-2 space-y-3 transition-all ${
          prohibited
            ? 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
            : clear
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
            : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5">
            {prohibited ? (
              <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
            ) : clear ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider block">
                {prohibited
                  ? 'KA SANG (PROHIBITED)'
                  : clear
                  ? 'YM DEI KA JUH KA KUR (DISTINCT CLANS)'
                  : 'DONKAM JINGBATAI KI TYMMEN (VERIFY)'}
              </span>
              <span className="text-xs opacity-80">
                {subtitlePrefix ? `${subtitlePrefix}: ` : ''}
                {res.jait_a} & {res.jait_b}
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
              prohibited
                ? 'bg-red-200 dark:bg-red-900/80 text-red-900 dark:text-red-200'
                : clear
                ? 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
            }`}
          >
            {prohibited ? 'Kim bit ban shongkha' : clear ? 'Bit ban ïashongkha' : 'Kylli na ki Longkñii'}
          </span>
        </div>

        {/* Cluster if present */}
        {res.cluster && (
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>
              {language === 'kha' ? 'Ka Tyngshop / Cluster:' : 'Lineage Cluster:'} {res.cluster}
            </span>
          </div>
        )}

        {/* Description / Reasons */}
        <p className="text-xs sm:text-sm leading-relaxed opacity-95">
          {language === 'kha' ? res.reason_khasi : res.reason_english}
        </p>

        {/* Citation Source */}
        {res.citation && (
          <div className="text-[11px] opacity-75 italic pt-1 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'kha' ? 'Tynrai Jingtip:' : 'Source Citation:'} {res.citation}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Tipkur Tipkha • 4-Level Traditional Kinship Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
          {language === 'kha' ? 'Bishar ïa ka Sang ka Ma' : 'Traditional Marriage Compatibility Checker'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          {language === 'kha'
            ? 'Bishar bniah ha ki 4 tylli ki kyrdan katkum ka niam ka rukom Khasi (Para-ar-kmie, Shi-Parakha, Sohpet-Parakha, Ïakiew Ïahiar)'
            : 'Multi-step verification rooted in traditional Khasi exogamy laws across all four maternal, paternal, cousin, and family tiers'}
        </p>
      </div>

      {/* 4-Level Interactive Step Indicator */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium">
        {/* Step 1 Pill */}
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all ${
            currentStep >= 1 && currentStep <= 2
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : currentStep > 2
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-[#15221d] text-slate-500 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <span className="font-bold">Lvl 1</span>
          <span className="truncate w-full text-[10px] sm:text-[11px]">
            {language === 'kha' ? 'Para-ar-kmie' : 'Maternal'}
          </span>
        </div>

        {/* Step 2 Pill */}
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all ${
            currentStep >= 3 && currentStep <= 4
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : currentStep > 4
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-[#15221d] text-slate-500 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <span className="font-bold">Lvl 2</span>
          <span className="truncate w-full text-[10px] sm:text-[11px]">
            {language === 'kha' ? 'Kur u Kpa' : 'Paternal'}
          </span>
        </div>

        {/* Step 3 Pill */}
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all ${
            currentStep >= 5 && currentStep <= 6
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : currentStep > 6
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-[#15221d] text-slate-500 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <span className="font-bold">Lvl 3</span>
          <span className="truncate w-full text-[10px] sm:text-[11px]">
            {language === 'kha' ? 'Khun u Kñii' : 'Cousins'}
          </span>
        </div>

        {/* Step 4 Pill */}
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all ${
            currentStep === 7
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-slate-100 dark:bg-[#15221d] text-slate-500 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <span className="font-bold">Lvl 4</span>
          <span className="truncate w-full text-[10px] sm:text-[11px]">
            {language === 'kha' ? 'Ïakiew Ïahiar' : 'Family Tree'}
          </span>
        </div>
      </div>

      {/* Main Flow Card */}
      <div className="bg-white dark:bg-[#111a16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#1f352c] shadow-xl transition-all">
        <AnimatePresence mode="wait">
          {/* STEP 1: Level 1 Input (Direct Maternal Clan Check) */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-sans">
                    1
                  </span>
                  <span>
                    {language === 'kha'
                      ? 'Kyrdan 1: Para-ar-kmie (Bishar na ka Jait Kmie)'
                      : 'Level 1: Para-ar-kmie (Direct Maternal Clan Check)'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'kha'
                    ? 'Ki khun jong ki para kynthei ka kmie (Meisan, Meinah, Meiduh) ki dei shipara-trai na kajuh ka kpoh. Ka long kaba Sang ban ïashongkha.'
                    : 'Maternal parallel cousins and sister clans share identical matrilineal descent. Matrimonial union is strictly taboo.'}
                </p>
              </div>

              <form onSubmit={handleLevel1Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="p1-clan-input"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      {language === 'kha' ? 'Ka Jait u/ka Ba-nyngkong *' : 'Person 1 Surname (Jait) *'}
                    </label>
                    <input
                      id="p1-clan-input"
                      type="text"
                      value={person1Clan}
                      onChange={e => setPerson1Clan(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, () => handleLevel1Submit())}
                      placeholder={language === 'kha' ? 'kumba: Nongkynrih' : 'e.g. Nongkynrih'}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-300 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="p2-clan-input"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      {language === 'kha' ? 'Ka Jait u/ka Ba-ar *' : 'Person 2 Surname (Jait) *'}
                    </label>
                    <input
                      id="p2-clan-input"
                      type="text"
                      value={person2Clan}
                      onChange={e => setPerson2Clan(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, () => handleLevel1Submit())}
                      placeholder={language === 'kha' ? 'kumba: Nongbri' : 'e.g. Nongbri'}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-300 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Preset Pairings based on docs/curl.md and docs/iashongkha *.json */}
                <div className="pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    {language === 'kha' ? 'Pyrshang da kine ki jait:' : 'Try authentic test pairings:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map(p => (
                      <button
                        key={`${p.p1}-${p.p2}`}
                        type="button"
                        onClick={() => {
                          setPerson1Clan(p.p1);
                          setPerson2Clan(p.p2);
                        }}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#15221d] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 transition border border-slate-200 dark:border-slate-800 cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="font-semibold">{p.p1} & {p.p2}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          {p.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading || !person1Clan.trim() || !person2Clan.trim()}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold shadow-md shadow-emerald-700/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{language === 'kha' ? 'Dang bishar ia ka jait...' : 'Verifying Clan Lineage...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'kha' ? 'Bishar ia ka Kyrdan 1' : 'Verify Level 1 Compatibility'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Level 1 Result Card */}
          {currentStep === 2 && level1Result && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'kha' ? 'Ka Jingmih na ka Kyrdan 1 (Maternal)' : 'Level 1 Verification Verdict'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#15221d] text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-[#1f352c]">
                  {level1Result.jait_a} & {level1Result.jait_b}
                </span>
              </div>

              {/* Render Verdict Banner */}
              {renderVerdictCard(level1Result, language === 'kha' ? 'Kyrdan 1' : 'Level 1')}

              {/* Decision Rules per docs/5. Ka Sang ka ma ha ka shongkha shongman.md:
                  "if a match exists do not allow to proceed to next Level" */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isSang(level1Result) ? (
                  // SANG MATCH: Stop user from advancing to next levels!
                  <div className="w-full space-y-3">
                    <div className="p-3.5 rounded-2xl bg-red-100/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-900 dark:text-red-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                      <span>
                        {language === 'kha'
                          ? 'Ka jingiadei kur ka la thikna ha ka Kyrdan 1. Ha ka niam Khasi ym bit ban bteng shuh sha kiwei ki kyrdan namar ka long ka Sang.'
                          : 'Maternal clan taboo identified in Level 1. In traditional Khasi custom, further checks are discontinued.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="w-full py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Bishar biang da kiwei pat ki jait' : 'Check Another Pairing'}</span>
                    </button>
                  </div>
                ) : (
                  // DISTINCT / VERIFY: Allow user to proceed to Level 2
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                    >
                      <span>
                        {language === 'kha'
                          ? 'Leit sha ka Kyrdan 2 (Kur u Kpa)'
                          : 'Continue to Level 2 (Paternal Check)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-medium transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Bishar biang' : 'Reset'}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Level 2 Input (Paternal Lineage - Kur u Kpa & Ai Khaw Kylliang) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-sans">
                    2
                  </span>
                  <span>
                    {language === 'kha'
                      ? 'Kyrdan 2: Kur u Kpa & Ai Khaw Kylliang (Paternal Lineage)'
                      : 'Level 2: Kur u Kpa & Ai Khaw Kylliang (Paternal Lineage)'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'kha'
                    ? 'Ym bit ban shongkha ïa ki para-kur u kpa (Ñiakha) katba u kpa u dang kam trai. Kaba shongkha ïa ki khun ka Ñiakha-trai ban pynroi jait sha ka kur u kpa la khot "Ai khaw kylliang" bad ym ju bit katba dang im u kpa.'
                    : 'No marriage with your paternal side or father\'s clan or with your aunt\'s children, while your father is still alive and well.'}
                </p>
              </div>

              <form onSubmit={handleLevel2Submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="father-clan-input"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    {language === 'kha'
                      ? `Ka jait u kpa jong u/ka ${person1Clan} *`
                      : `Person 1's Father's Surname (${person1Clan}) *`}
                  </label>
                  <input
                    id="father-clan-input"
                    type="text"
                    value={fatherClan}
                    onChange={e => setFatherClan(e.target.value)}
                    onKeyDown={e => handleKeyDown(e, () => handleLevel2Submit())}
                    placeholder={language === 'kha' ? 'kumba: Nongkynrih' : 'e.g. Nongkynrih'}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-300 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                    autoFocus
                  />
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'kha'
                      ? `Bishar la ka jait u kpa jong u/ka ${person1Clan} ka iadei kur bad ka jait ${person2Clan}.`
                      : `Checking if ${person1Clan}'s paternal lineage has clan ties with ${person2Clan}.`}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading || !fatherClan.trim()}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{language === 'kha' ? 'Dang bishar ia ka jait u kpa...' : 'Checking Paternal Lineage...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'kha' ? 'Bishar ia ka Kyrdan 2' : 'Run Level 2 Paternal Check'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                  >
                    {language === 'kha' ? 'Shadien' : 'Back'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: Combined Level 1 + Level 2 Result */}
          {currentStep === 4 && level1Result && level2Result && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'kha' ? 'Ka Jingbishar Kyrdan 1 & 2' : 'Combined Level 1 & Level 2 Verification'}
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                  {person1Clan} & {person2Clan}
                </h4>
              </div>

              {/* Level 1 Summary */}
              {renderVerdictCard(level1Result, language === 'kha' ? 'Kyrdan 1 (Maternal)' : 'Level 1 (Maternal)')}

              {/* Level 2 Summary */}
              {renderVerdictCard(level2Result, language === 'kha' ? `Kyrdan 2 (Paternal: ${fatherClan})` : `Level 2 (Paternal: ${fatherClan})`)}

              {/* Rules per docs/5. Ka Sang ka ma ha ka shongkha shongman.md:
                  "if level 2 doesn't clear then do not allow to proceed to next Level" */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isSang(level2Result) ? (
                  // LEVEL 2 FAILED (Paternal Sang): Stop user from advancing!
                  <div className="w-full space-y-3">
                    <div className="p-3.5 rounded-2xl bg-red-100/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-900 dark:text-red-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                      <span>
                        {language === 'kha'
                          ? 'Ka jingiadei Sang u Kpa (Kha trai / Ai khaw kylliang) ka la mih ha ka Kyrdan 2. Ym bit ban bteng sha ka Kyrdan 3.'
                          : 'Paternal Sang prohibition detected in Level 2. In traditional custom, advancement to Level 3 is prohibited.'}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                      >
                        {language === 'kha' ? 'Kylla jait kpa' : 'Edit Father\'s Clan'}
                      </button>
                      <button
                        type="button"
                        onClick={resetAll}
                        className="py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // LEVEL 2 CLEARED: Allow user to proceed to Level 3
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                    >
                      <span>
                        {language === 'kha'
                          ? 'Leit sha ka Kyrdan 3 (Khun u Kñii)'
                          : 'Continue to Level 3 (Cousin Link Check)'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-medium transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Bishar biang' : 'Reset'}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Level 3 Input (Cousin Relation Link - Shi-Parakha & Sohpet-Parakha / Khun u Kñii) */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-sans">
                    3
                  </span>
                  <span>
                    {language === 'kha'
                      ? 'Kyrdan 3: Shi-Parakha & Sohpet-Parakha (Ka Jait ki Khun u Kñii)'
                      : 'Level 3: Shi-Parakha & Sohpet-Parakha (Cousin Relation Link)'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'kha'
                    ? 'Ki khun jong u Kñii (maternal uncle\'s children) bad ki khun jong ki Pyrsa-kha (cousins from paternal side) kim bit ban ïashongkha. Thoh ia ka jait ki khun u kñii (lah ban thoh palat ban kawei da kaba pynbynta da ka comma).'
                    : 'Sohpet-Parakha: Maternal uncle\'s children and paternal cross-cousins cannot intermarry. Enter maternal uncle\'s children\'s surname(s) (comma-separated list supported).'}
                </p>
              </div>

              <form onSubmit={handleLevel3Submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="knii-clans-input"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    {language === 'kha'
                      ? 'Ka jait ki khun u kñii (Maternal Uncle\'s Children Surname) *'
                      : 'Maternal Uncle\'s Children\'s Surname(s) *'}
                  </label>
                  <input
                    id="knii-clans-input"
                    type="text"
                    value={kniiClansInput}
                    onChange={e => setKniiClansInput(e.target.value)}
                    onKeyDown={e => handleKeyDown(e, () => handleLevel3Submit())}
                    placeholder={language === 'kha' ? 'kumba: Mawlong, Pyngrope, Kharbuki' : 'e.g. Mawlong, Pyngrope, Kharbuki'}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-300 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                    autoFocus
                  />
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'kha'
                      ? 'Lada don bun ki jait, pynbynta da ka comma (,). Ka app kan bishar ia kawei pa kawei ka jait pyrshah ia ka jait ba-ar.'
                      : 'Enter one surname or comma-separated list. Each surname will be verified individually against Person 2\'s clan.'}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading || !kniiClansInput.trim()}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{language === 'kha' ? 'Dang bishar ia ki jait khun u kñii...' : 'Checking Uncle\'s Children Surnames...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'kha' ? 'Bishar ia ka Kyrdan 3' : 'Run Level 3 Cousin Check'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                  >
                    {language === 'kha' ? 'Shadien' : 'Back'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 6: Level 3 Results Breakdown */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'kha' ? 'Ka Jingmih Kyrdan 3 (Sohpet-Parakha)' : 'Level 3 Cousin Relations Breakdown'}
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Ki Jait Khun u Kñii' : 'Maternal Uncle\'s Lineages'} vs {person2Clan}
                </h4>
              </div>

              {/* List of checked uncle surnames */}
              <div className="space-y-3">
                {level3Results.map((item, idx) => (
                  <div key={idx}>
                    {renderVerdictCard(
                      item.response,
                      `${language === 'kha' ? 'Khun u Kñii' : 'Uncle Child'} #${idx + 1} (${item.kñiiClan})`
                    )}
                  </div>
                ))}
              </div>

              {/* Check if any uncle surname has Sang */}
              {(() => {
                const hasLevel3Sang = level3Results.some(item => isSang(item.response));

                return (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {hasLevel3Sang ? (
                      // LEVEL 3 FAILED: Do not allow to proceed to Level 4
                      <div className="w-full space-y-3">
                        <div className="p-3.5 rounded-2xl bg-red-100/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-900 dark:text-red-300 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                          <span>
                            {language === 'kha'
                              ? 'Ka don ka jingiadei Sang Sohpet-Parakha bad ka jait ba la thoh. Katkum ka rukom Khasi ym bit ban bteng sha ka Kyrdan 4.'
                              : 'Sohpet-Parakha taboo detected among the uncle\'s lineages. Advance to Level 4 is prohibited.'}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(5)}
                            className="flex-1 py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                          >
                            {language === 'kha' ? 'Kylla ia ki jait' : 'Edit Uncle Surnames'}
                          </button>
                          <button
                            type="button"
                            onClick={resetAll}
                            className="py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // LEVEL 3 CLEARED: Allow user to proceed to Level 4
                      <>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(7)}
                          className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                        >
                          <span>
                            {language === 'kha'
                              ? 'Leit sha ka Kyrdan 4 (Ïakiew Ïahiar & Family Tree)'
                              : 'Proceed to Level 4 (Family Tree Link)'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={resetAll}
                          className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-[#15221d] hover:bg-slate-200 dark:hover:bg-[#1f352c] text-slate-700 dark:text-slate-300 font-medium transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-[#1f352c]"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{language === 'kha' ? 'Bishar biang' : 'Reset'}</span>
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* STEP 7: Level 4 (Family Tree Link & Formal Discussions - Ïakiew Ïahiar & Khleh Shynrang-Kynthei) */}
          {currentStep === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Top Milestone Banner */}
              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-emerald-950 dark:text-emerald-100">
                  {language === 'kha' ? 'La dep bishar ia ki 3 tylli ki Kyrdan!' : 'Levels 1, 2, and 3 Cleared!'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 max-w-md mx-auto">
                  {language === 'kha'
                    ? `Ym shem jingiadei Sang ha ka Kmie (${person1Clan}), u Kpa (${fatherClan || 'Clear'}), lane ki Khun u Kñii pyrshah ia ka jait ${person2Clan}.`
                    : `No direct exogamous taboos detected across Maternal (${person1Clan}), Paternal (${fatherClan || 'Clear'}), or Uncle's children against ${person2Clan}.`}
                </p>
              </div>

              {/* Level 4 Traditional Guidelines (Chapter 10 · Page 128) */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#15221d] border border-slate-200 dark:border-[#1f352c] space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-serif font-bold text-base sm:text-lg">
                  <GitBranch className="w-5 h-5 text-emerald-600" />
                  <span>
                    {language === 'kha'
                      ? 'Kyrdan 4: Ïakiew Ïahiar & Khleh Shynrang-Kynthei'
                      : 'Level 4: Ïakiew Ïahiar & Family Tree Link'}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111a16] border border-slate-200/80 dark:border-[#1f352c] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {language === 'kha' ? '1. Ryntih katkum ka Rta (Ïakiew Ïahiar):' : '1. Age Order Consistency (Ïakiew Ïahiar):'}
                    </span>
                    <p>
                      {language === 'kha'
                        ? 'Lada ki para shynrang na ka "Kur A" ki shongkha ïa ki para kynthei na ka "Kur B", dei ban bud ryntih katkum ka rta (rangbah para rangbah — ym dei ban ïakiew ïahiar).'
                        : 'If brothers from "Clan A" marry sisters from "Clan B", marriage must strictly follow chronological age order (eldest with eldest — skipping generations/ages is forbidden).'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111a16] border border-slate-200/80 dark:border-[#1f352c] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {language === 'kha' ? '2. Khleh Shynrang-Kynthei:' : '2. No Cross-Swapping (Khleh Shynrang-Kynthei):'}
                    </span>
                    <p>
                      {language === 'kha'
                        ? 'Sang ruh ban ïapli shynrang-kynthei hapdeng ar ïing kiba la dep ïashongkha (ym dei ban khleh shynrang kynthei hapdeng kine ki ar kur).'
                        : 'It is taboo to marry the daughters of the other clan with the sons of their clan between two families who have established an in-law relationship.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      <span>{language === 'kha' ? 'Ka Jingïakren Kmie-Kpa & Ki Kñii:' : 'Family Discussion & Formal Meeting:'}</span>
                    </span>
                    <p>
                      {language === 'kha'
                        ? 'Kane ka jingbishar ha ka app ka long tang ka lad ban iarap. Ka rai kaba khatduh dei ban shim da ka jingïalang bad jingïakren hapdeng ki ar tylli ki ïing, ki kmie ki kpa, bad ki Kñii ba dei ban bishar bniah ia ka Family Tree.'
                        : 'Digital verification serves as an initial ancestral guide. The definitive matrimonial decision rests with formal family conferences between both households and their respective Longkñii.'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-[#1f352c]">
                  Citation: Rev. I. Kharkongngor (2004), Chapter 10 (Page 128) & Chapter 12 (Page 130)
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'kha' ? 'Bishar biang da kiwei pat ki jait' : 'Check Another Pairing'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
