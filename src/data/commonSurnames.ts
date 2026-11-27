import { TipkurResponse } from "../types";

/**
 * Historical Clan Datasets & Common Surnames Loader
 * 
 * Sources & Credits:
 * Sourced from the historical research and literary scholarship of:
 * 1. Rev. I. Kharkongngor (2004), "Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi"
 * 2. Babu Spiton Kharakor (1981), "Ki Khun Ki Ksiew U Hynñiew Trep"
 * We express our deepest gratitude and credit to both authors for documenting and
 * preserving the rich genealogical heritage of Ka Jait Bynriew U Hynñiew Trep.
 * 
 * Architecture:
 * The 429 clan connection records are now loaded asynchronously from the compressed
 * JSON asset at /assets/commonSurnames.json, preventing bundle bloat and supporting
 * instant edge/device caching.
 */

// 104 Common Khasi Surnames for fast suggestions & random home carousel
export const COMMON_SURNAMES_LIST: string[] = [
  "Bamon",
  "Diengdoh",
  "Diengdoh Nongstoiñ",
  "Hek",
  "Hynñiewta",
  "Ïawphñiaw",
  "Jyrwa Nongsiej",
  "Khaiñ",
  "Kharbani",
  "Kharbithai",
  "Kharbudon",
  "Kharbuki",
  "Khardohling",
  "Kharkongor",
  "Kharkrang",
  "Kharlukhi",
  "Kharmudai",
  "Kharphur",
  "Kharraji",
  "Kharryja",
  "Kharsyntiew",
  "Kharumlong",
  "Khongbuh",
  "Khongjoh",
  "Khonglah",
  "Khongsit",
  "Khongwir",
  "Khyllait",
  "Khyllep",
  "Kurbah",
  "Kurkalang",
  "Kyndiah",
  "Lahong",
  "Laloo",
  "Langñiuh",
  "Lyngdoh",
  "Lyngdoh Mawdkhap",
  "Lyngdoh Mawlong",
  "Lyngdoh Mawnai",
  "Lyngdoh Mawphlang",
  "Lyngdoh Mylliem",
  "Lyngdoh Mynso",
  "Lyngdoh Nongbri",
  "Lyngdoh Nongkrem",
  "Lyngdoh Nongkseh Sohïong",
  "Lyngdoh Nongrang",
  "Lyngdoh Pyrtuh",
  "Majaw",
  "Marngar",
  "Marpna",
  "Marweiñ",
  "Mawkon",
  "Mawnai",
  "Mawpamkyi",
  "Mawri",
  "Mylliemngap",
  "Ñiewphantang",
  "Nongbri",
  "Nongbsap Pyrtuh",
  "Nongkynrih",
  "Nongneng Daloi",
  "Nongrum",
  "Nongtdu",
  "Pakynteiñ",
  "Pala",
  "Pariat",
  "Rapsang Marbisu",
  "Rapsang Nongpiur",
  "Ryngngait Lyngdoh",
  "Ryntathiang",
  "Sawkmie",
  "Shabong",
  "Shadap",
  "Shallam",
  "Shongwan",
  "Shullai",
  "Shylla",
  "Slong",
  "Sohkhlet",
  "Sohtun",
  "Sun",
  "Syiem Maring Nonglyngdoh",
  "Syiem Mawthoh",
  "Syiem Myriaw",
  "Syiem Nobosohphoh",
  "Syiem Nongbri",
  "Syiem Nongstoiñ",
  "Syiem Shyllong",
  "Syiem Sohra",
  "Syiem Sutnga",
  "Syiemlieh",
  "Synteng",
  "Tangdhara",
  "Tariang",
  "Thabah",
  "Thaïang",
  "Thongni Nongdiang",
  "Thongnirit",
  "Tymthai",
  "Wahlang Pahsyntiew",
  "War Nongjri",
  "War Wahksing",
  "Warbah",
  "Warlarpih"
];

let cachedCommonData: Record<string, TipkurResponse> | null = null;
let loadPromise: Promise<Record<string, TipkurResponse>> | null = null;

/**
 * Normalizes Khasi characters for diacritic-safe comparison
 */
export function normalizeKhasi(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, "i")
    .replace(/[ññ]/g, "n")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Loads the compressed JSON asset containing all 429 common surnames and historical links.
 * Checks memory cache first, then fetches from /assets/commonSurnames.json (with fallback to /data/commonSurnames.json).
 */
export async function loadCommonSurnamesData(): Promise<Record<string, TipkurResponse>> {
  if (cachedCommonData) {
    return cachedCommonData;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      // Primary location: public/assets/commonSurnames.json
      let res = await fetch("/assets/commonSurnames.json");
      if (!res.ok) {
        // Fallback location: public/data/commonSurnames.json
        res = await fetch("/data/commonSurnames.json");
      }
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.data) {
          cachedCommonData = payload.data;
          return cachedCommonData as Record<string, TipkurResponse>;
        }
      }
    } catch (err) {
      console.warn("[commonSurnames] Failed to load compressed JSON asset:", err);
    }
    return {};
  })();

  return loadPromise;
}

/**
 * Synchronous lookup from memory cache (if already loaded)
 */
export function getSyncCommonSurnameResponse(jait: string): TipkurResponse | undefined {
  if (!cachedCommonData || !jait) return undefined;
  const clean = jait.trim();
  const lower = clean.toLowerCase();
  const norm = normalizeKhasi(clean);

  if (cachedCommonData[lower]) return cachedCommonData[lower];
  if (cachedCommonData[norm]) return cachedCommonData[norm];

  for (const [key, data] of Object.entries(cachedCommonData)) {
    if (normalizeKhasi(key) === norm) {
      return data;
    }
  }
  return undefined;
}

/**
 * Looks up a pre-cached wad-kur response from the common surnames compressed JSON asset.
 * Returns the verified TipkurResponse if found, otherwise undefined.
 */
export async function getCommonSurnameResponse(jait: string): Promise<TipkurResponse | undefined> {
  if (!jait || typeof jait !== "string") return undefined;
  
  // 1. Fast check if already in memory
  const syncMatch = getSyncCommonSurnameResponse(jait);
  if (syncMatch) return syncMatch;

  // 2. Load dataset asynchronously
  const data = await loadCommonSurnamesData();
  const clean = jait.trim();
  const lower = clean.toLowerCase();
  const norm = normalizeKhasi(clean);

  if (data[lower]) return data[lower];
  if (data[norm]) return data[norm];

  for (const [key, item] of Object.entries(data)) {
    if (normalizeKhasi(key) === norm) {
      return item;
    }
  }

  return undefined;
}
