/**
 * Documented Khasi Clans Service
 * 
 * Historical Sources & Credits:
 * 1. Rev. I. Kharkongngor (2004), "Ka Jymbriew Bad Ka Thymmei Longkur Longjait U Khasi"
 * 2. Babu Spiton Kharakor (1981), "Ki Khun Ki Ksiew U Hynñiew Trep"
 * Sincere credit and heartfelt appreciation are accorded to both authors for their
 * invaluable documentation preserving Khasi kinship, clan names, and cultural identity.
 * 
 * Architecture:
 * The complete catalog of 516 documented Khasi clan names is stored in the compressed
 * JSON asset at /assets/clanList.json and loaded dynamically into Device LocalStorage
 * and memory, preventing main bundle bloat.
 */

export const TOTAL_DOCUMENTED_CLANS = 516;

let cachedClanList: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

// Core initial fallback set of well-known clans in case of offline first boot
export const FALLBACK_CLAN_NAMES: string[] = [
  "Alia", "Aliya", "Amdep", "Amkoi", "Babai", "Bamon", "Bareh", "Bareh Pohkshang",
  "Basaïawmah", "Basaïawmoit", "Basaïawrit", "Basaïawsnai", "Biam", "Binan", "Blah", "Bleiñ",
  "Bon", "Bula", "Byrsat", "Challam", "Chylla", "Dan", "Dhar", "Diengdoh", "Diengdoh Nongstoiñ",
  "Diengdoh Parïong", "Diengdoh-Bah", "Diengdoh-Kylla", "Diengdoh-Shngaiñlang", "Doh", "Doom",
  "Gatphoh", "Giri", "Giri Chyne", "Hajong", "Hek", "Hynniewta", "Ïatam", "Ïaw Shi Bdi",
  "Ïawphñiaw", "Ïongkjam", "Jyrwa", "Khaiñ", "Kharbani", "Kharbhih", "Kharbuki", "Khardohling",
  "Kharkongor", "Kharkrang", "Kharlukhi", "Kharmalki", "Kharmudai", "Kharphanbuh", "Kharphur",
  "Kharraji", "Kharryja", "Kharsyntiew", "Kharumlong", "Khongbuh", "Khongjoh", "Khonglah",
  "Khongsit", "Khongwir", "Khyllait", "Khyllep", "Kurbah", "Kurkalang", "Kyndiah", "Laloo",
  "Lamare", "Langñiuh", "Lyngdoh", "Majaw", "Marngar", "Marpna", "Marweiñ", "Mawri",
  "Mylliemngap", "Ñiewphantang", "Nongbri", "Nongkynrih", "Nongrum", "Nongtdu", "Pakynteiñ",
  "Pala", "Pariat", "Pyngrope", "Rani", "Rapsang", "Ryntathiang", "Sawkmie", "Shabong",
  "Shadap", "Shallam", "Shongwan", "Shullai", "Shylla", "Slong", "Sohtun", "Sun", "Sutnga",
  "Swer", "Syiem", "Syiemlieh", "Synteng", "Tariang", "Thabah", "Thaïang", "Thongni", "Tynsong",
  "Wankhar", "War", "Warbah", "Warjri", "Warlarpih"
];

// Deprecated export for backward compatibility; prefer fetchClanList()
export const CLAN_NAMES: string[] = FALLBACK_CLAN_NAMES;

/**
 * Loads the full 516 documented Khasi clan list.
 * Order: Memory Cache -> Device LocalStorage -> Compressed Asset /assets/clanList.json -> Fallback
 */
export async function fetchClanList(): Promise<string[]> {
  if (cachedClanList && cachedClanList.length > 0) {
    return cachedClanList;
  }

  // 1. Device LocalStorage Cache
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const local = localStorage.getItem('kur_cache_clan_list');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedClanList = parsed;
          return cachedClanList;
        }
      }
    } catch (_) {
      // LocalStorage access fail ignored
    }
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async (): Promise<string[]> => {
    // 2. Fetch compressed JSON asset
    try {
      let res = await fetch('/assets/clanList.json');
      if (!res.ok) {
        res = await fetch('/data/clanList.json');
      }
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.clans) && data.clans.length > 0) {
          cachedClanList = data.clans;
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('kur_cache_clan_list', JSON.stringify(data.clans));
            } catch (_) {}
          }
          return data.clans as string[];
        }
      }
    } catch (err) {
      console.warn('[clanList] Failed to load /assets/clanList.json, using fallback:', err);
    }

    cachedClanList = FALLBACK_CLAN_NAMES;
    return FALLBACK_CLAN_NAMES;
  })();

  return fetchPromise;
}
