import { ApiConfig, TipkurResponse, CompatibilityResult, CompatibilityCheckStep } from '../types';
import { findMockClan, MOCK_CLUSTERS } from './mockData';

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
 * Searches for clan links using POST request or mock data fallback
 */
export async function searchClanApi(jait: string): Promise<TipkurResponse & { fromMock?: boolean }> {
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
      descriptionKhasi: `Ka jait ${p1} bad ${p2} ki dei kajuh ka jait thik. Ha ka niam Khasi, kane ka long ka Sang kaba jur tam ban iashongkha.`,
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
          descriptionKhasi: `Ka jait ${p1} bad ${p2} ki hiar na kajuh ka kpoh ha ka kynhun ${matchedCluster.title}. Kim bit ban iashongkha (Sang).`,
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
          descriptionKhasi: `Ka jait ${p1} bad ${p2} ki dei kiba la iateh kur hyndai da ka smai kyntang. La khein kumba dei kajuh ka kur, kim bit ban iashongkha.`,
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
      ? `KA SANG: Kim bit ban iashongkha namar ba ki iadei kur (${level1Step.tierNameKhasi}).`
      : overallVerdict === 'KHA'
      ? `BIT HYNREI DON JINGIADEI KHA: Ym dei ka Sang kur kmie, hynrei don ka jingiadei Kha na u kpa.`
      : overallVerdict === 'CAUTION'
      ? `DONKAM JINGBATAI KI TYMMEN: Don ka jingiadei hyndai, to sngewbha kylli na ki Longkñi.`
      : `BIT BAN IASHONGKHA: Ym shem jingiadei kur ha kane ka jingbishar.`,
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

