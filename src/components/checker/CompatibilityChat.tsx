import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useClan } from '../../context/ClanContext';
import { checkBisharSang } from '../../services/api';
import { BisharSangResponse, Level3CheckItem } from '../../types';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Layers,
  BookOpen,
  Bot,
  User,
  GitBranch,
  Users,
  Loader2,
  HeartHandshake,
  Sparkles,
  Check
} from 'lucide-react';
import { sanitizeClanInput, sanitizeTextInput } from '../../utils/sanitize';

export type ChatSender = 'app' | 'user';

export type ChatMessageType =
  | 'text'
  | 'primary_prompt'
  | 'friend_prompt'
  | 'level1_result'
  | 'father_prompt'
  | 'level2_result'
  | 'uncle_prompt'
  | 'level3_result'
  | 'level4_result'
  | 'courtship_stop';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  type: ChatMessageType;
  text?: string;
  verdictData?: BisharSangResponse;
  level3Data?: Level3CheckItem[];
  timestamp: Date;
}

export type ChatStage =
  | 'awaiting_primary_choice'
  | 'awaiting_user_surname'
  | 'awaiting_friend_surname'
  | 'evaluating_level1'
  | 'awaiting_father_surname'
  | 'evaluating_level2'
  | 'awaiting_uncle_surnames'
  | 'evaluating_level3'
  | 'completed_level4'
  | 'courtship_stopped';

export const CompatibilityChat: React.FC = () => {
  const { language } = useLanguage();
  const { primarySurname, setPrimarySurname } = useClan();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<ChatStage>('awaiting_primary_choice');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Collected Clannames across steps
  const [userClan, setUserClan] = useState<string>(primarySurname || '');
  const [friendClan, setFriendClan] = useState<string>('');
  const [fatherClan, setFatherClan] = useState<string>('');
  const [uncleClans, setUncleClans] = useState<string>('');

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isInitialMount = useRef(true);

  // Quick test friend pairings
  const friendPresets = [
    { p2: 'Nongbri', label: 'Nongbri (Sang)' },
    { p2: 'Mylliem Pyrtuh', label: 'Mylliem Pyrtuh (Ym Sang)' },
    { p2: 'Nongrum', label: 'Nongrum (Needs Verify)' },
    { p2: 'Laloo', label: 'Laloo (Shikur Sang)' },
    { p2: 'Syngngai', label: 'Syngngai (Teh Kur Sang)' }
  ];

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    // Only scroll the internal message container, never the outer window/page!
    if (container.scrollHeight > container.clientHeight) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    // On Desktop view, ensure we do not scroll to the bottom of the page when showing the chat box
    if (window.innerWidth >= 768) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Do not auto-scroll on initial mount when showing the chat box
      return;
    }
    scrollToBottom(true);
  }, [messages, isTyping]);

  // Initialize Chat on mount or reset
  const initChat = () => {
    const pSurname = primarySurname?.trim();
    if (pSurname) {
      setUserClan(pSurname);
      setStage('awaiting_primary_choice');
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'app',
          type: 'primary_prompt',
          text:
            language === 'kha'
              ? `Kane ka dei ka jait jong phi ${pSurname}?`
              : `Is this your surname ${pSurname}?`,
          timestamp: new Date()
        }
      ]);
    } else {
      setStage('awaiting_user_surname');
      setMessages([
        {
          id: 'msg-ask-user-clan',
          sender: 'app',
          type: 'text',
          text:
            language === 'kha'
              ? 'Iathuh ia ka jait jong phi:'
              : 'Please enter your surname:',
          timestamp: new Date()
        }
      ]);
    }
    setFriendClan('');
    setFatherClan('');
    setUncleClans('');
    setInputValue('');
  };

  useEffect(() => {
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primarySurname, language]);

  // Helper: check verdict statuses
  const isSang = (res?: BisharSangResponse | null) => res?.verdict === 'SANG_PROHIBITED';
  const isClear = (res?: BisharSangResponse | null) => res?.verdict === 'DISTINCT_CLANS';

  // Handler for primary surname confirmation (Message 1 buttons: hooid / em)
  const handlePrimaryChoice = (choice: 'hooid' | 'em') => {
    if (choice === 'hooid') {
      // Append user's answer
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        text: language === 'kha' ? 'Hooid' : 'Yes',
        timestamp: new Date()
      };

      // Message 2 from App
      const appMsg: ChatMessage = {
        id: `app-${Date.now() + 1}`,
        sender: 'app',
        type: 'friend_prompt',
        text:
          language === 'kha'
            ? 'Iathuh ka jait ba dei i paralok jong phi:'
            : "Please enter your friend's surname:",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg, appMsg]);
      setStage('awaiting_friend_surname');
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    } else {
      // User said "em" (No)
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        text: language === 'kha' ? 'Em' : 'No',
        timestamp: new Date()
      };

      const appMsg: ChatMessage = {
        id: `app-${Date.now() + 1}`,
        sender: 'app',
        type: 'text',
        text:
          language === 'kha'
            ? 'Iathuh ia ka jait jong phi:'
            : 'Please enter your surname:',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg, appMsg]);
      setStage('awaiting_user_surname');
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }
  };

  // Submit User Surname
  const submitUserSurname = (enteredClan: string) => {
    const clan = sanitizeClanInput(enteredClan);
    if (!clan) return;

    setUserClan(clan);
    setPrimarySurname(clan);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: clan,
      timestamp: new Date()
    };

    const appMsg: ChatMessage = {
      id: `app-${Date.now() + 1}`,
      sender: 'app',
      type: 'friend_prompt',
      text:
        language === 'kha'
          ? 'Iathuh ka jait ba dei i paralok jong phi:'
          : "Please enter your friend's surname:",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, appMsg]);
    setStage('awaiting_friend_surname');
    setInputValue('');
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
  };

  // Submit Friend Surname & Run Level 1 Checking
  const submitFriendSurname = async (enteredClan: string) => {
    const friend = sanitizeClanInput(enteredClan);
    if (!friend || !userClan) return;

    setFriendClan(friend);
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: friend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setStage('evaluating_level1');
    setIsTyping(true);

    try {
      const res = await checkBisharSang(userClan, friend);
      setIsTyping(false);

      // Level 1 Result message
      const resultMsg: ChatMessage = {
        id: `app-l1-${Date.now()}`,
        sender: 'app',
        type: 'level1_result',
        verdictData: res,
        timestamp: new Date()
      };

      if (isSang(res)) {
        // Stop courtship
        const stopMsg: ChatMessage = {
          id: `app-stop-${Date.now() + 1}`,
          sender: 'app',
          type: 'courtship_stop',
          text:
            language === 'kha'
              ? 'Ka jingiadei kur ka la thikna hangne ha ka Kyrdan 1. Ha ka riti, dustur, bad ha ka niam Khasi ym bit ban bteng shuh sha kiwei ki kyrdan namar ka long ka Sang. Sngewbha ban ialait noh ka jingiadei jong phi, phi dang ia dei na kajuh ka kpoh. Ym bit ban bteng shuh sha ka jingïashongkha.'
              : 'Maternal clan taboo identified in Level 1. In traditional Khasi custom, culture, teachings and also as per Khasi religion, further checks are discontinued as it is taboo to marry within the clan. Please refrain from proceeding further in courtship, as you belong to the same clan.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMsg, stopMsg]);
        setStage('courtship_stopped');
      } else {
        // Clear: Proceed to Level 2
        const nextPrompt: ChatMessage = {
          id: `app-l2-prompt-${Date.now() + 1}`,
          sender: 'app',
          type: 'father_prompt',
          text:
            language === 'kha'
              ? 'Ka Kyrdan 1 ka la shai (Ym shem jingiadei sang na ka jait kmie). Mynta ngin bteng sha ka Kyrdan 2.\n\nIathuh ia ka jait u kpa jong phi:'
              : "Level 1 is clear (No direct maternal taboo found). Now proceeding to Level 2 (Paternal Lineage).\n\nEnter your father's surname:",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMsg, nextPrompt]);
        setStage('awaiting_father_surname');
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setStage('awaiting_friend_surname');
    }
  };

  // Submit Father's Surname & Run Level 2 Checking
  const submitFatherSurname = async (enteredClan: string) => {
    const father = sanitizeClanInput(enteredClan);
    if (!father || !friendClan) return;

    setFatherClan(father);
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: father,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setStage('evaluating_level2');
    setIsTyping(true);

    try {
      const res = await checkBisharSang(father, friendClan);
      setIsTyping(false);

      const resultMsg: ChatMessage = {
        id: `app-l2-${Date.now()}`,
        sender: 'app',
        type: 'level2_result',
        verdictData: res,
        timestamp: new Date()
      };

      if (isSang(res)) {
        // Stop courtship
        const stopMsg: ChatMessage = {
          id: `app-stop-${Date.now() + 1}`,
          sender: 'app',
          type: 'courtship_stop',
          text:
            language === 'kha'
              ? 'Ka jingiadei Sang u Kpa (Kha trai / Ai khaw kylliang) ka la mih ha ka Kyrdan 2. Ha ka dustur Khasi ym bit ban bteng sha ka jingiashongkha. Sngewbha ban ialait noh mo, phi dang don jingiadei.'
              : 'Paternal Sang prohibition detected in Level 2. In traditional custom, advancement to Level 3 is prohibited. Please refrain from proceeding further in courtship as you are related.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMsg, stopMsg]);
        setStage('courtship_stopped');
      } else {
        // Clear: Proceed to Level 3
        const nextPrompt: ChatMessage = {
          id: `app-l3-prompt-${Date.now() + 1}`,
          sender: 'app',
          type: 'uncle_prompt',
          text:
            language === 'kha'
              ? 'Ka Kyrdan 2 ka la shai (Ym don jingiadei sang u kpa). Mynta ngin bishar ia ka Kyrdan 3.\n\nIathuh ia ki jait jong ki khun jong ki mama jong phi baroh, wei hadien kawei: \n e.g: Mawlong, Pyngrope, Shadap'
              : "Level 2 is clear (No paternal taboo found). Now proceeding to Level 3.\n\nPlease enter the surnames of all your maternal uncle's children:",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMsg, nextPrompt]);
        setStage('awaiting_uncle_surnames');
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setStage('awaiting_father_surname');
    }
  };

  // Submit Maternal Uncle Children's Surnames & Run Level 3 Checking
  const submitUncleSurnames = async (enteredInput: string) => {
    const raw = sanitizeTextInput(enteredInput, 250);
    if (!raw || !friendClan) return;

    setUncleClans(raw);
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: raw,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setStage('evaluating_level3');
    setIsTyping(true);

    const isNone = ['em', 'no', '0', 'zero', 'khlem', 'none'].includes(raw.toLowerCase());

    if (isNone) {
      setIsTyping(false);
      // No maternal uncle cousins
      const noteMsg: ChatMessage = {
        id: `app-l3-none-${Date.now()}`,
        sender: 'app',
        type: 'text',
        text:
          language === 'kha'
            ? 'La thikna: Phim don mama lane ki khun u kñii ban bishar. Ka Kyrdan 3 ka la dep.'
            : "Noted: No maternal uncle's children to check. Level 3 cleared.",
        timestamp: new Date()
      };

      // Proceed to Level 4
      const level4Msg: ChatMessage = {
        id: `app-l4-${Date.now() + 1}`,
        sender: 'app',
        type: 'level4_result',
        timestamp: new Date()
      };

      const finalClosingMsg: ChatMessage = {
        id: `app-final-${Date.now() + 2}`,
        sender: 'app',
        type: 'text',
        text:
          language === 'kha'
            ? 'Khublei shibun bad all the best ha ka jingïaid lynti jong phi baroh arngut! 🙏✨'
            : 'Thank you very much and all the best on your journey together! 🙏✨',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, noteMsg, level4Msg, finalClosingMsg]);
      setStage('completed_level4');
      return;
    }

    // Split comma-separated surnames and sanitize each
    const clanList = raw
      .split(',')
      .map(s => sanitizeClanInput(s))
      .filter(Boolean);

    try {
      const results: Level3CheckItem[] = [];
      for (const clan of clanList) {
        const res = await checkBisharSang(clan, friendClan);
        results.push({ kñiiClan: clan, response: res });
      }

      setIsTyping(false);

      const resultMsg: ChatMessage = {
        id: `app-l3-${Date.now()}`,
        sender: 'app',
        type: 'level3_result',
        level3Data: results,
        timestamp: new Date()
      };

      const hasLevel3Sang = results.some(item => isSang(item.response));

      if (hasLevel3Sang) {
        // Stop courtship
        const stopMsg: ChatMessage = {
          id: `app-stop-${Date.now() + 1}`,
          sender: 'app',
          type: 'courtship_stop',
          text:
            language === 'kha'
              ? 'Ka don ka jingiadei Sang Sohpet-Parakha bad ka jait ba la thoh. Katkum ka rukom Khasi ym bit ban bteng sha ka jingiashongkha. Sngewbha ban ialait noh mo, phi dang don jingiadei.'
              : "Sohpet-Parakha taboo detected among the uncle's lineages. Advancement to Level 4 is prohibited. Please refrain from proceeding further in courtship as you are related.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMsg, stopMsg]);
        setStage('courtship_stopped');
      } else {
        // Level 3 Cleared: Advance to Level 4
        const level4Msg: ChatMessage = {
          id: `app-l4-${Date.now() + 1}`,
          sender: 'app',
          type: 'level4_result',
          timestamp: new Date()
        };

        const finalClosingMsg: ChatMessage = {
          id: `app-final-${Date.now() + 2}`,
          sender: 'app',
          type: 'text',
          text:
            language === 'kha'
              ? 'Khublei shibun bad all the best ha ka jingïaid lynti jong phi baroh arngut! 🙏✨'
              : 'Thank you very much and all the best on your journey together! 🙏✨',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, resultMsg, level4Msg, finalClosingMsg]);
        setStage('completed_level4');
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setStage('awaiting_uncle_surnames');
    }
  };

  // Handle Form / Enter submission
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (stage === 'awaiting_user_surname') {
      submitUserSurname(val);
    } else if (stage === 'awaiting_friend_surname') {
      submitFriendSurname(val);
    } else if (stage === 'awaiting_father_surname') {
      submitFatherSurname(val);
    } else if (stage === 'awaiting_uncle_surnames') {
      submitUncleSurnames(val);
    }
  };

  // Render Verdict Card in Chat Message
  const renderVerdictCard = (res: BisharSangResponse, subtitlePrefix?: string) => {
    const prohibited = isSang(res);
    const clear = isClear(res);

    return (
      <div
        className={`p-4 rounded-2xl border-2 space-y-2.5 transition-all text-left ${prohibited
          ? 'bg-red-50/95 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
          : clear
            ? 'bg-emerald-50/95 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
            : 'bg-amber-50/95 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
          }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-2">
          <div className="flex items-center gap-2">
            {prohibited ? (
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            ) : clear ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <span className="text-[11px] uppercase font-extrabold tracking-wider block">
                {prohibited
                  ? 'KA SANG (PROHIBITED)'
                  : clear
                    ? 'YM DEI KA JUH KA KUR (DISTINCT)'
                    : 'DONKAM JINGBATAI KI TYMMEN'}
              </span>
              <span className="text-[11px] opacity-80">
                {subtitlePrefix ? `${subtitlePrefix}: ` : ''}
                {res.jait_a} & {res.jait_b}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${prohibited
              ? 'bg-red-200 dark:bg-red-900/80 text-red-900 dark:text-red-200'
              : clear
                ? 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
              }`}
          >
            {prohibited ? 'Kim bit shongkha' : clear ? 'Bit ban shongkha' : 'Kylli Longkñii'}
          </span>
        </div>

        {res.cluster && (
          <div className="text-[11px] font-semibold flex items-center gap-1.5 opacity-90">
            <Layers className="w-3 h-3 opacity-70 shrink-0" />
            <span>
              {language === 'kha' ? 'Tyngshop / Cluster:' : 'Cluster:'} {res.cluster}
            </span>
          </div>
        )}

        <p className="text-xs leading-relaxed opacity-95">
          {language === 'kha' ? res.reason_khasi : res.reason_english}
        </p>

        {res.citation && (
          <div className="text-[10px] opacity-75 italic pt-1 border-t border-black/5 dark:border-white/5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>{res.citation}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Chat Window Card */}
      <div className="bg-white dark:bg-[#111a16] rounded-3xl border border-slate-200 dark:border-[#1f352c] shadow-xl overflow-hidden flex flex-col h-[650px] transition-all">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#1f352c] bg-slate-50/70 dark:bg-[#15221d]/80 backdrop-blur-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {language === 'kha' ? 'Bishar ia ka Sang da ka Chat' : 'Sang Verification Chat Assistant'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'kha'
                  ? 'Bishar bniah kyrdan-pa-kyrdan katkum ka dustur'
                  : 'Interactive 4-level traditional marriage checker'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={initChat}
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-[#1a2c24] border border-slate-200/80 dark:border-[#1f352c] transition cursor-pointer text-xs flex items-center gap-1.5"
            title={language === 'kha' ? 'Bishar biang na sdang' : 'Restart Chat'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">
              {language === 'kha' ? 'Sdang Thymmai' : 'Restart'}
            </span>
          </button>
        </div>

        {/* Messages Stream */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        >
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2.5 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {/* App Avatar */}
                {msg.sender === 'app' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 shadow-xs ${msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-[#16231e] text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-[#1f352c] rounded-tl-xs'
                    }`}
                >
                  {/* Plain Text or Prompt */}
                  {msg.text && (
                    <div className="whitespace-pre-line leading-relaxed font-normal">
                      {msg.text}
                    </div>
                  )}

                  {/* Primary Surname Yes / No Buttons (Message 1) */}
                  {msg.type === 'primary_prompt' && stage === 'awaiting_primary_choice' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handlePrimaryChoice('hooid')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'kha' ? 'hooid (Yes)' : 'Yes'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrimaryChoice('em')}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#1f352c] hover:bg-slate-300 dark:hover:bg-[#284438] text-slate-800 dark:text-slate-200 font-semibold text-xs transition cursor-pointer"
                      >
                        <span>{language === 'kha' ? 'em (No)' : 'No'}</span>
                      </button>
                    </div>
                  )}

                  {/* Level 1 Result Card */}
                  {msg.type === 'level1_result' && msg.verdictData && (
                    <div className="pt-1">
                      {renderVerdictCard(
                        msg.verdictData,
                        language === 'kha' ? 'Kyrdan 1 (Maternal)' : 'Level 1 (Maternal)'
                      )}
                    </div>
                  )}

                  {/* Level 2 Result Card */}
                  {msg.type === 'level2_result' && msg.verdictData && (
                    <div className="pt-1">
                      {renderVerdictCard(
                        msg.verdictData,
                        language === 'kha'
                          ? `Kyrdan 2 (Paternal: ${fatherClan})`
                          : `Level 2 (Paternal: ${fatherClan})`
                      )}
                    </div>
                  )}

                  {/* Level 3 Result Cards */}
                  {msg.type === 'level3_result' && msg.level3Data && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {language === 'kha'
                          ? `Ki jait khun u mama pyrshah ia ka ${friendClan}:`
                          : `Maternal uncle lineages vs ${friendClan}:`}
                      </div>
                      {msg.level3Data.map((item, idx) => (
                        <div key={idx}>
                          {renderVerdictCard(
                            item.response,
                            `${language === 'kha' ? 'Khun u Kñii' : 'Uncle Child'} #${idx + 1} (${item.kñiiClan})`
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Courtship Stop Warning Banner */}
                  {msg.type === 'courtship_stop' && (
                    <div className="p-3.5 rounded-xl bg-red-100/90 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span>
                          {language === 'kha'
                            ? 'Sngewbha ban ialait noh ka jingiadei jong phi.'
                            : 'Refrain from proceeding further in courtship.'}
                        </span>
                      </div>
                      <p className="leading-relaxed opacity-90 font-medium">
                        {language === 'kha'
                          ? 'Ym bit ban bteng shuh sha kiwei ki kyrdan namar ka long ka Sang ha ka niam bad ka dustur Khasi.'
                          : 'Further relationship advancement is prohibited due to sacred clan kinship taboos.'}
                      </p>
                      <button
                        type="button"
                        onClick={initChat}
                        className="w-full mt-2 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {language === 'kha'
                            ? 'Bishar biang da kiwei pat ki jait'
                            : 'Start New Verification'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Level 4 Cultural Rules Guidance Card (Message 7) */}
                  {msg.type === 'level4_result' && (
                    <div className="space-y-3 pt-2 text-left">
                      {/* Top milestone cleared badge */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-serif font-bold text-emerald-950 dark:text-emerald-100">
                          {language === 'kha'
                            ? 'La dep bishar ia ki 3 tylli ki Kyrdan!'
                            : 'Levels 1, 2, and 3 Cleared!'}
                        </h4>
                        <p className="text-xs text-emerald-900 dark:text-emerald-200">
                          {language === 'kha'
                            ? `Ym shem jingiadei Sang ha ka Kmie (${userClan}), u Kpa (${fatherClan || 'Clear'}), lane ki Khun u Kñii (${uncleClans || 'Clear'}) pyrshah ia ka jait ${friendClan}.`
                            : `No direct taboos found across Maternal (${userClan}), Paternal (${fatherClan || 'Clear'}), or Uncle's children (${uncleClans || 'Clear'}) against ${friendClan}.`}
                        </p>
                        <p className="text-xs text-emerald-950 dark:text-emerald-100 uppercase font-bold pt-1">
                          {language === 'kha'
                            ? 'Phi lah ban ia kynduh baroh ar ing ban ia kren kham bha.'
                            : 'You can meet each other’s families and discuss further.'}
                        </p>
                      </div>

                      {/* Traditional Rules Breakdown */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-[#1f352c] space-y-3">
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-serif font-bold text-xs sm:text-sm">
                          <GitBranch className="w-4 h-4 text-emerald-600" />
                          <span>
                            {language === 'kha'
                              ? 'Kyrdan 4: Ïakiew Ïahiar & Khleh Shynrang-Kynthei'
                              : 'Level 4: Ïakiew Ïahiar & Family Tree Link'}
                          </span>
                        </div>

                        <div className="space-y-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-[#1f352c]">
                            <strong className="block text-slate-900 dark:text-slate-100">
                              {language === 'kha'
                                ? '1. Ryntih katkum ka Rta (Ïakiew Ïahiar):'
                                : '1. Age Order Consistency (Ïakiew Ïahiar):'}
                            </strong>
                            <p className="mt-0.5">
                              {language === 'kha'
                                ? 'Lada ki para shynrang na ka "Kur A" ki shongkha ïa ki para kynthei na ka "Kur B", dei ban bud ryntih katkum ka rta (rangbah para rangbah — ym dei ban ïakiew ïahiar).'
                                : 'Brothers marrying sisters must follow chronological age order (eldest with eldest; generational crossing is prohibited).'}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-[#1f352c]">
                            <strong className="block text-slate-900 dark:text-slate-100">
                              {language === 'kha'
                                ? '2. Khleh Shynrang-Kynthei:'
                                : '2. No Cross-Swapping (Khleh Shynrang-Kynthei):'}
                            </strong>
                            <p className="mt-0.5">
                              {language === 'kha'
                                ? 'Sang ruh ban ïapli shynrang-kynthei hapdeng ar ïing kiba la dep ïashongkha (ym dei ban khleh shynrang kynthei hapdeng kine ki ar kur).'
                                : 'Reciprocal brother-sister exchange between two already bonded families is strictly forbidden.'}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                            <strong className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                              <span>
                                {language === 'kha'
                                  ? 'Ka Jingïakren Kmie-Kpa & Ki Kñii:'
                                  : 'Family Discussion & Formal Meeting:'}
                              </span>
                            </strong>
                            <p className="mt-0.5">
                              {language === 'kha'
                                ? 'Kane ka jingbishar ha ka app ka long tang ka lad ban iarap. Ka rai kaba khatduh dei ban shim da ka jingïalang bad jingïakren hapdeng ki ar tylli ki ïing, ki kmie ki kpa, bad ki Kñii ba dei ban bishar bniah ia ka Family Tree.'
                                : 'Digital verification serves as an ancestral guide. The definitive matrimonial decision rests with formal family conferences between both households and their respective Longkñii.'}
                            </p>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-100 dark:border-[#1f352c]">
                          Citation: Rev. I. Kharkongngor (2004), Chapter 10 & 12
                        </div>
                      </div>

                      {/* Reset Button */}
                      <button
                        type="button"
                        onClick={initChat}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {language === 'kha'
                            ? 'Bishar biang da kiwei pat ki jait'
                            : 'Check Another Pairing'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-slate-400 text-xs pl-2"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#15221d] flex items-center justify-center text-emerald-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>
                  {language === 'kha'
                    ? 'Dang bishar ia ka jait...'
                    : 'Verifying kinship ties...'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Suggestions Bar (e.g. presets for friend or uncle) */}
        {stage === 'awaiting_friend_surname' && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-[#1f352c] bg-slate-50/50 dark:bg-[#15221d]/40 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-400 shrink-0">
              {language === 'kha' ? 'Pyrshang:' : 'Test:'}
            </span>
            {friendPresets.map(preset => (
              <button
                key={preset.p2}
                type="button"
                onClick={() => submitFriendSurname(preset.p2)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#111a16] border border-slate-200 dark:border-[#1f352c] text-slate-700 dark:text-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-[11px] font-medium transition shrink-0 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {stage === 'awaiting_uncle_surnames' && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-[#1f352c] bg-slate-50/50 dark:bg-[#15221d]/40 flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400">
              {language === 'kha' ? 'Lada ym don mama/kñii shi para bad i mei:' : 'If no maternal uncle:'}
            </span>
            <button
              type="button"
              onClick={() => submitUncleSurnames('Em')}
              className="px-3 py-1 rounded-full bg-white dark:bg-[#111a16] border border-slate-200 dark:border-[#1f352c] text-slate-700 dark:text-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-xs font-semibold transition cursor-pointer"
            >
              {language === 'kha' ? 'Em (0)' : 'No / None (0)'}
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#1f352c] bg-white dark:bg-[#111a16] flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={
              isTyping ||
              stage === 'awaiting_primary_choice' ||
              stage === 'courtship_stopped' ||
              stage === 'completed_level4'
            }
            placeholder={
              stage === 'awaiting_primary_choice'
                ? language === 'kha'
                  ? 'Jied ia ka jubab "hooid" lane "em" haneng...'
                  : 'Select "hooid" or "em" above...'
                : stage === 'awaiting_user_surname'
                  ? language === 'kha'
                    ? 'Thoh ia ka jait jong phi (kumba: Nongkynrih)...'
                    : 'Enter your surname (e.g. Nongkynrih)...'
                  : stage === 'awaiting_friend_surname'
                    ? language === 'kha'
                      ? 'Thoh ka jait i paralok (kumba: Nongbri)...'
                      : "Enter your friend's surname (e.g. Nongbri)..."
                    : stage === 'awaiting_father_surname'
                      ? language === 'kha'
                        ? 'Thoh ka jait kpa jong phi...'
                        : "Enter your father's surname..."
                      : stage === 'awaiting_uncle_surnames'
                        ? language === 'kha'
                          ? 'Thoh ki jait khun jong ki mama (kumba: Mawlong, Pyngrope lane "Em")...'
                          : "Enter uncle's children surnames or 'Em'..."
                        : stage === 'courtship_stopped' || stage === 'completed_level4'
                          ? language === 'kha'
                            ? 'La dep ka jingbishar. Haba kwah bishar biang, shon "Sdang Thymmai".'
                            : 'Chat complete. Click Restart to verify another pair.'
                          : language === 'kha'
                            ? 'Thoh hangne...'
                            : 'Type message...'
            }
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200 dark:border-[#1f352c] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={
              isTyping ||
              !inputValue.trim() ||
              stage === 'awaiting_primary_choice' ||
              stage === 'courtship_stopped' ||
              stage === 'completed_level4'
            }
            className="p-2.5 sm:p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition cursor-pointer shadow-xs shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
