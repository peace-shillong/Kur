import { ClanCluster, TipkurResponse } from '../types';
import { getCommonSurnameResponse } from '../data/commonSurnames';

export const MOCK_CLUSTERS: ClanCluster[] = [
  {
    id: "iaw-shi-bdi",
    title: "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
    kpoh_clans: [
      "Diengdoh-Bah",
      "Diengdoh-Kylla",
      "Diengdoh-Shngaiñlang",
      "Diengdoh Parïong",
      "Diengdoh Nongstoiñ"
    ],
    shikur_clans: [
      "Ïaw Shi Bdi", "Laloo", "Pyrbot", "Amkoi", "Amdep", "Kadep", "Kadew", 
      "Kadiang", "Kalang", "Kanai", "Kasah", "Kashngaiñ", "Katkeh", "Diengdoh", 
      "Doom", "Hek", "Ïongkjam", "Jui", "Larom", "Lamin", "Lyngdoh Lamin", 
      "Marngar", "Marong", "Mesui", "Nartiang", "Nui", "Parïong", "Phup", 
      "Piat", "Pohkhloo", "Pohduna", "Pohlynjar", "Pohriej", "Pohrmen", "Pohshen", 
      "Pohsnem", "Pohtam", "Put", "Rymbui", "Suji", "Tui", "Tai", "Wanpiat", "War"
    ],
    teh_kur_clans: [
      "Syngngai", "Khongsdoh", "Padoh"
    ],
    distant_clans: [
      "Kharpran", "Lyngdoh Sohra", "Diengdoh-Shilliang"
    ],
    summary_khasi: "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
    summary_english: "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
    citation: "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
  },
  {
    id: "nongkynrih-shadap-kynshi",
    title: "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
    kpoh_clans: [
      "Nongphod", "Nongkynrih-Sohra"
    ],
    shikur_clans: [
      "Nongkynrih", "Shadap", "Passah", "Pasah", "Nongbri", "Lyngdoh Kynshi", 
      "Lyngdoh Nongbri", "Marboh", "Namsheh"
    ],
    teh_kur_clans: [
      "Pombah", "Wahbah", "Shadap Manner", "Shadap Sabit"
    ],
    distant_clans: [
      "Nongrum", "Kynshi", "Mawkhar"
    ],
    summary_khasi: "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
    summary_english: "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
    citation: "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
  },
  {
    id: "kharkongor-kharmalki",
    title: "Kharkongor / Kharmalki / Kharbhih / Kharmawphlang",
    kpoh_clans: [
      "Kharkongor Bah", "Kharkongor Khynnah"
    ],
    shikur_clans: [
      "Kharkongor", "Kharmalki", "Kharbhih", "Kharmawphlang", "Kharphanbuh"
    ],
    teh_kur_clans: [
      "Kharmuti", "Kharshiing"
    ],
    distant_clans: [
      "Kharumuid", "Kharpuri"
    ],
    summary_khasi: "Ki kur Kharkongor, Kharmalki, Kharbhih, Kharmawphlang bad Kharphanbuh ki hiar na kajuh ka Kmie Tymmen kaba wan poi sha Shillong bad Sohra. Ka jingiashongkha hapdeng jong ki ka long ka Sang kaba jur.",
    summary_english: "The Kharkongor, Kharmalki, Kharbhih, Kharmawphlang, and Kharphanbuh clans descend from common ancestral roots. Marriage between these lineages is strictly prohibited (Sang).",
    citation: "Seng Khasi & Dr. H. Lyngdoh, Ka Niam Khasi bad Ki Kur (1961)"
  },
  {
    id: "syiemlieh-sohra",
    title: "Syiemlieh / Syiemiong / Syiem Sad (Hima Sohra & Nongkhlaw)",
    kpoh_clans: [
      "Syiemlieh Sohra", "Syiemlieh Nongkhlaw"
    ],
    shikur_clans: [
      "Syiemlieh", "Syiemiong", "Syiem Sad"
    ],
    teh_kur_clans: [
      "Lyngdoh Sohra", "Syiem Nongspung"
    ],
    distant_clans: [
      "Mylliem", "Khyriem"
    ],
    summary_khasi: "Ki Syiemlieh bad Syiemiong ki dei ki kynhun Syiem kiba bat ia ka khet ha Hima Sohra bad Nongkhlaw. Ki long shi tynrai kiba kyntang ha ka Kolshor Khasi.",
    summary_english: "Syiemlieh and Syiemiong are royal lineage clans tied to the chieftains of Sohra and Nongkhlaw states, sharing revered ancestral ties.",
    citation: "H. Bareh, The History and Culture of the Khasi People (1985)"
  },
  {
    id: "marbaniang-marwein",
    title: "Marbaniang / Marwein / Marsing",
    kpoh_clans: [
      "Marbaniang Bah", "Marbaniang Nongthymmai"
    ],
    shikur_clans: [
      "Marbaniang", "Marwein", "Marsing"
    ],
    teh_kur_clans: [
      "Lyngkhoi", "Nongrum Marwein"
    ],
    distant_clans: [
      "Mawlong", "Kharbuki"
    ],
    summary_khasi: "Ki Marbaniang, Marwein bad Marsing ki hiar na ka kpoh ba ha khlieh jong ka Ri Khasi bad Ri Bhoi, kim bit ban ia poi kha bad ki don ka jingiateh ba skhem bad ki Lyngkhoi.",
    summary_english: "The Marbaniang, Marwein, and Marsing clans trace their roots through the central Khasi plateaus, preserving strict marriage prohibitions across their branches.",
    citation: "Rev. I. Kharkongngor (2004), Entries #112-115"
  },
  {
    id: "mawlong-mawthoh",
    title: "Mawlong / Mawthoh / Mawñiang",
    kpoh_clans: [
      "Mawlong Bah", "Mawlong War"
    ],
    shikur_clans: [
      "Mawlong", "Mawthoh", "Mawñiang"
    ],
    teh_kur_clans: [
      "Khongmawlong", "Mawshun"
    ],
    distant_clans: [
      "Sohlang", "Dorphang"
    ],
    summary_khasi: "Ki kur Mawlong, Mawthoh, bad Mawñiang ki don ka jingiadei kur kaba jan tam ha thain Sohra bad Ri War.",
    summary_english: "Mawlong, Mawthoh, and Mawñiang share close ancestral ties across the southern ridges of Khasi Hills, strictly bound by exogamy.",
    citation: "Traditional Oral Lineages of the War Shella & Sohra (1998)"
  },
  {
    id: "pyngrope-kharsohtun",
    title: "Pyngrope / Kharsohtun / Kharduid",
    kpoh_clans: [
      "Pyngrope Bah"
    ],
    shikur_clans: [
      "Pyngrope", "Kharsohtun", "Kharduid"
    ],
    teh_kur_clans: [
      "Khardukan", "Kharsyntiew"
    ],
    distant_clans: [
      "Kharmyndai"
    ],
    summary_khasi: "Ki Pyngrope, Kharsohtun bad Kharduid ki la pynneh ia ka jinglong shikur naduh hyndai hynthai.",
    summary_english: "The Pyngrope, Kharsohtun, and Kharduid lineages form a tight matrilineal clan group observing strict matrimonial avoidance.",
    citation: "Khasi Heritage Records & Seng Kur Pyngrope Archives"
  }
];

export function findMockClan(jaitQuery: string): TipkurResponse {
  // Check common surnames dataset first for fast verified match
  const common = getCommonSurnameResponse(jaitQuery);
  if (common) {
    return common;
  }

  const normalized = jaitQuery.trim().toLowerCase();
  
  // Find cluster containing the clan in any list
  const matchingClusters = MOCK_CLUSTERS.filter(cluster => {
    const allClans = [
      ...(cluster.kpoh_clans || []),
      ...cluster.shikur_clans,
      ...cluster.teh_kur_clans,
      ...(cluster.distant_clans || [])
    ].map(c => c.toLowerCase());

    return allClans.some(c => c.includes(normalized) || normalized.includes(c));
  });

  if (matchingClusters.length > 0) {
    return {
      mode: "wad-kur",
      query: jaitQuery,
      normalized_query: normalized,
      found: true,
      match_count: matchingClusters.length,
      clusters: matchingClusters,
      disclaimer: "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
    };
  }

  return {
    mode: "wad-kur",
    query: jaitQuery,
    normalized_query: normalized,
    found: false,
    match_count: 0,
    clusters: [],
    disclaimer: "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  };
}

