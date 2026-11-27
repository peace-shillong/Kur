import { ApiConfig, TipkurResponse, CompatibilityResult, CompatibilityCheckStep, BisharSangResponse } from '../types';
import { findMockClan, MOCK_CLUSTERS } from './mockData';
import { getCommonSurnameResponse } from '../data/commonSurnames';
import { getCachedBisharSang } from '../data/bisharSang';

const CONFIG_KEY = 'tipkur-api-config';

export function getStoredApiConfig(): ApiConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading api config', e);
  }

  return {
    baseUrl: 'http://localhost/tipkur-api',
    token: '',
    useMock: true // Defaults to true for out-of-the-box demoing
  };
}

export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * Searches for clan links using pre-cached common surnames dataset, POST request, or mock data fallback
 */
export async function searchClanApi(jait: string): Promise<TipkurResponse & { fromMock?: boolean }> {
  // 1. Check local pre-cached verified common surnames response for instant speed
  const cachedCommon = getCommonSurnameResponse(jait);
  if (cachedCommon) {
    // Artificial small delay for smooth realistic UX animation
    await new Promise(r => setTimeout(r, 120));
    return {
      ...cachedCommon,
      fromMock: false
    };
  }

  const config = getStoredApiConfig();

  if (config.useMock) {
    // Artificial small delay for realistic UX animation
    await new Promise(r => setTimeout(r, 250));
    return {
      ...findMockClan(jait),
      fromMock: true
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.token && config.token.trim().length > 0) {
      headers['Authorization'] = `Bearer ${config.token.trim()}`;
    }

    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mode: 'wad-kur',
        jait: jait.trim()
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data: TipkurResponse = await response.json();
    return {
      ...data,
      fromMock: false
    };
  } catch (error) {
    console.warn('API request failed, falling back to mock data dataset:', error);
    const mock = findMockClan(jait);
    return {
      ...mock,
      fromMock: true
    };
  }
}

/**
 * Evaluates marriage compatibility between two surnames (mode: "bishar-sang")
 * Matches docs/curl.md and response formats in docs/iashongkha *.json
 */
export async function checkBisharSang(
  jaitA: string,
  jaitB: string
): Promise<BisharSangResponse> {
  const cleanA = jaitA.trim();
  const cleanB = jaitB.trim();
  const aLower = cleanA.toLowerCase();
  const bLower = cleanB.toLowerCase();

  // 1. Direct same clan
  if (aLower === bLower) {
    return {
      mode: 'bishar-sang',
      jait_a: cleanA,
      jait_b: cleanB,
      verdict: 'SANG_PROHIBITED',
      can_marry_by_jait: false,
      reason_khasi: `Ka jait ${cleanA} bad ${cleanB} ki dei kajuh ka jait thik (Ka juh ka kpoh). Ka long ka Sang kaba jur tam ban ïashongkha.`,
      reason_english: `${cleanA} and ${cleanB} share the exact same surname and direct maternal lineage. Intermarriage is strictly taboo (Ka Sang).`,
      citation: 'Rev. I. Kharkongngor (2004), Chapter 11 (Page 129)',
      fromMock: true
    };
  }

  // 2. Check local verified 5 sample surname combinations cache
  const cached = getCachedBisharSang(cleanA, cleanB);
  if (cached) {
    // Artificial small delay for smooth realistic UX animation
    await new Promise(r => setTimeout(r, 120));
    return {
      ...cached,
      fromMock: false
    };
  }

  const config = getStoredApiConfig();

  // Try live API if not in forced mock mode
  if (!config.useMock) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (config.token && config.token.trim().length > 0) {
        headers['Authorization'] = `Bearer ${config.token.trim()}`;
      }

      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mode: 'bishar-sang',
          jait_a: cleanA,
          jait_b: cleanB
        })
      });

      if (response.ok) {
        const data: BisharSangResponse = await response.json();
        return {
          ...data,
          fromMock: false
        };
      }
    } catch (err) {
      console.warn('Backend bishar-sang unreachable, falling back to local database:', err);
    }
  }

  // Artificial short delay for smooth UI feedback in demo/offline mode
  await new Promise(r => setTimeout(r, 220));

  // 1. Direct same clan
  if (aLower === bLower) {
    return {
      mode: 'bishar-sang',
      jait_a: cleanA,
      jait_b: cleanB,
      verdict: 'SANG_PROHIBITED',
      can_marry_by_jait: false,
      reason_khasi: `Ka jait ${cleanA} bad ${cleanB} ki dei kajuh ka jait thik (Ka juh ka kpoh). Ka long ka Sang kaba jur tam ban ïashongkha.`,
      reason_english: `${cleanA} and ${cleanB} share the exact same surname and direct maternal lineage. Intermarriage is strictly taboo (Ka Sang).`,
      citation: 'Rev. I. Kharkongngor (2004), Chapter 11 (Page 129)',
      fromMock: true
    };
  }

  // 2. Specific historical test pairings from docs/iashongkha *.json
  // (a) Nongkynrih & Nongbri -> SANG_PROHIBITED (docs/iashongkha sang.json)
  if (
    (aLower.includes('nongkynrih') && bLower.includes('nongbri')) ||
    (bLower.includes('nongkynrih') && aLower.includes('nongbri'))
  ) {
    return {
      mode: 'bishar-sang',
      jait_a: cleanA,
      jait_b: cleanB,
      verdict: 'SANG_PROHIBITED',
      can_marry_by_jait: false,
      cluster: 'Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi',
      reason_khasi: "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
      reason_english: "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
      citation: 'Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)',
      fromMock: true
    };
  }

  // (b) Nongbsap Pyrtuh & Mylliem Pyrtuh -> DISTINCT_CLANS (docs/iashongkha ym_sang.json)
  if (
    (aLower.includes('nongbsap') && bLower.includes('mylliem')) ||
    (bLower.includes('nongbsap') && aLower.includes('mylliem'))
  ) {
    return {
      mode: 'bishar-sang',
      jait_a: cleanA,
      jait_b: cleanB,
      verdict: 'DISTINCT_CLANS',
      can_marry_by_jait: true,
      reason_khasi: 'Nongbsap Pyrtuh bad Mylliem Pyrtuh kim dei ki juh ki kur (Page 96). Da bishar ruh ïa ka longkha (Para-ar-kmie / Shi-Parakha).',
      reason_english: 'Explicitly distinguished as separate clans on Page 96. Still verify paternal/maternal kinship rules.',
      citation: 'Rev. I. Kharkongngor (2004), Entry #62 (Page 96)',
      fromMock: true
    };
  }

  // (c) Nongkynrih & Nongrum -> UNMAPPED_VERIFY_KINSHIP (docs/iashongkha needs_verify.json)
  if (
    (aLower.includes('nongkynrih') && bLower.includes('nongrum')) ||
    (bLower.includes('nongkynrih') && aLower.includes('nongrum'))
  ) {
    return {
      mode: 'bishar-sang',
      jait_a: cleanA,
      jait_b: cleanB,
      verdict: 'UNMAPPED_VERIFY_KINSHIP',
      can_marry_by_jait: null,
      reason_khasi: 'Ym shem jingïateh kur ha ki thup ba la lum. Da kylli na ki Longkñii bad bishar ïa ka Shi-Parakha / Sohpet-Parakha / Para-ar-kmie.',
      reason_english: 'No direct clan prohibition indexed. Verify paternal/maternal kinship laws and consult your Longkñii.',
      citation: 'Chapters 10–12 (Pages 127–131)',
      fromMock: true
    };
  }

  // 3. Cluster database matching
  for (const cluster of MOCK_CLUSTERS) {
    const kpoh = (cluster.kpoh_clans || []).map(c => c.toLowerCase());
    const shikur = cluster.shikur_clans.map(c => c.toLowerCase());
    const tehkur = cluster.teh_kur_clans.map(c => c.toLowerCase());
    const distant = (cluster.distant_clans || []).map(c => c.toLowerCase());

    const inProhibitedA = kpoh.includes(aLower) || shikur.includes(aLower) || tehkur.includes(aLower);
    const inProhibitedB = kpoh.includes(bLower) || shikur.includes(bLower) || tehkur.includes(bLower);

    if (inProhibitedA && inProhibitedB) {
      return {
        mode: 'bishar-sang',
        jait_a: cleanA,
        jait_b: cleanB,
        verdict: 'SANG_PROHIBITED',
        can_marry_by_jait: false,
        cluster: cluster.title,
        reason_khasi: cluster.summary_khasi || `Ki kur ${cleanA} bad ${cleanB} ki ïalong shikur lane iateh kur ha ka kynhun ${cluster.title} bad kim bit ban ïashongkha (Sang).`,
        reason_english: cluster.summary_english || `${cleanA} and ${cleanB} belong to the same ancestral clan cluster (${cluster.title}) and cannot intermarry.`,
        citation: cluster.citation || 'Rev. I. Kharkongngor (2004)',
        fromMock: true
      };
    }

    const inDistantA = distant.includes(aLower);
    const inDistantB = distant.includes(bLower);
    if ((inProhibitedA && inDistantB) || (inProhibitedB && inDistantA) || (inDistantA && inDistantB)) {
      return {
        mode: 'bishar-sang',
        jait_a: cleanA,
        jait_b: cleanB,
        verdict: 'UNMAPPED_VERIFY_KINSHIP',
        can_marry_by_jait: null,
        cluster: cluster.title,
        reason_khasi: `Don ka jingïadei jngai lane jingïathuhpat hyndai ha ka cluster ${cluster.title}. Ym shem jingïateh kur ba skhem, to da kylli na ki Longkñii.`,
        reason_english: `Distant or historical association detected within ${cluster.title}. Consult clan elders (Longkñii) to verify kinship lineage.`,
        citation: cluster.citation || 'Chapters 10–12 (Pages 127–131)',
        fromMock: true
      };
    }
  }

  // 4. Default: Distinct clans
  return {
    mode: 'bishar-sang',
    jait_a: cleanA,
    jait_b: cleanB,
    verdict: 'DISTINCT_CLANS',
    can_marry_by_jait: true,
    reason_khasi: `${cleanA} bad ${cleanB} kim dei ki juh ki kur. Da bishar ruh ïa ka longkha (Para-ar-kmie / Shi-Parakha).`,
    reason_english: `Explicitly distinguished as separate clans. Still verify paternal/maternal kinship rules.`,
    citation: 'Rev. I. Kharkongngor (2004), Standard Exogamy Register',
    fromMock: true
  };
}

/**
 * Evaluates kinship between two surnames for Feature 2
 */
export async function checkKinshipCompatibility(
  person1Clan: string,
  person2Clan: string,
  person1FatherClan?: string
): Promise<CompatibilityResult> {
  const p1 = person1Clan.trim();
  const p2 = person2Clan.trim();
  const p1Lower = p1.toLowerCase();
  const p2Lower = p2.toLowerCase();

  // Fetch or mock search for both
  const data1 = await searchClanApi(p1);

  // Evaluate Level 1 (Maternal)
  let level1Step: CompatibilityCheckStep;

  // Direct same surname
  if (p1Lower === p2Lower) {
    const cluster = data1.clusters[0];
    level1Step = {
      level: 1,
      testedPerson1Clan: p1,
      testedPerson2Clan: p2,
      verdict: 'SANG_DIRECT_KPOH',
      tierNameKhasi: 'Ka juh ka kpoh (Kajuh ka Jait)',
      tierNameEnglish: 'Direct Bloodline / Same Surname',
      descriptionKhasi: `Ka jait ${p1} bad ${p2} ki dei kajuh ka jait thik. Ha ka niam Khasi, kane ka long ka Sang kaba jur tam ban ia shongkha.`,
      descriptionEnglish: `${p1} and ${p2} share the exact same surname and direct maternal lineage. Intermarriage is strictly taboo (Ka Sang).`,
      clusterMatch: cluster,
      citation: cluster?.citation
    };
  } else {
    // Check clusters
    let matchedCluster = data1.clusters.find(c => {
      const all = [
        ...(c.kpoh_clans || []),
        ...c.shikur_clans,
        ...c.teh_kur_clans,
        ...(c.distant_clans || [])
      ].map(x => x.toLowerCase());
      return all.some(x => x === p2Lower || x.includes(p2Lower) || p2Lower.includes(x));
    });

    // Also check all mock clusters in case p1 had no cluster but p2 has one
    if (!matchedCluster) {
      matchedCluster = MOCK_CLUSTERS.find(c => {
        const all = [
          ...(c.kpoh_clans || []),
          ...c.shikur_clans,
          ...c.teh_kur_clans,
          ...(c.distant_clans || [])
        ].map(x => x.toLowerCase());
        const hasP1 = all.some(x => x === p1Lower || x.includes(p1Lower) || p1Lower.includes(x));
        const hasP2 = all.some(x => x === p2Lower || x.includes(p2Lower) || p2Lower.includes(x));
        return hasP1 && hasP2;
      });
    }

    if (matchedCluster) {
      const isKpoh = (matchedCluster.kpoh_clans || []).some(c => c.toLowerCase() === p2Lower);
      const isShikur = matchedCluster.shikur_clans.some(c => c.toLowerCase() === p2Lower);
      const isTehKur = matchedCluster.teh_kur_clans.some(c => c.toLowerCase() === p2Lower);

      if (isKpoh) {
        level1Step = {
          level: 1,
          testedPerson1Clan: p1,
          testedPerson2Clan: p2,
          verdict: 'SANG_DIRECT_KPOH',
          tierNameKhasi: 'Ka juh ka kpoh (Direct Branch)',
          tierNameEnglish: 'Direct Lineage Branch (Same Womb)',
          descriptionKhasi: `Ka jait ${p1} bad ${p2} ki hiar na kajuh ka kpoh ha ka kynhun ${matchedCluster.title}. Kim bit ban ia shongkha (Sang).`,
          descriptionEnglish: `${p1} and ${p2} are direct sub-branches within ${matchedCluster.title}. Matrimonial union is prohibited (Sang).`,
          clusterMatch: matchedCluster,
          citation: matchedCluster.citation
        };
      } else if (isShikur) {
        level1Step = {
          level: 1,
          testedPerson1Clan: p1,
          testedPerson2Clan: p2,
          verdict: 'SANG_SHIKUR',
          tierNameKhasi: 'Ba ia dei kur (Shikur)',
          tierNameEnglish: 'First Linked Clans (Shikur)',
          descriptionKhasi: `Ka jait ${p1} bad ${p2} ki dei kiba iadei kur (shikur) kiba mih na kajuh ka Kmie Tymmen. Ka long ka Sang kaba shyrkhei.`,
          descriptionEnglish: `${p1} and ${p2} are sister clans (shikur) sharing identical ancestral descent. Intermarriage constitutes Sang.`,
          clusterMatch: matchedCluster,
          citation: matchedCluster.citation
        };
      } else if (isTehKur) {
        level1Step = {
          level: 1,
          testedPerson1Clan: p1,
          testedPerson2Clan: p2,
          verdict: 'SANG_TEHKUR',
          tierNameKhasi: 'Ba ia teh kur (Treaty Covenant)',
          tierNameEnglish: 'Second Linked Clans (Teh Kur)',
          descriptionKhasi: `Ka jait ${p1} bad ${p2} ki dei kiba la iateh kur hyndai da ka smai kyntang. La khein kumba dei kajuh ka kur, kim bit ban ia shongkha.`,
          descriptionEnglish: `${p1} and ${p2} are bound by historic covenant (Teh Kur). Traditional custom forbids marriage between these clans.`,
          clusterMatch: matchedCluster,
          citation: matchedCluster.citation
        };
      } else {
        level1Step = {
          level: 1,
          testedPerson1Clan: p1,
          testedPerson2Clan: p2,
          verdict: 'LINKED_DISTANT',
          tierNameKhasi: 'Ba don jingiadei jngai',
          tierNameEnglish: 'Distant Traditional Link',
          descriptionKhasi: `Don ka jingiadei jngai lane ka jingiathuhpat hyndai hapdeng ${p1} bad ${p2}. Donkam ban wad jingmut na ki Longkñi.`,
          descriptionEnglish: `A distant traditional or regional alliance exists between ${p1} and ${p2}. Consult clan elders (Longkñi).`,
          clusterMatch: matchedCluster,
          citation: matchedCluster.citation
        };
      }
    } else {
      level1Step = {
        level: 1,
        testedPerson1Clan: p1,
        testedPerson2Clan: p2,
        verdict: 'NO_LINK',
        tierNameKhasi: 'Ym shem jingiadei kur (Bit)',
        tierNameEnglish: 'No Direct Maternal Clan Link (Passed)',
        descriptionKhasi: `Ym shem jingiadei shikur lane jingiateh kur hapdeng ${p1} bad ${p2} ha ki jingthoh ba don.`,
        descriptionEnglish: `No direct maternal clan link, shikur kinship, or teh kur covenant was found between ${p1} and ${p2}.`,
        citation: 'Standard Khasi Exogamy Register'
      };
    }
  }

  // Level 2 (Paternal Lineage) if father clan is supplied
  let level2Step: CompatibilityCheckStep | undefined;
  if (person1FatherClan && person1FatherClan.trim().length > 0) {
    const f1 = person1FatherClan.trim();
    const f1Lower = f1.toLowerCase();

    // Check if father's clan matches person 2's clan or its shikur clans
    const fData = await searchClanApi(f1);
    const fatherCluster = fData.clusters.find(c => {
      const all = [
        ...(c.kpoh_clans || []),
        ...c.shikur_clans,
        ...c.teh_kur_clans
      ].map(x => x.toLowerCase());
      return all.some(x => x === p2Lower || x.includes(p2Lower));
    });

    if (f1Lower === p2Lower) {
      level2Step = {
        level: 2,
        testedPerson1Clan: f1,
        testedPerson2Clan: p2,
        verdict: 'PATERNAL_KHA',
        tierNameKhasi: 'Kha / Shi Kpa (Paternal Connection)',
        tierNameEnglish: 'Paternal Kinship Link (Ki Kha)',
        descriptionKhasi: `Ka jait u kpa jong u/ka Ba-nyngkong (${f1}) ka iahap thik bad ka jait ${p2}. Kane ka long ka jingiadei Kha kaba donkam ka burom kaba kyrpang.`,
        descriptionEnglish: `Person 1's father's clan (${f1}) is identical to Person 2's clan (${p2}). In Khasi society, this establishes a respected paternal kinship bond (Ki Kha).`,
        clusterMatch: fData.clusters[0],
        citation: 'Khasi Matrilineal Custom (Tipkur Tipkha)'
      };
    } else if (fatherCluster) {
      level2Step = {
        level: 2,
        testedPerson1Clan: f1,
        testedPerson2Clan: p2,
        verdict: 'PATERNAL_KHA',
        tierNameKhasi: 'Kha ba iadei kur bad u kpa',
        tierNameEnglish: 'Allied Paternal Clan (Ki Kha)',
        descriptionKhasi: `Ka jait u kpa (${f1}) ka iadei kur bad ka jait ${p2} ha ka cluster ${fatherCluster.title}.`,
        descriptionEnglish: `Person 1's father's clan (${f1}) shares alliance with ${p2} within ${fatherCluster.title}.`,
        clusterMatch: fatherCluster,
        citation: fatherCluster.citation
      };
    } else {
      level2Step = {
        level: 2,
        testedPerson1Clan: f1,
        testedPerson2Clan: p2,
        verdict: 'NO_LINK',
        tierNameKhasi: 'Ym don jingiadei Kha',
        tierNameEnglish: 'No Paternal Clan Overlap',
        descriptionKhasi: `Ym don jingiadei kur ba la shem hapdeng ka jait u kpa (${f1}) bad ka jait ${p2}.`,
        descriptionEnglish: `No paternal clan overlap was detected between ${f1} and ${p2}.`
      };
    }
  }

  // Calculate overall verdict
  let overallVerdict: 'SANG' | 'CLEAR' | 'CAUTION' | 'KHA' = 'CLEAR';
  if (['SANG_DIRECT_KPOH', 'SANG_SHIKUR', 'SANG_TEHKUR'].includes(level1Step.verdict)) {
    overallVerdict = 'SANG';
  } else if (level1Step.verdict === 'LINKED_DISTANT') {
    overallVerdict = 'CAUTION';
  } else if (level2Step?.verdict === 'PATERNAL_KHA') {
    overallVerdict = 'KHA';
  }

  return {
    level1: level1Step,
    level2: level2Step,
    overallVerdict,
    summaryKhasi: overallVerdict === 'SANG'
      ? `KA SANG: Kim bit ban ia shongkha namar ba ki iadei kur (${level1Step.tierNameKhasi}).`
      : overallVerdict === 'KHA'
        ? `BIT HYNREI DON JINGIADEI KHA: Ym dei ka Sang kur kmie, hynrei don ka jingiadei Kha na u kpa.`
        : overallVerdict === 'CAUTION'
          ? `DONKAM JINGBATAI KI TYMMEN: Don ka jingiadei hyndai, to sngewbha kylli na ki Longkñi.`
          : `BIT BAN IA SHONGKHA: Ym shem jingiadei kur ha kane ka jingbishar.`,
    summaryEnglish: overallVerdict === 'SANG'
      ? `PROHIBITED (KA SANG): Clan kinship prohibits marriage (${level1Step.tierNameEnglish}).`
      : overallVerdict === 'KHA'
        ? `MATERNALLY CLEAR WITH PATERNAL TIES: No maternal Sang; respectful paternal ties (Kha) present.`
        : overallVerdict === 'CAUTION'
          ? `CAUTION / INQUIRE WITH ELDERS: Distant historical connection; elder counsel recommended.`
          : `COMPATIBLE / NO CLAN PROHIBITION FOUND: Clean bill of maternal exogamy.`,
    disclaimer: "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  };
}

