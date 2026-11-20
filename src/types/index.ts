export type Language = 'en' | 'kha';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ClanTier = 'origin' | 'kpoh' | 'shikur' | 'tehkur' | 'distant';

export interface ClanCluster {
  id: string;
  title: string;
  shikur_clans: string[];
  teh_kur_clans: string[];
  distant_clans?: string[];
  kpoh_clans?: string[];
  summary_khasi: string;
  summary_english: string;
  citation: string;
}

export interface TipkurResponse {
  mode: string;
  query: string;
  normalized_query: string;
  found: boolean;
  match_count: number;
  clusters: ClanCluster[];
  disclaimer: string;
}

export interface GraphNode {
  id: string;
  label: string;
  tier: ClanTier;
  clusterId?: string;
  degree: number;
  radius: number;
  color: string;
  isOrigin?: boolean;
  clusterTitle?: string;
  citation?: string;
  summaryKhasi?: string;
  summaryEnglish?: string;
  relationshipPath?: {
    khasi: string;
    english: string;
  };
  // D3 force simulation properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  tier: ClanTier;
  distance: number;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ApiConfig {
  baseUrl: string;
  token: string;
  useMock: boolean;
}

// Compatibility Checker Types
export type KinshipVerdict = 
  | 'SANG_DIRECT_KPOH'      // Ring 1: Ka juh ka kpoh (Direct bloodline/womb) - STRICT SANG
  | 'SANG_SHIKUR'           // Ring 2: Ba ia dei kur (Maternal sister clans) - STRICT SANG
  | 'SANG_TEHKUR'           // Ring 3: Ba ia teh kur (Bound/Allied clan covenant) - STRICT SANG
  | 'LINKED_DISTANT'        // Ring 4: Ba don jingiadei (Distant link/caution)
  | 'NO_LINK'               // No direct maternal or paternal kinship identified
  | 'PATERNAL_KHA'          // Level 2: Person 1's father's clan matches Person 2 (Kha / Shi Kpa - Kinship courtesy & respect)
  | 'PATERNAL_SANG';        // Level 2: Strict taboo on paternal side if sharing clan

export interface CompatibilityCheckStep {
  level: 1 | 2 | 3;
  testedPerson1Clan: string;
  testedPerson2Clan: string;
  verdict: KinshipVerdict;
  tierNameKhasi: string;
  tierNameEnglish: string;
  descriptionKhasi: string;
  descriptionEnglish: string;
  clusterMatch?: ClanCluster;
  citation?: string;
}

export interface CompatibilityResult {
  level1: CompatibilityCheckStep;
  level2?: CompatibilityCheckStep;
  overallVerdict: 'SANG' | 'CLEAR' | 'CAUTION' | 'KHA';
  summaryKhasi: string;
  summaryEnglish: string;
  disclaimer: string;
}

