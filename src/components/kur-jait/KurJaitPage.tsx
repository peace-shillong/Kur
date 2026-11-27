import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  BookOpen,
  Users,
  ShieldCheck,
  HeartHandshake,
  Heart,
  Baby,
  Sparkles,
  ExternalLink,
  ZoomIn,
  X,
  Layers
} from 'lucide-react';

interface KurJaitPageProps {
  onBack: () => void;
  onOpenChecker?: () => void;
}

export const KurJaitPage: React.FC<KurJaitPageProps> = ({ onBack, onOpenChecker }) => {
  const { language } = useLanguage();
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [level3Tab, setLevel3Tab] = useState<'3.1' | '3.2' | 'both'>('3.1');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{language === 'kha' ? 'Phai sha ka Jingwad Kur (Back)' : 'Back to Search'}</span>
        </button>

        <div className="text-left sm:text-right">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
            Ka Kur Ka Jait
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ki Khun Ki Ksiew U Hynñiew Trep • Spiton Kharakor (1981)
          </p>
        </div>
      </div>

      {/* Book Citation Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start sm:items-center gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-2xl bg-white dark:bg-[#111a16] text-emerald-700 dark:text-emerald-300 shadow-xs shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-bold text-emerald-950 dark:text-emerald-100 block">
            Spiton Kharakor (1981), <em>Ki Khun Ki Ksiew U Hynñiew Trep</em>
          </span>
          <span className="text-emerald-800 dark:text-emerald-300 text-xs">
            Lynnong-II (Page 6 – 7) • Ki Nongrim Tynrai ka Longkur Longjait bad ka Shongkha Shongman
          </span>
        </div>
      </div>

      {/* SECTION 1: Sacred Origin of the Clans (Ki Kur ki Jait) */}
      <section className="bg-white dark:bg-[#111a16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-serif font-bold text-lg">
            1
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Lynnong-II • Ka Thymmei Tynrai
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Sacred Origin of the Clans (Ki Kur ki Jait)
            </h2>
          </div>
        </div>

        {/* Khasi Original Excerpt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
          <p>
            "Ki Khun ki ksiew u Hynñiew Trep Hynñiew Skum ki long kiba riewspah ha ka liang ki kur ki jait. Kine ki jait ki khong ki wan da ka daw bad la pynskhem ïa ki da ka niam tynrai U Hynñiew Trep. Ngi ngeit ba ki kur ki jait ki mih na ka Ïawbei tynrai kaba long ka kmie nyngkong jong kawei pa kawei ka kur ha ka jait bynriew Hynñiew Trep. U shongkha ba nyngkong eh jong ka kur la khot kyrteng u Thawlang bad ia u longkñi nyngkong la ong u Suitnia."
          </p>
        </div>

        {/* English Synthesis */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            The <strong>Hynñiew Trep</strong> (Khasi people) possess a rich heritage of clans, which originated with a divine purpose and are sanctified by the indigenous Khasi faith (<em>ka niam tynrai</em>).
          </p>

          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Every clan traces its lineage back to three foundational ancestors:
          </p>

          {/* Three Foundational Ancestors Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Ka Kmie Nyngkong
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                Ka Ïawbei Tynrai
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The primal root-mother and foundational ancestress of the clan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                U Shongkha Nyngkong
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                U Thawlang
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The first progenitor/father who married into the clan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/50 space-y-1.5">
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                U Longkñi Nyngkong
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                U Suitnia
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The first maternal uncle who served as spiritual mediator and counselor.
              </p>
            </div>
          </div>
        </div>

        {/* IMAGE 1: First Khasi Household */}
        <div className="space-y-2 pt-2">
          <div
            onClick={() => setActiveImageModal('/assets/first-khasi-household.webp')}
            className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md cursor-pointer"
          >
            <img
              src="/assets/first-khasi-household.webp"
              alt="First Khasi Household — Ka Iawbei, U Thawlang, U Suitnia"
              className="w-full max-h-[460px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
              <ZoomIn className="w-5 h-5" />
              <span>Click to view full image</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
            Figure 1: The First Khasi Household — Ka Ïawbei (Ancestress), U Thawlang (Progenitor), and U Suitnia (Maternal Uncle).
          </p>
        </div>

        {/* Sub-section: Roles & Responsibilities */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Roles and Responsibilities in Family & Society</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Khasi society upholds deep reverence for both maternal ties (<em>ka longkur</em>) and paternal/in-law ties (<em>ka longkha</em>), assigning distinct, complementary duties across generations:
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Women (Ki Kynthei):
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                Preserve and carry forward the clan surname (<em>ka jait ka khong</em>) from ancient times. They serve as mothers (<em>longkmie</em>) to their own children and as paternal aunts (<em>longkha</em>) to the children of their brothers.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Men as Maternal Uncles (U Longkñi):
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                In their maternal clan home (<em>ïingkur</em>), men hold administrative, economic, and clan authority over their sisters' children (<em>ki pyrsa</em>). Among traditional Hima Khasi (Khasi states), this principle extends to governance, where a nephew (<em>pyrsa shynrang</em>) succeeds his maternal uncle in leadership.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Men as Fathers (U Longkpa):
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                In their marital home (<em>ïingkhun</em>), men fulfill the role of father, carrying the responsibility of providing love, care, and protection for their children.
              </p>
            </div>
          </div>
        </div>

        {/* IMAGE 2: Roles and Responsibilities */}
        <div className="space-y-2 pt-2">
          <div
            onClick={() => setActiveImageModal('/assets/role-responsibility.webp')}
            className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md cursor-pointer"
          >
            <img
              src="/assets/role-responsibility.webp"
              alt="Roles and Responsibilities of Men & Women in Khasi Family & Society"
              className="w-full max-h-[460px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
              <ZoomIn className="w-5 h-5" />
              <span>Click to view full image</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
            Figure 2: The Complementary Roles and Responsibilities of Men & Women in Khasi Family & Society.
          </p>
        </div>

        {/* Clan Expansion and Unbreakable Unity */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5 text-xs sm:text-sm">
          <h4 className="font-serif font-bold text-emerald-950 dark:text-emerald-100 text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>Clan Expansion and Unbreakable Unity (Shidoh Shisnam)</span>
          </h4>
          <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
            Clans grow and branch out through women across generations—expanding from the household (<em>ïing</em>), to the womb-lineage (<em>kpoh</em>), to the broader clan (<em>kur</em>).
          </p>
          <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
            Over time, migration and relocation often cause large clans to divide into sub-clans (<em>shnat kur</em>) adopting distinct surnames. Regardless of different surnames, as long as members recognize their shared bloodline descending from the same Ïawbei Tynrai, they remain bound by a spirit of kinship—considered one flesh and one blood (<strong>shidoh shisnam</strong>) under the embrace of the guardian spirit of clanhood (<em>ka ’lei longkur long jait</em>).
          </p>
        </div>
      </section>

      {/* SECTION 2: Sanctity of Marriage & Strict Exogamy (Ka Shongkha Shongman) */}
      <section className="bg-white dark:bg-[#111a16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-serif font-bold text-lg">
            2
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              Dustur Niam • Bat Kyntang
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Sanctity of Marriage & Strict Exogamy (Ka Shongkha Shongman)
            </h2>
          </div>
        </div>

        {/* Khasi Original Excerpt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
          <p>
            "Shaphang ka shongkha shongman, u Hynñiew Trep u bat kyntang ïaka. Um ju shongkha shikur ne shipara kha. Dang lap ha kine ki snem ba hadien ba kano kano ka jait bynriew kaba shongkha jan than haba dang don jingïadei jan ha ka snam, kam juh lah neh slem. Ki khun ki kti jong ki, la ong, ki long anna ha ka met ka phad bad ki long kiba duna ba ka liang ka pyrkhat ka pyrdaiñ."
          </p>
        </div>

        {/* Core Principles */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-1.5">
              <div className="flex items-center gap-2 text-red-950 dark:text-red-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Strict Clan Exogamy</span>
              </div>
              <p className="text-xs text-red-900 dark:text-red-300 leading-relaxed">
                The Hynñiew Trep hold marriage as sacred (<em>bat kyntang</em>). Marriage within the same clan (<em>shongkha shikur</em>) or between close paternal kin (<em>shipara kha</em>) is strictly taboo and forbidden.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Biological & Ancestral Wisdom</span>
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                The text notes that marrying close blood relatives leads to community decline, resulting in physical deformities (<em>anna ha ka met ka phad</em>) and diminished mental faculties (<em>duna ha ka pyrkhat ka pyrdaiñ</em>).
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: More into the Khasi Custom & Culture (Shuh shuh shaphang ka Riti & Dustur Khasi) */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {language === 'kha' ? 'Riti Niam & Dustur Shongkha' : 'Kinship & Exogamy Principles'}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {language === 'kha'
                    ? 'Shuh shuh shaphang ka Riti & Dustur Khasi'
                    : 'More into the Khasi Custom & Culture'}
                </span>
              </h3>
            </div>

            {/* Reference link to the book */}
            <a
              href="https://archive.org/details/in.ernet.dli.2015.464609/mode/2up"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-semibold transition self-start sm:self-auto cursor-pointer shadow-xs"
              title="Read Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi on Archive.org"
            >
              <span>Rev. I. Kharkongngor (2004)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'kha'
              ? 'Ka thymmei jingtip na ka kot "Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi", da u Rev. I. Kharkongngor (2004), kaba long ka nongrim tynrai ha kaba la seng ia ki 4 Kyrdan Bishar Sang ha kane ka App:'
              : 'The following foundational guidelines are taken from "Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi", by Rev. I. Kharkongngor (2004), establishing the cultural basis for the 4-Level Sang verification in the app:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Card 1: Level 1 - Para-ar-kmie */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  <span>In the App · Level 1</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Chapter 11 · Page 129
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  1. Para-ar-kmie (Maternal Parallel Cousins)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                  Ki khun jong ki para kynthei ka kmie (Meisan, Meinah, Meiduh) ki dei shipara-trai na kajuh ka kpoh. Wat lada ki shong jngai shnong, ka long kaba <strong>Sang</strong> ban ïashongkha.
                </p>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2 leading-relaxed">
                <em>Maternal parallel cousins (children of mother's sisters) are considered full siblings from the same womb lineage (kajuh ka kpoh). Even if living in separate villages, marriage is strictly taboo.</em>
              </div>
            </div>

            {/* Card 2: Level 2 - Kur u Kpa & Ai Khaw Kylliang */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  <span>In the App · Level 2</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Chapter 12 · Page 130
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  2. Kur u Kpa & Ai Khaw Kylliang (Paternal Lineage)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                  Ym bit ban shongkha ïa ki para-kur u kpa (Ñiakha) katba u kpa u dang kam trai. Kaba shongkha ïa ki khun ka Ñiakha-trai ban pynroi jait sha ka kur u kpa la khot "<strong>Ai khaw kylliang</strong>" bad ym ju bit katba dang im u kpa.
                </p>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2 leading-relaxed">
                <em>No marriage with your paternal side or father's clan or with your aunt's children, when your father is still alive and well.</em>
              </div>
            </div>

            {/* Card 3: Level 3 - Shi-Parakha & Sohpet-Parakha */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  <span>In the App · Level 3</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Chapters 11 & 12 · Pages 129–131
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  3. Shi-Parakha & Sohpet-Parakha (Uncle's Children)
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1 space-y-1.5">
                  <p>
                    <strong>Shi-Parakha:</strong> Ki khun jong arngut ki shynrang shipara (brothers' children). Wat la pher ka Jait ki kmie jong ki, kim lah ban ïashongkha namar ki dei na ujuh u symbai kpa. (Uncle's children surname)
                  </p>
                  <p>
                    <strong>Sohpet-Parakha:</strong> Ki khun jong u Kñii (maternal uncle's children) bad ki khun jong ki Pyrsa-kha (cousins from paternal side) kim bit ban ïashongkha (Page 131).
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Level 4 - Ïakiew Ïahiar & Khleh Shynrang-Kynthei */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  <span>In the App · Level 4</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Chapter 10 · Page 128
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  4. Ïakiew Ïahiar & Khleh Shynrang-Kynthei
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                  Lada ki para shynrang na ka "Kur A" ki shongkha ïa ki para kynthei na ka "Kur B", dei ban bud ryntih katkum ka rta (rangbah para rangbah — ym dei ban ïakiew ïahiar). Sang ruh ban ïapli shynrang-kynthei hapdeng ar ïing (khleh shynrang kynthei).
                </p>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2 leading-relaxed">
                <em>If the sons of "Clan A" marry the daughters of "Clan B", then the marriage must be in accordance with the age order (eldest with the eldest — not to skip ages). It is also forbidden to marry the daughters of the other clan with the sons of their clan between two families who have entered in a marriage relation (marrying in between close relations with family members).</em>
              </div>
            </div>
          </div>

          {/* 4 Photo Diagram Cards for the 4 App Levels */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {language === 'kha' ? 'Ki Dur Batai ia ki 4 Kyrdan' : 'Visual Kinship Reference Charts'}
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {language === 'kha'
                      ? 'Ki Dur Batai Kyrdan Bishar Sang (Kyrdan 1 – 4)'
                      : 'Kinship Lineage & Restriction Diagrams (Levels 1 – 4)'}
                  </span>
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 self-start sm:self-auto">
                {language === 'kha' ? 'Khnjot ha ka dur ban pynheh (Click to zoom)' : 'Click any chart to zoom'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Photo Card 1: Kyrdan 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      <Layers className="w-3 h-3" />
                      <span>Level 1 Diagram</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Kyrdan 1
                    </span>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      Dur 1: Para-ar-kmie (Maternal Parallel Cousins)
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {language === 'kha'
                        ? 'Shipara-trai na kajuh ka kpoh / Ka juh ka Kur — Ka long kaba Sang ban ïashongkha.'
                        : 'Full siblings from the same womb lineage / clan — Strictly taboo to marry.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveImageModal('/assets/Kyrdan 1.webp')}
                    className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                  >
                    <img
                      src="/assets/Kyrdan 1.webp"
                      alt="Dur 1: Para-ar-kmie (Maternal Parallel Cousins)"
                      className="w-full h-auto max-h-[300px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                      <ZoomIn className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Khnjot ban pynheh' : 'Click to enlarge'}</span>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Figure 1: Maternal Parallel Cousins Lineage & Exogamy Restriction
                  </p>
                </div>
              </div>

              {/* Photo Card 2: Kyrdan 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      <Layers className="w-3 h-3" />
                      <span>Level 2 Diagram</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Kyrdan 2
                    </span>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      Dur 2: Kur u Kpa & Ai Khaw Kylliang (Paternal Lineage)
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {language === 'kha'
                        ? 'Paternal Clan Lineage (Kur u Kpa) — Prohibited while father is alive.'
                        : 'Restriction of paternal clan & cross-cousin marriage while the father lives.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveImageModal('/assets/Kyrdan 2.webp')}
                    className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                  >
                    <img
                      src="/assets/Kyrdan 2.webp"
                      alt="Dur 2: Kur u Kpa & Ai Khaw Kylliang"
                      className="w-full h-auto max-h-[300px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                      <ZoomIn className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Khnjot ban pynheh' : 'Click to enlarge'}</span>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Figure 2: Paternal Lineage & "Ai Khaw Kylliang" Restriction
                  </p>
                </div>
              </div>

              {/* Photo Card 3: Kyrdan 3 (Includes Kyrdan 3.1 & Kyrdan 3.2) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                      <Layers className="w-3 h-3" />
                      <span>Level 3 Diagrams (2 Photos)</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Kyrdan 3.1 & 3.2
                    </span>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      Dur 3: Shi-Parakha & Sohpet-Parakha (Uncle's Children)
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {language === 'kha'
                        ? '3.1 Sohpet-Parakha (Ki khun u Kñi) bad 3.2 Shi-Parakha (Ki khun arngut ki shipara shynrang na ujuh u symbai kpa).'
                        : '3.1 Cross-cousin marriage restriction & 3.2 Paternal cousin marriage restriction.'}
                    </p>
                  </div>

                  {/* Toggle buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setLevel3Tab('3.1')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${level3Tab === '3.1'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      3.1 Sohpet-Parakha
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel3Tab('3.2')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${level3Tab === '3.2'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      3.2 Shi-Parakha
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel3Tab('both')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${level3Tab === 'both'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      {language === 'kha' ? 'Baroh Ar' : 'Both'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {level3Tab === 'both' ? (
                    <div className="space-y-3">
                      <div
                        onClick={() => setActiveImageModal('/assets/Kyrdan 3.1.webp')}
                        className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                      >
                        <img
                          src="/assets/Kyrdan 3.1.webp"
                          alt="Dur 3.1: Sohpet-Parakha"
                          className="w-full h-auto max-h-[220px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                          <ZoomIn className="w-4 h-4" />
                          <span>3.1 Sohpet-Parakha (Zoom)</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveImageModal('/assets/Kyrdan 3.2.webp')}
                        className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                      >
                        <img
                          src="/assets/Kyrdan 3.2.webp"
                          alt="Dur 3.2: Shi-Parakha"
                          className="w-full h-auto max-h-[220px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                          <ZoomIn className="w-4 h-4" />
                          <span>3.2 Shi-Parakha (Zoom)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveImageModal(level3Tab === '3.1' ? '/assets/Kyrdan 3.1.webp' : '/assets/Kyrdan 3.2.webp')}
                      className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                    >
                      <img
                        src={level3Tab === '3.1' ? '/assets/Kyrdan 3.1.webp' : '/assets/Kyrdan 3.2.webp'}
                        alt={level3Tab === '3.1' ? 'Dur 3.1: Sohpet-Parakha' : 'Dur 3.2: Shi-Parakha'}
                        className="w-full h-auto max-h-[300px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                        <ZoomIn className="w-4 h-4" />
                        <span>{language === 'kha' ? 'Khnjot ban pynheh' : 'Click to enlarge'}</span>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail previews */}
                  {level3Tab !== 'both' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setLevel3Tab('3.1')}
                        className={`p-1.5 rounded-lg border text-left transition cursor-pointer flex items-center gap-2 ${level3Tab === '3.1'
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                          }`}
                      >
                        <img
                          src="/assets/Kyrdan 3.1.webp"
                          alt="Thumbnail 3.1"
                          className="w-10 h-7 object-cover rounded border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            3.1 Sohpet-Parakha
                          </span>
                          <span className="block text-[9px] text-slate-500 dark:text-slate-400 truncate">
                            Cross-Cousins
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLevel3Tab('3.2')}
                        className={`p-1.5 rounded-lg border text-left transition cursor-pointer flex items-center gap-2 ${level3Tab === '3.2'
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                          }`}
                      >
                        <img
                          src="/assets/Kyrdan 3.2.webp"
                          alt="Thumbnail 3.2"
                          className="w-10 h-7 object-cover rounded border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            3.2 Shi-Parakha
                          </span>
                          <span className="block text-[9px] text-slate-500 dark:text-slate-400 truncate">
                            Symbai Kpa
                          </span>
                        </div>
                      </button>
                    </div>
                  )}

                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {level3Tab === '3.1'
                      ? "Figure 3.1: Sohpet-Parakha — Maternal Uncle's Children (Cross-Cousins)"
                      : level3Tab === '3.2'
                        ? "Figure 3.2: Shi-Parakha — Brothers' Children (Same Paternal Seed Ujuh u Symbai Kpa)"
                        : "Figure 3: Cross-Cousin & Paternal Cousin Marriage Restrictions (Both Charts)"}
                  </p>
                </div>
              </div>

              {/* Photo Card 4: Kyrdan 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                      <Layers className="w-3 h-3" />
                      <span>Level 4 Diagram</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Kyrdan 4
                    </span>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      Dur 4: Ïakiew Ïahiar & Khleh Shynrang-Kynthei
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {language === 'kha'
                        ? '1. Bud ryntih katkum ka rta bad 2. Sang ban ïapli shynrang-kynthei hapdeng ar ïing.'
                        : '1. Age order compliance & 2. Prohibition of reciprocal sibling exchange between two clans.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveImageModal('/assets/Kyrdan 4.webp')}
                    className="group relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#0c1410] shadow-xs cursor-pointer"
                  >
                    <img
                      src="/assets/Kyrdan 4.webp"
                      alt="Dur 4: Ïakiew Ïahiar & Khleh Shynrang-Kynthei"
                      className="w-full h-auto max-h-[300px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                      <ZoomIn className="w-4 h-4" />
                      <span>{language === 'kha' ? 'Khnjot ban pynheh' : 'Click to enlarge'}</span>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Figure 4: Age Order Rules & Clan Sibling-Exchange Restrictions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ka Ïawbei in Naming & Infancy */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Baby className="w-5 h-5 text-emerald-600" />
            <span>The Primal Ancestress (Ka Ïawbei) in Naming & Infancy</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Reverence for Ka Ïawbei (the maternal clan root) is deeply embedded in everyday infancy and childhood traditions:
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Naming Ceremony (Jer Thoh):
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                Immediately after birth, a boy is named using the <em>khnam ïawbei</em> and <em>ryntieh ïawbei</em> (ancestral bow and arrows), while a girl is named using the <em>wait</em> and <em>khoh ïawbei</em> (ancestral utility knife and conical basket). Both receive their mother's clan surname (<em>jait</em>).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Spiritual Bond in Infancy:
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                If a sleeping baby suddenly cries without apparent cause, elders say Ka Ïawbei is scolding them (<em>mai ka ïawbei</em>); if the baby smiles in their sleep, Ka Ïawbei is playing with or amusing them (<em>iaraiñ ka ïawbei</em>).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 block">
                • Physical Attribution:
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                A baby's physical build, first milk teeth (<em>’niat ïawbei</em>), and infant hair (<em>’ñiuh ïawbei</em>, before their first year) are all believed to belong to Ka Ïawbei.
              </p>
            </div>
          </div>
        </div>

        {/* Matrilineal Surnames & Cross-Cultural Marriages */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
            Matrilineal Surnames & Cross-Cultural Marriages (Kyntang Ïawbei)
          </h3>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#15221d] border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              A Khasi man never passes his own surname to his children; women are the sole custodians and carriers of the clan surname (<em>jait</em>).
            </p>
            <p>
              Even in later times when many Khasi men married non-Khasi women (<em>kynthei dkhar</em>) from patrilineal societies, they did not violate the fundamental Khasi code of kinship (<em>kheiñ kur kheiñ kha</em>).
            </p>
            <p>
              Instead, through traditional consecration (<strong>kyntang ïawbei</strong>), the non-Khasi wife is formally honored as a primal ancestress (<em>ïawbei</em>), allowing their children to receive a distinct new clan surname (<em>jait thymmai</em>) within the Hynñiew Trep fold.
            </p>
          </div>
        </div>

        {/* Action button to test Bishar ia ka Sang */}
        {onOpenChecker && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100">
                Kwah ban bishar ia ka jingïadei kur bad shongkha?
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Pyrshang ia ka 4-Level Traditional Kinship Verification Tool (Bishar ia ka Sang).
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenChecker}
              className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shrink-0"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Bishar ia ka Sang</span>
            </button>
          </div>
        )}
      </section>

      {/* FOOTER OF KUR JAIT PAGE */}
      <footer className="pt-4 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Spiton Kharakor (1981)</span>
          <span>•</span>
          <a
            href="https://ia601406.us.archive.org/22/items/in.ernet.dli.2015.464918/2015.464918.Ki-Khun-Ki-Ksiew-U-Hynniew-Trep_text.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>Original Archive Text</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="text-[11px] text-slate-400">
          Tipkur Tipkha • November 2026
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal for Images */}
      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setActiveImageModal(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImageModal}
              alt="Enlarged Illustration"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-white"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

