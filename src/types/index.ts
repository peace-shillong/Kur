export type Language = 'en' | 'kha';

export type ThemeMode = 'light' | 'dark' | 'custom';

export type CustomVariant = 'heritage' | 'forest' | 'dawki';

export type HomeBg = 'none' | 'mawbynna' | 'jingkieng-jri';

export interface ThemePalette {
  primary: string;
  primaryHover: string;
  accent: string;
  origin: string;
  kpoh: string;
  shikur: string;
  tehkur: string;
  distant: string;
  canvasBg: string;
  canvasRadial: string;
  canvasTextColor: string;
  canvasTextHalo: string;
  ringColors: string[];
  linkKpoh: string;
  linkShikur: string;
  linkTehkur: string;
  linkDistant: string;
}

export type ClanTier = 'origin' | 'kpoh' | 'shikur' | 'tehkur' | 'distant';

export type ViewMode = 'graph' | 'table';

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

export interface ClanSubmission {
  id: string;
  jait: string;
  fullName: string;
  email: string;
  shikurClans: string;
  tehKurClans: string;
  notes: string;
  submittedAt: string;
}

// Compatibility Checker Types
export type KinshipVerdict = 
  | 'SANG_DIRECT_KPOH'
  | 'SANG_SHIKUR'
  | 'SANG_TEHKUR'
  | 'LINKED_DISTANT'
  | 'NO_LINK'
  | 'PATERNAL_KHA'
  | 'PATERNAL_SANG';

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
