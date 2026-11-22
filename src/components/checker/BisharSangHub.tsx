import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { CompatibilityChecker } from './CompatibilityChecker';
import { CompatibilityChat } from './CompatibilityChat';
import {
  HeartHandshake,
  Layers,
  MessageSquareHeart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Bot
} from 'lucide-react';

export type BisharSangMode = 'select' | 'form' | 'chat';

export const BisharSangHub: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<BisharSangMode>('select');

  return (
    <div className="w-full space-y-6">
      {/* Mode Switcher Nav (Visible when inside Form or Chat) */}
      {mode !== 'select' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-[#1f352c] shadow-xs">
          <button
            type="button"
            onClick={() => setMode('select')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#16231e] dark:hover:bg-[#1f352c] text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{language === 'kha' ? 'Phai sha ka Jied Rukom' : 'Switch Method (Options)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {language === 'kha' ? 'Rukom ba mynta:' : 'Current Method:'}
            </span>

            {mode === 'form' ? (
              <button
                type="button"
                onClick={() => setMode('chat')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Kylla sha ka Chatting' : 'Switch to Chat'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('form')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Kylla sha ka Form' : 'Switch to Form'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* View Rendering */}
      <AnimatePresence mode="wait">
        {mode === 'select' ? (
          <motion.div
            key="select-mode"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl mx-auto space-y-8 py-4"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bishar ia ka Sang • 4-Level Traditional Kinship Verification</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                {language === 'kha' ? 'Bishar ïa ka Sang ka Ma' : 'Traditional Marriage Compatibility'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                {language === 'kha'
                  ? 'Jied ia ka rukom bishar ba phi sngewbit ban bishar ia ka jingiadei kur bad shongkha shongman ha ki 4 tylli ki kyrdan katkum ka niam bad ka dustur Khasi:'
                  : 'Choose your preferred verification method to evaluate kinship and traditional Khasi exogamy rules across all 4 levels:'}
              </p>
            </div>

            {/* Two Selectable Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Option 1: Step-by-Step Form */}
              <div
                onClick={() => setMode('form')}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111a16] border-2 border-slate-200 hover:border-emerald-600 dark:border-[#1f352c] dark:hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#16231e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f352c] uppercase tracking-wider">
                      {language === 'kha' ? 'Rukom Form' : 'Guided Form'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {language === 'kha' ? 'Rukom Pyndap Form' : 'Step-by-Step Form'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'kha'
                        ? 'Bishar lyngba ki 4 tylli ki kyrdan da kaba pyndap kyrteng ha ki form kiba pynbeit kyrdan-pa-kyrdan (Jait kmie, Kur u kpa, Khun u kñii).'
                        : 'Verify clan compatibility sequentially using structured forms across maternal lineage, paternal lineage, and cousin connections.'}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Pyndap jait step-by-step ha ka form' : 'Structured multi-step form entry'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Bishar bniah bad ki test presets' : 'Test pairings presets available'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Pyni sani ia ki citation na ki kot tynrai' : 'Historical literature citations'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-[#16231e] group-hover:bg-emerald-700 text-slate-800 dark:text-slate-200 group-hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs">
                    <span>{language === 'kha' ? 'Jied ka Form Method' : 'Select Form Method'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Option 2: Chatting Method */}
              <div
                onClick={() => setMode('chat')}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111a16] border-2 border-slate-200 hover:border-emerald-600 dark:border-[#1f352c] dark:hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <MessageSquareHeart className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'kha' ? 'Rukom Thymmai' : 'Conversational'}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {language === 'kha' ? 'Rukom Ïakren (Chatting)' : 'Interactive Chat Method'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === 'kha'
                        ? 'Bishar da kaba ïakren bad ka App kumba phi texting chatbot. Ka app kan kylli ia phi step-by-step bad batai ha kawei pa kawei ka kyrdan.'
                        : 'Verify compatibility conversationally like texting a chatbot. The app guides you step-by-step with interactive questions.'}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Ïakren kumba texting chatbot' : 'Conversational chat experience'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Kheiñ lypa ia ka primary surname' : 'Primary surname auto-detected'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kha' ? 'Jingbatai kyrdan-pa-kyrdan ha ka chat' : 'Dynamic responses & stop warnings'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <div className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20">
                    <span>{language === 'kha' ? 'Jied ka Chatting Method' : 'Start Chat Method'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : mode === 'form' ? (
          <motion.div
            key="form-mode"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2 }}
          >
            {/* Standard Form: Existing CompatibilityChecker untouched */}
            <CompatibilityChecker />
          </motion.div>
        ) : (
          <motion.div
            key="chat-mode"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2 }}
          >
            {/* Interactive Chatting Method per docs/5. Ka Sang ka ma ha ka shongkha shongman.md */}
            <CompatibilityChat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
