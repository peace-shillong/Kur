import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GraphData, GraphNode, GraphLink, ClanTier, TipkurResponse, ViewMode } from '../types';
import { searchClanApi, getStoredApiConfig } from '../services/api';

interface ClanContextType {
  query: string;
  response: TipkurResponse | null;
  graphData: GraphData;
  rawGraphData: GraphData;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
  activeTiers: Set<ClanTier>;
  selectedNode: GraphNode | null;
  isGraphOpen: boolean;
  viewMode: ViewMode;
  minimalLinks: boolean;
  hasMoreThan20: boolean;
  directLinksCount: number;
  indirectLinksCount: number;
  totalLinksCount: number;
  isMockMode: boolean;
  isLiveApiReachable: boolean;
  resetViewTrigger: number;
  searchClan: (jait: string) => Promise<void>;
  toggleTier: (tier: ClanTier) => void;
  setSelectedNode: (node: GraphNode | null) => void;
  clearHistory: () => void;
  triggerResetView: () => void;
  setIsGraphOpen: (open: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setMinimalLinks: (minimal: boolean) => void;
  toggleMinimalLinks: () => void;
  clearAllAppData: () => void;
}

const ClanContext = createContext<ClanContextType | undefined>(undefined);

const RECENT_SEARCHES_KEY = 'tipkur-recent-searches';

// Monochromatic sea green palette based on #2E8B57
export const SEA_GREEN_PALETTE = {
  origin: '#2E8B57',   // Base Sea Green (Main circle)
  kpoh: '#1C5434',     // Dark Sea Green / Sage (Level 1: Ka juh ka kpoh)
  shikur: '#40BF77',   // Vibrant Sea Green (Level 2: Ba ia dei kur / Shikur)
  tehkur: '#75D19D',   // Light Sea Green (Level 3: Ba ia teh kur)
  distant: '#0A1F13'   // Deepest Green / Dark Forest (Level 4: Distant)
};

export const ClanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<TipkurResponse | null>(null);
  const [rawGraphData, setRawGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [minimalLinks, setMinimalLinks] = useState<boolean>(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [isLiveApiReachable, setIsLiveApiReachable] = useState<boolean>(false);
  const [resetViewTrigger, setResetViewTrigger] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const [activeTiers, setActiveTiers] = useState<Set<ClanTier>>(
    new Set(['origin', 'kpoh', 'shikur', 'tehkur', 'distant'])
  );

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Diengdoh', 'Nongkynrih', 'Kharkongor', 'Laloo', 'Syiemlieh'];
    } catch {
      return ['Diengdoh', 'Nongkynrih'];
    }
  });

  const triggerResetView = () => setResetViewTrigger(prev => prev + 1);

  const toggleTier = (tier: ClanTier) => {
    setActiveTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        if (next.size > 1) next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const toggleMinimalLinks = () => {
    setMinimalLinks(prev => !prev);
  };

  // Full transform to Graph Nodes & Links without limits
  const transformToRawGraph = useCallback((res: TipkurResponse, searchedClan: string): GraphData => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    const originId = searchedClan.trim();
    const primaryCluster = res.clusters[0];

    // Main Circle (Center Node) -> Sea Green #2E8B57
    const originNode: GraphNode = {
      id: originId.toLowerCase(),
      label: originId,
      tier: 'origin',
      degree: 0,
      radius: 36,
      color: SEA_GREEN_PALETTE.origin,
      isOrigin: true,
      clusterTitle: primaryCluster?.title || 'Origin Clan',
      citation: primaryCluster?.citation,
      summaryKhasi: primaryCluster?.summary_khasi,
      summaryEnglish: primaryCluster?.summary_english,
      relationshipPath: {
        khasi: `Ka jait ba wad (${originId})`,
        english: `Search Origin Surname (${originId})`
      }
    };

    nodes.push(originNode);
    nodeMap.set(originNode.id, originNode);

    if (!res.found || res.clusters.length === 0) {
      return { nodes, links };
    }

    res.clusters.forEach(cluster => {
      // Ring 1: Direct Bloodline / Kpoh -> #1C5434
      const kpohClans = cluster.kpoh_clans || [];
      kpohClans.forEach(clan => {
        const id = clan.toLowerCase();
        if (id === originNode.id || nodeMap.has(id)) return;

        const node: GraphNode = {
          id,
          label: clan,
          tier: 'kpoh',
          degree: 1,
          radius: 25,
          color: SEA_GREEN_PALETTE.kpoh,
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          citation: cluster.citation,
          summaryKhasi: cluster.summary_khasi,
          summaryEnglish: cluster.summary_english,
          relationshipPath: {
            khasi: `${originId} → Ka juh ka kpoh (${clan})`,
            english: `${originId} → Same Womb / Direct Bloodline (${clan})`
          }
        };
        nodes.push(node);
        nodeMap.set(id, node);

        links.push({
          source: originNode.id,
          target: id,
          tier: 'kpoh',
          distance: 90,
          strength: 1.0
        });
      });

      // Ring 2: First Linked Clans (Shikur) -> #40BF77
      const shikurClans = cluster.shikur_clans || [];
      const primaryKpohId = kpohClans.length > 0 ? kpohClans[0].toLowerCase() : originNode.id;

      shikurClans.forEach(clan => {
        const id = clan.toLowerCase();
        if (id === originNode.id || nodeMap.has(id)) return;

        const node: GraphNode = {
          id,
          label: clan,
          tier: 'shikur',
          degree: 2,
          radius: 20,
          color: SEA_GREEN_PALETTE.shikur,
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          citation: cluster.citation,
          summaryKhasi: cluster.summary_khasi,
          summaryEnglish: cluster.summary_english,
          relationshipPath: {
            khasi: `${originId} → Ba ia dei kur / Shikur (${clan})`,
            english: `${originId} → Maternal Sister Clan / Shikur (${clan})`
          }
        };
        nodes.push(node);
        nodeMap.set(id, node);

        const connectTo = (nodes.length % 3 === 0 && primaryKpohId !== originNode.id) ? primaryKpohId : originNode.id;
        links.push({
          source: connectTo,
          target: id,
          tier: 'shikur',
          distance: 175,
          strength: 0.7
        });
      });

      // Ring 3: Second Linked Clans (Teh Kur) -> #75D19D
      const tehKurClans = cluster.teh_kur_clans || [];
      tehKurClans.forEach(clan => {
        const id = clan.toLowerCase();
        if (id === originNode.id || nodeMap.has(id)) return;

        const node: GraphNode = {
          id,
          label: clan,
          tier: 'tehkur',
          degree: 3,
          radius: 18,
          color: SEA_GREEN_PALETTE.tehkur,
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          citation: cluster.citation,
          summaryKhasi: cluster.summary_khasi,
          summaryEnglish: cluster.summary_english,
          relationshipPath: {
            khasi: `${originId} → Ba ia teh kur / Smai (${clan})`,
            english: `${originId} → Covenant Bound Clan / Teh Kur (${clan})`
          }
        };
        nodes.push(node);
        nodeMap.set(id, node);

        links.push({
          source: originNode.id,
          target: id,
          tier: 'tehkur',
          distance: 255,
          strength: 0.45
        });
      });

      // Ring 4: Distant Links -> #0A1F13
      const distantClans = cluster.distant_clans || [];
      distantClans.forEach(clan => {
        const id = clan.toLowerCase();
        if (id === originNode.id || nodeMap.has(id)) return;

        const node: GraphNode = {
          id,
          label: clan,
          tier: 'distant',
          degree: 4,
          radius: 15,
          color: SEA_GREEN_PALETTE.distant,
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          citation: cluster.citation,
          summaryKhasi: cluster.summary_khasi,
          summaryEnglish: cluster.summary_english,
          relationshipPath: {
            khasi: `${originId} → Ba don jingiadei jngai (${clan})`,
            english: `${originId} → Distant Historical Alliance (${clan})`
          }
        };
        nodes.push(node);
        nodeMap.set(id, node);

        links.push({
          source: originNode.id,
          target: id,
          tier: 'distant',
          distance: 335,
          strength: 0.25
        });
      });
    });

    return { nodes, links };
  }, []);

  // Filter with limits per Todo item 17:
  // For Clans that have more than 20 links: max 12 for kpoh, max 7 for shikur, max 5 for other links
  const filterGraphWithLimits = useCallback((raw: GraphData, useMinimal: boolean): GraphData => {
    if (!useMinimal) {
      return raw;
    }

    const nonOriginNodes = raw.nodes.filter(n => n.tier !== 'origin');
    if (nonOriginNodes.length <= 20) {
      return raw;
    }

    const origin = raw.nodes.find(n => n.tier === 'origin');
    const kpohNodes = raw.nodes.filter(n => n.tier === 'kpoh').slice(0, 12);
    const shikurNodes = raw.nodes.filter(n => n.tier === 'shikur').slice(0, 7);
    const tehKurNodes = raw.nodes.filter(n => n.tier === 'tehkur').slice(0, 5);
    const distantNodes = raw.nodes.filter(n => n.tier === 'distant').slice(0, 5);

    const filteredNodes: GraphNode[] = [];
    if (origin) filteredNodes.push(origin);
    filteredNodes.push(...kpohNodes, ...shikurNodes, ...tehKurNodes, ...distantNodes);

    const allowedNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = raw.links.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      return allowedNodeIds.has(sourceId) && allowedNodeIds.has(targetId);
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  }, []);

  // Re-compute graphData whenever rawGraphData or minimalLinks changes
  useEffect(() => {
    const next = filterGraphWithLimits(rawGraphData, minimalLinks);
    setGraphData(next);
  }, [rawGraphData, minimalLinks, filterGraphWithLimits]);

  // Compute stats
  const totalLinksCount = rawGraphData.nodes.filter(n => n.tier !== 'origin').length;
  const hasMoreThan20 = totalLinksCount > 20;

  const directLinksCount = rawGraphData.nodes.filter(
    n => n.tier === 'kpoh' || n.tier === 'shikur'
  ).length;

  const indirectLinksCount = rawGraphData.nodes.filter(
    n => n.tier === 'tehkur' || n.tier === 'distant'
  ).length;

  const searchClan = useCallback(async (jait: string) => {
    if (!jait || !jait.trim()) return;
    const cleanJait = jait.trim();
    setLoading(true);
    setError(null);
    setSelectedNode(null);

    try {
      const config = getStoredApiConfig();
      setIsMockMode(config.useMock);

      const res = await searchClanApi(cleanJait);
      setQuery(cleanJait);
      setResponse(res);
      setIsLiveApiReachable(!res.fromMock);

      const rawGData = transformToRawGraph(res, cleanJait);
      setRawGraphData(rawGData);

      // Default minimalLinks to true if links exceed 20
      const count = rawGData.nodes.filter(n => n.tier !== 'origin').length;
      setMinimalLinks(count > 20);

      // Open fullscreen graph on search!
      setIsGraphOpen(true);
      window.history.pushState({ graph: true, clan: cleanJait }, '');

      // Save to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s.toLowerCase() !== cleanJait.toLowerCase());
        const updated = [cleanJait, ...filtered].slice(0, 8);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });

      triggerResetView();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error querying clan records';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [transformToRawGraph]);

  // Handle Physical / Browser Back Press (Item 3 in Todo)
  useEffect(() => {
    const handlePopState = () => {
      // If user hit browser back or phone back gesture, return to home page
      setIsGraphOpen(false);
      setSelectedNode(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const clearAllAppData = () => {
    localStorage.clear();
    setRecentSearches([]);
    setRawGraphData({ nodes: [], links: [] });
    setGraphData({ nodes: [], links: [] });
    setQuery('');
    setResponse(null);
    setIsGraphOpen(false);
  };

  return (
    <ClanContext.Provider
      value={{
        query,
        response,
        graphData,
        rawGraphData,
        loading,
        error,
        recentSearches,
        activeTiers,
        selectedNode,
        isGraphOpen,
        viewMode,
        minimalLinks,
        hasMoreThan20,
        directLinksCount,
        indirectLinksCount,
        totalLinksCount,
        isMockMode,
        isLiveApiReachable,
        searchClan,
        toggleTier,
        setSelectedNode,
        clearHistory,
        resetViewTrigger,
        triggerResetView,
        setIsGraphOpen,
        setViewMode,
        setMinimalLinks,
        toggleMinimalLinks,
        clearAllAppData
      }}
    >
      {children}
    </ClanContext.Provider>
  );
};

export const useClan = () => {
  const context = useContext(ClanContext);
  if (!context) throw new Error('useClan must be used within ClanProvider');
  return context;
};
