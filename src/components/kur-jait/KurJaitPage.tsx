import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  BookOpen,
  Users,
  HeartHandshake,
  Heart,
  ExternalLink,
  ZoomIn,
  X
} from 'lucide-react';

interface KurJaitPageProps {
  onBack: () => void;
  onOpenChecker?: () => void;
  onOpenShongkha?: () => void;
}

export const KurJaitPage: React.FC<KurJaitPageProps> = ({ onBack, onOpenChecker, onOpenShongkha }) => {
  const { language } = useLanguage();
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

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

      {/* SECTION 2: Dedicated Link to Ka Shongkha Shongman Page */}
      <section className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-emerald-50/40 dark:from-amber-950/20 dark:via-[#131d18] dark:to-emerald-950/20 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-amber-800/60 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-serif font-bold text-lg">
            <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              {language === 'kha' ? 'Dustur Shongkha Shongman' : 'Marriage & Kinship Exogamy'}
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Sanctity of Marriage &amp; Strict Exogamy (Ka Shongkha Shongman)
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {language === 'kha'
            ? 'Ka jingbatai kaba bniah shaphang ka dustur bat kyntang ha ka shongkha shongman u Hynñiew Trep, ka jingkiar ia ka sang ka ma, ki 4 Kyrdan Bishar Sang katkum ka kot u Rev. I. Kharkongngor, bad ki dur batai kyrdan (Kinship Charts).'
            : 'Explore the dedicated treatise on Khasi marriage laws, biological avoidance of close inbreeding, and the 4-level traditional kinship evaluation derived from Rev. I. Kharkongngor (2004) and Spiton Kharakor (1981).'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          {onOpenShongkha && (
            <button
              type="button"
              onClick={onOpenShongkha}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition cursor-pointer shadow-xs"
            >
              <Heart className="w-4 h-4" />
              <span>{language === 'kha' ? 'Pule Shaphang Ka Shongkha Shongman' : 'Read Ka Shongkha Shongman'}</span>
            </button>
          )}

          {onOpenChecker && (
            <button
              type="button"
              onClick={onOpenChecker}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs transition cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              <span>Bishar ia ka Sang</span>
            </button>
          )}
        </div>
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

