import React, { createContext, useContext, useState, useCallback } from 'react';
import { GraphData, GraphNode, GraphLink, ClanTier, TipkurResponse } from '../types';
import { searchClanApi, getStoredApiConfig } from '../services/api';

interface ClanContextType {
  query: string;
  response: TipkurResponse | null;
  graphData: GraphData;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
  activeTiers: Set<ClanTier>;
  selectedNode: GraphNode | null;
  isGraphOpen: boolean;
  isMockMode: boolean;
  isLiveApiReachable: boolean;
  searchClan: (jait: string) => Promise<void>;
  toggleTier: (tier: ClanTier) => void;
  setSelectedNode: (node: GraphNode | null) => void;
  clearHistory: () => void;
  resetViewTrigger: number;
  triggerResetView: () => void;
  setIsGraphOpen: (open: boolean) => void;
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
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(false);
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

  const transformToGraph = useCallback((res: TipkurResponse, searchedClan: string): GraphData => {
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

      const gData = transformToGraph(res, cleanJait);
      setGraphData(gData);

      // Open fullscreen graph on search!
      setIsGraphOpen(true);

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
  }, [transformToGraph]);

  return (
    <ClanContext.Provider
      value={{
        query,
        response,
        graphData,
        loading,
        error,
        recentSearches,
        activeTiers,
        selectedNode,
        isGraphOpen,
        isMockMode,
        isLiveApiReachable,
        searchClan,
        toggleTier,
        setSelectedNode,
        clearHistory,
        resetViewTrigger,
        triggerResetView,
        setIsGraphOpen
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
