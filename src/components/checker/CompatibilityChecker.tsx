import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { checkKinshipCompatibility } from '../../services/api';
import { CompatibilityResult } from '../../types';
import {
  HeartHandshake,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Loader2,
  ChevronRight
} from 'lucide-react';

export const CompatibilityChecker: React.FC = () => {
  const { t, language } = useLanguage();

  // Wizard Step: 1 = Level 1 Inputs, 2 = Level 1 Result, 3 = Level 2 Inputs, 4 = Combined Result, 5 = Level 3 (Extensible)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [person1Clan, setPerson1Clan] = useState<string>('Diengdoh');
  const [person2Clan, setPerson2Clan] = useState<string>('Laloo');
  const [fatherClan, setFatherClan] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  // Quick preset pairings for instant testing
  const presets = [
    { p1: 'Diengdoh', p2: 'Laloo', label: 'Diengdoh & Laloo (Shikur - Sang)' },
    { p1: 'Diengdoh', p2: 'Syngngai', label: 'Diengdoh & Syngngai (Teh Kur - Sang)' },
    { p1: 'Nongkynrih', p2: 'Shadap', label: 'Nongkynrih & Shadap (Shikur - Sang)' },
    { p1: 'Diengdoh', p2: 'Nongkynrih', label: 'Diengdoh & Nongkynrih (Clear)' },
    { p1: 'Kharkongor', p2: 'Kharmalki', label: 'Kharkongor & Kharmalki (Sang)' }
  ];

  const handleLevel1Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!person1Clan.trim() || !person2Clan.trim()) return;

    setLoading(true);
    try {
      const res = await checkKinshipCompatibility(person1Clan, person2Clan);
      setResult(res);
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevel2Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fatherClan.trim()) return;

    setLoading(true);
    try {
      const res = await checkKinshipCompatibility(person1Clan, person2Clan, fatherClan);
      setResult(res);
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCurrentStep(1);
    setResult(null);
    setFatherClan('');
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>Tipkur Tipkha • Kinship Customs</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          {t('checkerTitle')}
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          {t('checkerSubtitle')}
        </p>
      </div>

      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${currentStep >= 1 ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-500'
          }`}>
          <span>1</span>
          <span>{language === 'kha' ? 'Kmie' : 'Maternal'}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${currentStep >= 3 ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-500'
          }`}>
          <span>2</span>
          <span>{language === 'kha' ? 'Kpa' : 'Paternal'}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${currentStep === 5 ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-400 opacity-60'
          }`}>
          <span>3</span>
          <span>{language === 'kha' ? 'Bniah' : 'Extended'}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl transition-all">
        <AnimatePresence mode="wait">
          {/* STEP 1: Level 1 Input Form */}
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
                <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-sans">
                    1
                  </span>
                  <span>{t('step1Title')}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t('step1Desc')}
                </p>
              </div>

              <form onSubmit={handleLevel1Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="p1-clan-input"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      {t('person1Label')}
                    </label>
                    <input
                      id="p1-clan-input"
                      type="text"
                      value={person1Clan}
                      onChange={e => setPerson1Clan(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, () => handleLevel1Submit())}
                      placeholder={t('person1Placeholder')}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="p2-clan-input"
                      className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      {t('person2Label')}
                    </label>
                    <input
                      id="p2-clan-input"
                      type="text"
                      value={person2Clan}
                      onChange={e => setPerson2Clan(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, () => handleLevel1Submit())}
                      placeholder={t('person2Placeholder')}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <div className="text-xs text-slate-500 mb-2 font-medium">
                    Try authentic test examples:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setPerson1Clan(p.p1);
                          setPerson2Clan(p.p2);
                        }}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition border border-slate-200 cursor-pointer"
                      >
                        {p.label}
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
                        <span>Verifying Lineage...</span>
                      </>
                    ) : (
                      <>
                        <span>{t('checkButton')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Level 1 Result Card */}
          {currentStep === 2 && result && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Level 1 Verdict
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {result.level1.testedPerson1Clan} & {result.level1.testedPerson2Clan}
                </span>
              </div>

              {/* Status Banner */}
              {result.overallVerdict === 'SANG' ? (
                <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-200 text-red-900 space-y-2">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertOctagon className="w-7 h-7 shrink-0" />
                    <h4 className="text-lg font-serif font-bold">
                      {t('verdictSangHeader')}
                    </h4>
                  </div>
                  <div className="text-sm font-semibold text-red-800">
                    {language === 'kha' ? result.level1.tierNameKhasi : result.level1.tierNameEnglish}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                    {language === 'kha' ? result.level1.descriptionKhasi : result.level1.descriptionEnglish}
                  </p>
                  <p className="text-xs italic text-red-700 pt-1 border-t border-red-200">
                    {t('sangWarning')}
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircle2 className="w-7 h-7 shrink-0" />
                    <h4 className="text-lg font-serif font-bold">
                      {t('verdictClearHeader')}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                    {language === 'kha' ? result.level1.descriptionKhasi : result.level1.descriptionEnglish}
                  </p>
                </div>
              )}

              {/* Citation if available */}
              {result.level1.citation && (
                <div className="text-xs text-slate-500 italic flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>{t('citationSource')}: {result.level1.citation}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  <span>{t('continueToStep2')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('resetChecker')}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Level 2 Paternal Input */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-sans">
                    2
                  </span>
                  <span>{t('step2Title')}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t('step2Desc')}
                </p>
              </div>

              <form onSubmit={handleLevel2Submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="father-clan-input"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    {t('fatherSurnameLabel')}
                  </label>
                  <input
                    id="father-clan-input"
                    type="text"
                    value={fatherClan}
                    onChange={e => setFatherClan(e.target.value)}
                    onKeyDown={e => handleKeyDown(e, () => handleLevel2Submit())}
                    placeholder={t('fatherSurnamePlaceholder')}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                    autoFocus
                  />
                  <div className="text-[11px] text-slate-500">
                    Comparing {person1Clan}'s paternal surname with {person2Clan}.
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
                        <span>Checking Paternal Lineage...</span>
                      </>
                    ) : (
                      <>
                        <span>{t('checkStep2Button')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: Combined Level 1 + Level 2 Result */}
          {currentStep === 4 && result && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Combined Verification Report
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-900">
                  {person1Clan} & {person2Clan}
                </h4>
              </div>

              {/* Level 1 Summary */}
              <div className={`p-4 rounded-2xl border ${result.level1.verdict === 'NO_LINK'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
                }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <span>Level 1 (Maternal):</span>
                  <span>{language === 'kha' ? result.level1.tierNameKhasi : result.level1.tierNameEnglish}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {language === 'kha' ? result.level1.descriptionKhasi : result.level1.descriptionEnglish}
                </p>
              </div>

              {/* Level 2 Summary */}
              {result.level2 && (
                <div className={`p-4 rounded-2xl border ${result.level2.verdict === 'PATERNAL_KHA'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <span>Level 2 (Paternal - {fatherClan}):</span>
                    <span>{language === 'kha' ? result.level2.tierNameKhasi : result.level2.tierNameEnglish}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {language === 'kha' ? result.level2.descriptionKhasi : result.level2.descriptionEnglish}
                  </p>
                </div>
              )}

              {/* Custom Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>{t('disclaimerTitle')}</span>
                </div>
                <div>{t('disclaimerText')}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="flex-1 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Preview Level 3 Check</span>
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  className="py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('resetChecker')}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Level 3 Extensible Architecture Placeholder */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                <HeartHandshake className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {t('step3Title')}
                </h3>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {t('step3ComingSoon')}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto pt-2">
                  {t('step3Desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-left text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">
                  Extensible Endpoint Architecture Ready:
                </div>
                <div>• Grandmother Lineage (Ka Jait ka Kmie-rad) validation hook</div>
                <div>• Registered Seng Kur registry verification API connector</div>
                <div>• Autonomous Longkñi consultation referral channel</div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer"
                >
                  {t('resetChecker')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
