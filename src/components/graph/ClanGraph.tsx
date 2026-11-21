import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../../types';
import { useClan, SEA_GREEN_PALETTE } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { KyrdanKurModal } from './KyrdanKurModal';
import { ClanTableView } from './ClanTableView';
import { ShareModal } from '../modals/ShareModal';
import { ClanSubmitModal } from '../forms/ClanSubmitModal';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft, 
  Search, 
  Layers, 
  Table as TableIcon,
  Network,
  Share2,
  AlertCircle,
  PlusCircle,
  SlidersHorizontal
} from 'lucide-react';

export const ClanGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<HTMLCanvasElement, unknown> | null>(null);

  const { 
    graphData, 
    activeTiers, 
    selectedNode, 
    setSelectedNode, 
    resetViewTrigger,
    setIsGraphOpen,
    query,
    searchClan,
    response,
    viewMode,
    setViewMode,
    directLinksCount,
    indirectLinksCount,
    totalLinksCount,
    minimalLinks,
    toggleMinimalLinks,
    hasMoreThan20
  } = useClan();

  const { language } = useLanguage();

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [inlineSearch, setInlineSearch] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isKyrdanModalOpen, setIsKyrdanModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Filter nodes & links based on active tiers
  const visibleNodes = React.useMemo(() => {
    return graphData.nodes.filter(n => activeTiers.has(n.tier));
  }, [graphData.nodes, activeTiers]);

  const visibleLinks = React.useMemo(() => {
    const activeNodeIds = new Set(visibleNodes.map(n => n.id));
    return graphData.links.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      return activeNodeIds.has(sourceId) && activeNodeIds.has(targetId) && activeTiers.has(l.tier);
    });
  }, [graphData.links, visibleNodes, activeTiers]);

  // Main Canvas render function in White Theme with Monochromatic Sea Green
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'graph') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply zoom & pan transformation
    const transform = transformRef.current;
    ctx.translate(transform.x * dpr, transform.y * dpr);
    ctx.scale(transform.k * dpr, transform.k * dpr);

    // 1. Concentric orbital guidance rings around center origin
    const originNode = visibleNodes.find(n => n.tier === 'origin');
    const cx = originNode ? (originNode.x ?? width / (2 * dpr)) : width / (2 * dpr);
    const cy = originNode ? (originNode.y ?? height / (2 * dpr)) : height / (2 * dpr);

    const orbitalRings = [
      { r: 95, color: 'rgba(46, 139, 87, 0.16)' },
      { r: 180, color: 'rgba(64, 191, 119, 0.14)' },
      { r: 260, color: 'rgba(117, 209, 157, 0.12)' },
      { r: 340, color: 'rgba(10, 31, 19, 0.08)' }
    ];

    orbitalRings.forEach(ring => {
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 2. Draw Links
    visibleLinks.forEach(link => {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;
      if (source.x == null || source.y == null || target.x == null || target.y == null) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      const isFocused = (selectedNode && (source.id === selectedNode.id || target.id === selectedNode.id)) ||
                        (hoveredNode && (source.id === hoveredNode.id || target.id === hoveredNode.id));

      if (link.tier === 'kpoh') {
        ctx.strokeStyle = isFocused ? '#1C5434' : 'rgba(28, 84, 52, 0.45)';
        ctx.lineWidth = isFocused ? 3.5 : 2.2;
        ctx.setLineDash([]);
      } else if (link.tier === 'shikur') {
        ctx.strokeStyle = isFocused ? '#2E8B57' : 'rgba(64, 191, 119, 0.40)';
        ctx.lineWidth = isFocused ? 2.8 : 1.8;
        ctx.setLineDash([]);
      } else if (link.tier === 'tehkur') {
        ctx.strokeStyle = isFocused ? '#40BF77' : 'rgba(117, 209, 157, 0.45)';
        ctx.lineWidth = isFocused ? 2.2 : 1.4;
        ctx.setLineDash([6, 5]);
      } else {
        ctx.strokeStyle = isFocused ? '#0A1F13' : 'rgba(10, 31, 19, 0.25)';
        ctx.lineWidth = isFocused ? 1.8 : 1;
        ctx.setLineDash([3, 5]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 3. Draw Nodes with Monochromatic Sea Green
    visibleNodes.forEach(node => {
      if (node.x == null || node.y == null) return;

      const isOrigin = node.tier === 'origin';
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;

      // Glow effect for Origin (#2E8B57) or Selected
      if (isOrigin || isSelected) {
        ctx.beginPath();
        const glowRadius = node.radius + (isSelected ? 10 : 14);
        const glowGrad = ctx.createRadialGradient(node.x, node.y, node.radius * 0.7, node.x, node.y, glowRadius);
        glowGrad.addColorStop(0, 'rgba(46, 139, 87, 0.35)');
        glowGrad.addColorStop(1, 'rgba(46, 139, 87, 0)');
        ctx.fillStyle = glowGrad;
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      // Node background color from monochromatic sea green palette
      ctx.fillStyle = node.color;
      ctx.fill();

      // Crisp White Border ring
      ctx.strokeStyle = isSelected 
        ? '#0f172a' 
        : (isOrigin ? '#ffffff' : '#ffffff');
      ctx.lineWidth = isSelected ? 3.5 : (isOrigin ? 3 : 2);
      ctx.stroke();

      // Pulsing outer subtle ring on Origin main circle
      if (isOrigin) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(46, 139, 87, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Node Label Text
      ctx.font = isOrigin 
        ? 'bold 15px "Plus Jakarta Sans", sans-serif' 
        : `${isSelected || isHovered ? '600' : '500'} 12px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // White halo behind label for crisp contrast
      const labelY = node.y + node.radius + 14;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeText(node.label, node.x, labelY);

      ctx.fillStyle = isOrigin ? '#0A1F13' : '#1e293b';
      ctx.fillText(node.label, node.x, labelY);
    });

    ctx.restore();
  }, [visibleNodes, visibleLinks, selectedNode, hoveredNode, viewMode]);

  // Set up D3 simulation dynamically to window size
  useEffect(() => {
    if (viewMode !== 'graph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const centerX = width / 2;
    const centerY = height / 2;

    const originNode = visibleNodes.find(n => n.tier === 'origin');
    if (originNode) {
      originNode.fx = centerX;
      originNode.fy = centerY;
    }

    const sim = d3.forceSimulation<GraphNode, GraphLink>(visibleNodes)
      .force(
        'link',
        d3.forceLink<GraphNode, GraphLink>(visibleLinks)
          .id(d => d.id)
          .distance(d => d.distance)
          .strength(d => d.strength)
      )
      .force('charge', d3.forceManyBody().strength(d => {
        const node = d as GraphNode;
        return node.tier === 'origin' ? -700 : -290;
      }))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 24).iterations(2))
      .force('center', d3.forceCenter(centerX, centerY).strength(0.08))
      .alphaDecay(0.026);

    sim.on('tick', render);
    simulationRef.current = sim;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sim.force('center', d3.forceCenter(w / 2, h / 2));
      sim.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      sim.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [visibleNodes, visibleLinks, render, viewMode]);

  // D3 Zoom and Pan setup
  useEffect(() => {
    if (viewMode !== 'graph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        render();
      });

    zoomBehaviorRef.current = zoom;
    const d3Canvas = d3.select(canvas);
    d3Canvas.call(zoom);

    const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1);
    transformRef.current = initialTransform;
    d3Canvas.call(zoom.transform, initialTransform);

    return () => {
      d3Canvas.on('.zoom', null);
    };
  }, [render, viewMode]);

  // Handle Reset View Trigger
  useEffect(() => {
    if (resetViewTrigger > 0 && zoomBehaviorRef.current && canvasRef.current && viewMode === 'graph') {
      const d3Canvas = d3.select(canvasRef.current);
      d3Canvas.transition().duration(600).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      if (simulationRef.current) {
        simulationRef.current.alpha(0.6).restart();
      }
    }
  }, [resetViewTrigger, viewMode]);

  // Smoothly center and focus on a selected node
  const focusOnNode = useCallback((node: GraphNode) => {
    const canvas = canvasRef.current;
    if (!canvas || !zoomBehaviorRef.current || node.x == null || node.y == null || viewMode !== 'graph') return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const targetScale = 1.45;

    const targetX = width / 2 - node.x * targetScale;
    const targetY = height / 2 - node.y * targetScale;
    const targetTransform = d3.zoomIdentity.translate(targetX, targetY).scale(targetScale);

    d3.select(canvas)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, targetTransform);

    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  }, [viewMode]);

  // Hit-testing helper
  const getNodeAtPoint = (clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const transform = transformRef.current;

    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const graphX = (canvasX - transform.x) / transform.k;
    const graphY = (canvasY - transform.y) / transform.k;

    for (const node of visibleNodes) {
      if (node.x == null || node.y == null) continue;
      const dx = graphX - node.x;
      const dy = graphY - node.y;
      const hitRadius = Math.max(node.radius + 6, 24);
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  };

  // Node Dragging & Pointer Event Handling
  useEffect(() => {
    if (viewMode !== 'graph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let draggedNode: GraphNode | null = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      const node = getNodeAtPoint(e.clientX, e.clientY);
      if (node) {
        draggedNode = node;
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;

        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        draggedNode.fx = draggedNode.x;
        draggedNode.fy = draggedNode.y;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (draggedNode) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          isDragging = true;
        }

        const transform = transformRef.current;
        const rect = canvas.getBoundingClientRect();
        draggedNode.fx = (e.clientX - rect.left - transform.x) / transform.k;
        draggedNode.fy = (e.clientY - rect.top - transform.y) / transform.k;
      } else {
        const hover = getNodeAtPoint(e.clientX, e.clientY);
        setHoveredNode(hover);
        canvas.style.cursor = hover ? 'pointer' : 'grab';
      }
    };

    const onPointerUp = (_e: PointerEvent) => {
      if (draggedNode) {
        if (!isDragging) {
          setSelectedNode(draggedNode);
          focusOnNode(draggedNode);
        } else {
          if (draggedNode.tier !== 'origin') {
            draggedNode.fx = null;
            draggedNode.fy = null;
          }
        }

        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        draggedNode = null;
        isDragging = false;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [visibleNodes, setSelectedNode, focusOnNode, viewMode]);

  const handleZoom = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !zoomBehaviorRef.current) return;
    d3.select(canvas)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleInlineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineSearch.trim()) {
      searchClan(inlineSearch.trim());
      setInlineSearch('');
      setShowSearchBar(false);
    }
  };

  const handleBackToHome = () => {
    setIsGraphOpen(false);
  };

  const isFound = response?.found === true;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 w-screen h-screen bg-white select-none touch-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* View Switch: Graph Canvas vs Table View */}
      {viewMode === 'graph' ? (
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-grab active:cursor-grabbing bg-radial from-slate-50 via-white to-white"
        />
      ) : (
        <div className="w-full h-full overflow-y-auto pt-24 pb-20 px-4">
          <ClanTableView />
        </div>
      )}

      {/* Floating Top Navigation Header */}
      <div className="absolute top-4 inset-x-4 max-w-6xl mx-auto flex items-center justify-between pointer-events-none z-20 gap-2">
        {/* Back Button (Item 3 in Todo: on physical/UI back press) */}
        <button
          type="button"
          onClick={handleBackToHome}
          className="pointer-events-auto flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 text-slate-800 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 shadow-md backdrop-blur-md transition font-semibold text-xs sm:text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Wad da kawei pat ka jait</span>
          <span className="sm:hidden">Wad pat</span>
        </button>

        {/* Center Top Result Banner (Item 5-7 in Todo) */}
        <div className="pointer-events-auto flex items-center justify-center">
          {isFound ? (
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 border border-emerald-200 shadow-md backdrop-blur-md text-xs sm:text-sm text-slate-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>
                {language === 'kha'
                  ? `Lap ${directLinksCount} ki kur, ${indirectLinksCount} ki jait ba teh kur`
                  : `Found ${directLinksCount} direct links, ${indirectLinksCount} indirect links`}
              </span>

              {hasMoreThan20 && (
                <button
                  type="button"
                  onClick={toggleMinimalLinks}
                  className="hidden md:inline-flex items-center gap-1 ml-1.5 text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{minimalLinks ? `(Show All ${totalLinksCount})` : `(Show Minimal)`}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-50/95 border border-amber-300 shadow-md backdrop-blur-md text-xs sm:text-sm text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="max-w-[200px] sm:max-w-md truncate">
                {language === 'kha'
                  ? 'Ngim don jingtip shaphang ka jait jong phi, da phi don phi lah ban phah mynta'
                  : 'No results found for your surname, if you have information then do let us know'}
              </span>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="ml-1 px-2.5 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Ai Jingtip' : 'Submit Form'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Surname Badge & Search Trigger (Top-Right) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {!showSearchBar ? (
            <button
              type="button"
              onClick={() => setShowSearchBar(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/95 border border-slate-200 shadow-md backdrop-blur-md text-slate-800 hover:bg-slate-50 transition cursor-pointer text-xs sm:text-sm font-semibold"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: SEA_GREEN_PALETTE.origin }} 
              />
              <span className="font-serif font-bold text-slate-900">{query}</span>
              <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          ) : (
            <form onSubmit={handleInlineSearch} className="flex items-center gap-1.5 bg-white rounded-full shadow-lg border border-emerald-300 p-1">
              <input
                type="text"
                value={inlineSearch}
                onChange={e => setInlineSearch(e.target.value)}
                placeholder="Buh ka jait..."
                className="px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:outline-none w-32 sm:w-48 font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowSearchBar(false)}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating Control Dock: Below the Search button area (Items 11, 13, 15 in Todo) */}
      <div className="absolute top-18 right-4 flex flex-col items-center gap-2 z-20 pointer-events-auto">
        {/* Zoom & Reset Controls */}
        {viewMode === 'graph' && (
          <div className="flex flex-col items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 gap-1">
            <button
              type="button"
              onClick={() => handleZoom(1.3)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(0.7)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-4 h-[1px] bg-slate-200" />
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current && zoomBehaviorRef.current) {
                  d3.select(canvasRef.current)
                    .transition()
                    .duration(500)
                    .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
                }
              }}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Table/Graph View Toggle (Item 13 in Todo: below Zoom & Reset) */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'graph' ? 'table' : 'graph')}
            className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
              viewMode === 'table'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
            title={viewMode === 'graph' ? "Switch to Table View" : "Switch to Graph View"}
            aria-label="Toggle Table/Graph View"
          >
            {viewMode === 'graph' ? (
              <TableIcon className="w-4 h-4" />
            ) : (
              <Network className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Share Button (Item 15 in Todo: Share as Image or PDF with watermark) */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer flex items-center justify-center"
            title="Share as Image or PDF"
            aria-label="Share current view"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Center: Ki Kyrdan Kur Details Trigger (Item 9 in Todo: Collapsed by default, opens modal/bottom sheet) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsKyrdanModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-slate-200 shadow-lg text-xs sm:text-sm font-semibold text-slate-800 hover:text-emerald-800 hover:bg-emerald-50 transition cursor-pointer backdrop-blur-md"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>{language === 'kha' ? 'Ki Kyrdan Kur (Legends Details)' : 'Kinship Tiers (Legends)'}</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            {visibleNodes.length}
          </span>
        </button>
      </div>

      {/* Hover Node Tooltip */}
      {hoveredNode && !selectedNode && viewMode === 'graph' && (
        <div 
          className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-slate-200 text-xs z-10 max-w-xs transition-opacity duration-150 text-center"
        >
          <div className="font-semibold text-slate-900 flex items-center justify-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span>{hoveredNode.label}</span>
          </div>
          <div className="text-slate-500 mt-0.5">
            {hoveredNode.relationshipPath?.khasi || hoveredNode.relationshipPath?.english}
          </div>
        </div>
      )}

      {/* Modals */}
      <KyrdanKurModal
        isOpen={isKyrdanModalOpen}
        onClose={() => setIsKyrdanModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        canvasRef={canvasRef}
      />

      <ClanSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        initialSurname={query}
      />
    </div>
  );
};
