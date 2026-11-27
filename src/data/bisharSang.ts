import { BisharSangResponse } from '../types';

/**
 * Normalizes Khasi characters for diacritic-safe comparison
 */
function normalizeKhasi(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, 'i')
    .replace(/[ññ]/g, 'n')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Order-independent pair key generator for surname combinations
 */
export function makeBisharPairKey(jaitA: string, jaitB: string): string {
  const normA = normalizeKhasi(jaitA.trim());
  const normB = normalizeKhasi(jaitB.trim());
  return normA < normB ? `${normA}:::${normB}` : `${normB}:::${normA}`;
}

/**
 * 5 Verified Sample Bishar Sang Surname Responses from docs/bishar-sang-sample
 */
export const BISHAR_SANG_SAMPLES: BisharSangResponse[] = [
  {
    mode: "bishar-sang",
    jait_a: "Nongkynrih",
    jait_b: "Nongbri",
    verdict: "SANG_PROHIBITED",
    can_marry_by_jait: false,
    cluster: "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
    reason_khasi: "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
    reason_english: "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
    citation: "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
  },
  {
    mode: "bishar-sang",
    jait_a: "Nongkynrih",
    jait_b: "Nongrum",
    verdict: "UNMAPPED_VERIFY_KINSHIP",
    can_marry_by_jait: null,
    reason_khasi: "Ym shem jingïateh kur ha ki thup ba la lum. Da kylli na ki Longkñii bad bishar ïa ka Shi-Parakha / Sohpet-Parakha / Para-ar-kmie.",
    reason_english: "No direct clan prohibition indexed. Verify paternal/maternal kinship laws and consult your Longkñii.",
    citation: "Chapters 10–12 (Pages 127–131)"
  },
  {
    mode: "bishar-sang",
    jait_a: "Diengdoh",
    jait_b: "Laloo",
    verdict: "SANG_PROHIBITED",
    can_marry_by_jait: false,
    cluster: "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
    reason_khasi: "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
    reason_english: "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
    citation: "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
  },
  {
    mode: "bishar-sang",
    jait_a: "Diengdoh",
    jait_b: "Syngngai",
    verdict: "SANG_PROHIBITED",
    can_marry_by_jait: false,
    cluster: "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
    reason_khasi: "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
    reason_english: "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
    citation: "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
  },
  {
    mode: "bishar-sang",
    jait_a: "Nongbsap Pyrtuh",
    jait_b: "Mylliem Pyrtuh",
    verdict: "DISTINCT_CLANS",
    can_marry_by_jait: true,
    reason_khasi: "Nongbsap Pyrtuh bad Mylliem Pyrtuh kim dei ki juh ki kur (Page 96). Da bishar ruh ïa ka longkha (Para-ar-kmie / Shi-Parakha).",
    reason_english: "Explicitly distinguished as separate clans on Page 96. Still verify paternal/maternal kinship rules.",
    citation: "Rev. I. Kharkongngor (2004), Entry #62 (Page 96)"
  }
];

/**
 * Lookup dictionary indexed by symmetric clan pair keys
 */
export const BISHAR_SANG_CACHE: Record<string, BisharSangResponse> = {
  "nongbri:::nongkynrih": BISHAR_SANG_SAMPLES[0],
  "nongkynrih:::nongrum": BISHAR_SANG_SAMPLES[1],
  "diengdoh:::laloo": BISHAR_SANG_SAMPLES[2],
  "diengdoh:::syngngai": BISHAR_SANG_SAMPLES[3],
  "mylliem pyrtuh:::nongbsap pyrtuh": BISHAR_SANG_SAMPLES[4]
};

/**
 * Retrieves a cached Bishar Sang evaluation for the 5 sample surname combinations:
 * 1. Nongkynrih & Nongbri (SANG_PROHIBITED)
 * 2. Nongkynrih & Nongrum (UNMAPPED_VERIFY_KINSHIP)
 * 3. Diengdoh & Laloo (SANG_PROHIBITED)
 * 4. Diengdoh & Syngngai (SANG_PROHIBITED)
 * 5. Nongbsap Pyrtuh & Mylliem Pyrtuh (DISTINCT_CLANS)
 *
 * Supports symmetric lookup (Person 1 + Person 2 or Person 2 + Person 1)
 * with case-insensitive and diacritic-insensitive normalization.
 */
export function getCachedBisharSang(jaitA: string, jaitB: string): BisharSangResponse | undefined {
  if (!jaitA || !jaitB || typeof jaitA !== 'string' || typeof jaitB !== 'string') {
    return undefined;
  }

  const key = makeBisharPairKey(jaitA, jaitB);
  const cached = BISHAR_SANG_CACHE[key];
  if (!cached) return undefined;

  // Return a fresh response matching the caller's clan arguments
  return {
    ...cached,
    jait_a: jaitA.trim(),
    jait_b: jaitB.trim(),
    fromMock: false
  };
}
