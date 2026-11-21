import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink, ClanTier } from '../../types';
import { useClan } from '../../context/ClanContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { shareToWhatsApp } from '../../utils/shareUtils';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
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
  AlertCircle,
  PlusCircle,
  SlidersHorizontal,
  Download,
  X,
  Loader2
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
  const { palette, resolvedTheme } = useTheme();

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [inlineSearch, setInlineSearch] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState<boolean>(false);
  const [isKyrdanModalOpen, setIsKyrdanModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [activeEdgeInfo, setActiveEdgeInfo] = useState<{
    source: GraphNode;
    target: GraphNode;
    tier: ClanTier;
    relationshipPath?: { khasi?: string; english?: string };
    x: number;
    y: number;
  } | null>(null);
  const originTapTimerRef = useRef<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Detect iOS to prevent form auto-focus zoom on iOS devices
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }, []);

  // Close active inline search when user clicks outside or presses Escape
  useEffect(() => {
    if (!showSearchBar) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchBar(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearchBar(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSearchBar]);

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

  // Main Canvas render function with dynamic Theme Palette (Light, Dark, Custom)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'graph') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    // Fill background with active theme canvasBg
    ctx.fillStyle = palette.canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Apply zoom & pan transformation
    const transform = transformRef.current;
    ctx.translate(transform.x * dpr, transform.y * dpr);
    ctx.scale(transform.k * dpr, transform.k * dpr);

    // 1. Concentric orbital guidance rings around center origin
    const originNode = visibleNodes.find(n => n.tier === 'origin');
    const cx = originNode ? (originNode.x ?? width / (2 * dpr)) : width / (2 * dpr);
    const cy = originNode ? (originNode.y ?? height / (2 * dpr)) : height / (2 * dpr);

    const orbitalRings = [
      { r: 95, color: palette.ringColors[0] || 'rgba(46, 139, 87, 0.16)' },
      { r: 180, color: palette.ringColors[1] || 'rgba(64, 191, 119, 0.14)' },
      { r: 260, color: palette.ringColors[2] || 'rgba(117, 209, 157, 0.12)' },
      { r: 340, color: palette.ringColors[3] || 'rgba(10, 31, 19, 0.08)' }
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
        (hoveredNode && (source.id === hoveredNode.id || target.id === hoveredNode.id)) ||
        (activeEdgeInfo && ((source.id === activeEdgeInfo.source.id && target.id === activeEdgeInfo.target.id) ||
          (source.id === activeEdgeInfo.target.id && target.id === activeEdgeInfo.source.id)));

      if (link.tier === 'kpoh') {
        ctx.strokeStyle = isFocused ? palette.kpoh : palette.linkKpoh;
        ctx.lineWidth = isFocused ? 3.5 : 2.2;
        ctx.setLineDash([]);
      } else if (link.tier === 'shikur') {
        ctx.strokeStyle = isFocused ? palette.shikur : palette.linkShikur;
        ctx.lineWidth = isFocused ? 2.8 : 1.8;
        ctx.setLineDash([]);
      } else if (link.tier === 'tehkur') {
        ctx.strokeStyle = isFocused ? palette.tehkur : palette.linkTehkur;
        ctx.lineWidth = isFocused ? 2.2 : 1.4;
        ctx.setLineDash([6, 5]);
      } else {
        ctx.strokeStyle = isFocused ? palette.distant : palette.linkDistant;
        ctx.lineWidth = isFocused ? 1.8 : 1;
        ctx.setLineDash([3, 5]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 3. Draw Nodes with Dynamic Theme Palette
    visibleNodes.forEach(node => {
      if (node.x == null || node.y == null) return;

      const isOrigin = node.tier === 'origin';
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const nodeColor = (palette as any)[node.tier] || node.color;

      // Glow effect for Origin or Selected
      if (isOrigin || isSelected) {
        ctx.beginPath();
        const glowRadius = node.radius + (isSelected ? 10 : 14);
        const glowGrad = ctx.createRadialGradient(node.x, node.y, node.radius * 0.7, node.x, node.y, glowRadius);
        glowGrad.addColorStop(0, `${palette.origin}66`);
        glowGrad.addColorStop(1, `${palette.origin}00`);
        ctx.fillStyle = glowGrad;
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      // Node background color from dynamic theme palette
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Border ring
      ctx.strokeStyle = isSelected
        ? (resolvedTheme === 'dark' ? '#ffffff' : '#0f172a')
        : (resolvedTheme === 'dark' ? '#090e0c' : '#ffffff');
      ctx.lineWidth = isSelected ? 3.5 : (isOrigin ? 3 : 2);
      ctx.stroke();

      // Pulsing outer subtle ring on Origin main circle
      if (isOrigin) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `${palette.origin}90`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Node Label Text
      ctx.font = isOrigin
        ? 'bold 15px "Plus Jakarta Sans", sans-serif'
        : `${isSelected || isHovered ? '600' : '500'} 12px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Halo behind label for crisp contrast in both light and dark
      const labelY = node.y + node.radius + 14;
      ctx.strokeStyle = palette.canvasTextHalo;
      ctx.lineWidth = 4;
      ctx.strokeText(node.label, node.x, labelY);

      ctx.fillStyle = isOrigin ? palette.origin : palette.canvasTextColor;
      ctx.fillText(node.label, node.x, labelY);
    });

    ctx.restore();
  }, [visibleNodes, visibleLinks, selectedNode, hoveredNode, viewMode, palette, resolvedTheme]);

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

  // Hit-testing for edges (connecting lines between clans) in screen coordinates
  const getEdgeAtPoint = (clientX: number, clientY: number): { link: GraphLink; source: GraphNode; target: GraphNode } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const transform = transformRef.current;
    const tapX = clientX - rect.left;
    const tapY = clientY - rect.top;

    const nodeMap = new Map<string, GraphNode>();
    for (const n of visibleNodes) {
      nodeMap.set(n.id, n);
    }

    // Screen pixel threshold: 30px screen radius makes tapping lines effortless on mobile & desktop
    const hitThreshold = 30;
    let closest: { link: GraphLink; source: GraphNode; target: GraphNode } | null = null;
    let minDistance = hitThreshold;

    for (const link of visibleLinks) {
      const source = typeof link.source === 'object' ? (link.source as GraphNode) : nodeMap.get(link.source as string);
      const target = typeof link.target === 'object' ? (link.target as GraphNode) : nodeMap.get(link.target as string);
      if (!source || !target || source.x == null || source.y == null || target.x == null || target.y == null) continue;

      // Endpoints in screen pixels
      const x1 = source.x * transform.k + transform.x;
      const y1 = source.y * transform.k + transform.y;
      const x2 = target.x * transform.k + transform.x;
      const y2 = target.y * transform.k + transform.y;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;

      // Project point onto line segment in screen space
      const t = Math.max(0, Math.min(1, ((tapX - x1) * dx + (tapY - y1) * dy) / lenSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;

      const dist = Math.hypot(tapX - projX, tapY - projY);
      if (dist <= minDistance) {
        minDistance = dist;
        closest = { link, source, target };
      }
    }
    return closest;
  };

  // Double tap on empty space: Zooms in up to 4 levels, or zooms out if already zoomed in
  const handleEmptySpaceDoubleTap = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !zoomBehaviorRef.current || viewMode !== 'graph') return;

    const currentScale = transformRef.current.k;
    const isZoomedIn = currentScale > 1.35;

    if (!isZoomedIn) {
      // Zoom in up to 4 levels (scale ~3.0) centered at double-tap position
      const rect = canvas.getBoundingClientRect();
      const tapX = clientX - rect.left;
      const tapY = clientY - rect.top;
      const targetScale = 3.0;

      const newX = tapX - (tapX - transformRef.current.x) * (targetScale / currentScale);
      const newY = tapY - (tapY - transformRef.current.y) * (targetScale / currentScale);

      d3.select(canvas)
        .transition()
        .duration(450)
        .ease(d3.easeCubicOut)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.translate(newX, newY).scale(targetScale)
        );
    } else {
      // Zoom out back to default identity view (1x overview)
      d3.select(canvas)
        .transition()
        .duration(450)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  }, [viewMode]);

  // Screen-space hit-testing helper for circles
  const getNodeAtPoint = (clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const transform = transformRef.current;

    const tapX = clientX - rect.left;
    const tapY = clientY - rect.top;

    let closestNode: GraphNode | null = null;
    let minDistance = Infinity;

    for (const node of visibleNodes) {
      if (node.x == null || node.y == null) continue;
      const nodeScreenX = node.x * transform.k + transform.x;
      const nodeScreenY = node.y * transform.k + transform.y;
      const dist = Math.hypot(tapX - nodeScreenX, tapY - nodeScreenY);

      // Generous screen-space hit radius (at least 28px screen radius for effortless touch)
      const hitRadius = Math.max(node.radius * transform.k + 12, 28);
      if (dist <= hitRadius && dist < minDistance) {
        minDistance = dist;
        closestNode = node;
      }
    }
    return closestNode;
  };

  // Uniform Gesture Handling for All Platforms (Desktop, iOS, Android)
  useEffect(() => {
    if (viewMode !== 'graph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let draggedNode: GraphNode | null = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastOriginTapTime = 0;
    let lastEmptyTapTime = 0;
    let lastEmptyTapPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;

      const node = getNodeAtPoint(e.clientX, e.clientY);
      if (node) {
        draggedNode = node;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (draggedNode) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dragThreshold = e.pointerType === 'touch' ? 14 : 5;
        if (!isDragging && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
          isDragging = true;
          if (simulationRef.current) {
            simulationRef.current.alphaTarget(0.3).restart();
          }
        }

        if (isDragging) {
          const transform = transformRef.current;
          const rect = canvas.getBoundingClientRect();
          draggedNode.fx = (e.clientX - rect.left - transform.x) / transform.k;
          draggedNode.fy = (e.clientY - rect.top - transform.y) / transform.k;
        }
      } else {
        // Desktop only: hover over circle triggers tooltip
        if (e.pointerType === 'mouse') {
          const hover = getNodeAtPoint(e.clientX, e.clientY);
          setHoveredNode(hover);
          canvas.style.cursor = hover ? 'pointer' : 'grab';
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const movedDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      const tapThreshold = e.pointerType === 'touch' ? 16 : 6;
      const isTap = !isDragging && movedDist <= tapThreshold;

      if (draggedNode) {
        if (isTap) {
          // Tap on a circle (origin or non-origin)
          if (draggedNode.tier === 'origin') {
            const now = Date.now();
            if (now - lastOriginTapTime < 340) {
              // Quick double-tap on searched surname circle -> show origin pop-up
              if (originTapTimerRef.current) {
                window.clearTimeout(originTapTimerRef.current);
                originTapTimerRef.current = null;
              }
              lastOriginTapTime = 0;
              setHoveredNode(draggedNode);
              setActiveEdgeInfo(null);
            } else {
              lastOriginTapTime = now;
              if (e.pointerType === 'mouse') {
                // Desktop: click opens modal directly
                setSelectedNode(draggedNode);
                focusOnNode(draggedNode);
              } else {
                // Mobile: brief delay to differentiate single tap (modal) from double tap (popup)
                const targetNode = draggedNode;
                originTapTimerRef.current = window.setTimeout(() => {
                  setSelectedNode(targetNode);
                  focusOnNode(targetNode);
                  originTapTimerRef.current = null;
                }, 280);
              }
            }
          } else {
            // Non-origin circle tap: select node & open modal
            setSelectedNode(draggedNode);
            focusOnNode(draggedNode);
          }
        } else if (isDragging) {
          // Finished dragging
          if (draggedNode.tier !== 'origin') {
            draggedNode.fx = null;
            draggedNode.fy = null;
          }
          if (simulationRef.current) {
            simulationRef.current.alphaTarget(0);
          }
        }

        draggedNode = null;
        isDragging = false;
      } else if (isTap) {
        // Tap on non-circle canvas area: Check if tapped on an edge connecting two surnames
        const edgeHit = getEdgeAtPoint(e.clientX, e.clientY);
        if (edgeHit) {
          // Mobile/Desktop: Show pop-up explaining the kinship between the two clans
          setActiveEdgeInfo({
            source: edgeHit.source,
            target: edgeHit.target,
            tier: edgeHit.link.tier,
            relationshipPath: edgeHit.target.relationshipPath || edgeHit.source.relationshipPath,
            x: e.clientX,
            y: e.clientY
          });
          setHoveredNode(null);
          return;
        }

        // Tapped on empty canvas space: dismiss any active popups
        setActiveEdgeInfo(null);
        if (e.pointerType !== 'mouse') {
          setHoveredNode(null);
        }

        // Double-tap on empty space: Zooms in 4 levels, or zooms out if already zoomed in
        const now = Date.now();
        if (now - lastEmptyTapTime < 340 && Math.hypot(e.clientX - lastEmptyTapPos.x, e.clientY - lastEmptyTapPos.y) < 28) {
          handleEmptySpaceDoubleTap(e.clientX, e.clientY);
          lastEmptyTapTime = 0;
        } else {
          lastEmptyTapTime = now;
          lastEmptyTapPos = { x: e.clientX, y: e.clientY };
        }
      }
    };

    const onCanvasDblClick = (e: MouseEvent) => {
      const node = getNodeAtPoint(e.clientX, e.clientY);
      if (!node) {
        handleEmptySpaceDoubleTap(e.clientX, e.clientY);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('dblclick', onCanvasDblClick);

    // Disable default D3 dblclick zoom to avoid double-firing
    const d3Canvas = d3.select(canvas);
    d3Canvas.on('dblclick.zoom', null);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('dblclick', onCanvasDblClick);
      if (originTapTimerRef.current) {
        window.clearTimeout(originTapTimerRef.current);
      }
    };
  }, [visibleNodes, visibleLinks, setSelectedNode, focusOnNode, viewMode, handleEmptySpaceDoubleTap]);

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

  const handleWhatsAppShare = async () => {
    if (isSharingWhatsApp) return;
    setIsSharingWhatsApp(true);
    try {
      await shareToWhatsApp(canvasRef.current, query, resolvedTheme === 'dark');
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  const isFound = response?.found === true;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 w-screen h-screen bg-white dark:bg-[#090e0c] select-none touch-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* View Switch: Graph Canvas vs Table View */}
      {viewMode === 'graph' ? (
        <canvas
          ref={canvasRef}
          className={`block w-full h-full cursor-grab active:cursor-grabbing bg-radial ${palette.canvasRadial}`}
        />
      ) : (
        <div className="w-full h-full overflow-y-auto pt-24 pb-20 px-4">
          <ClanTableView />
        </div>
      )}

      {/* Floating Top Navigation Header */}
      <div className="absolute top-4 inset-x-4 max-w-6xl mx-auto flex items-start justify-between pointer-events-none z-20 gap-2">
        {/* Left Side: Back Button + (On Mobile: Results Found Text placed directly below the back button) */}
        <div className="pointer-events-auto flex flex-col items-start gap-1.5">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 dark:bg-[#111a16]/95 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#1a2a24] border border-slate-200 dark:border-[#1f352c] shadow-md backdrop-blur-md transition font-semibold text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: palette.primary }} />
            <span className="hidden sm:inline">Leit biang shadien</span>
          </button>

          {/* Results Found Text (MOBILE ONLY: Placed below the back button icon) */}
          <div className="md:hidden">
            {isFound ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#111a16]/95 border border-slate-200 dark:border-[#1f352c] shadow-md backdrop-blur-md text-[11px] text-slate-800 dark:text-slate-100 font-medium max-w-[280px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: palette.primary }}
                />
                <span className="truncate">
                  {language === 'kha'
                    ? `Lap ${directLinksCount} tyyli ki kur, ${indirectLinksCount} ki jait ba teh kur`
                    : `Found ${directLinksCount} direct links, ${indirectLinksCount} indirect links`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/95 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/60 shadow-md backdrop-blur-md text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[280px]">
                  {language === 'kha' ? 'Ka jait jong phi ngim don ' : 'No results found for your surname,'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  style={{ backgroundColor: palette.primary }}
                  className="ml-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold shrink-0 cursor-pointer shadow-md shadow-emerald-500/30 hover:shadow-lg transition-all animate-pulse hover:animate-none active:scale-95 flex items-center gap-1"
                >
                  <span>{language === 'kha' ? 'Ai Jingtip' : 'Submit'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: DESKTOP ONLY Result Banner */}
        <div className="hidden md:flex pointer-events-auto items-center justify-center">
          {isFound ? (
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 dark:bg-[#111a16]/95 border border-slate-200 dark:border-[#1f352c] shadow-md backdrop-blur-md text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: palette.primary }}
              />
              <span>
                {language === 'kha'
                  ? `Lap ${directLinksCount} tylli ki kur, ${indirectLinksCount} ki jait ba teh kur`
                  : `Found ${directLinksCount} direct links, ${indirectLinksCount} indirect links`}
              </span>

              {hasMoreThan20 && (
                <button
                  type="button"
                  onClick={toggleMinimalLinks}
                  className="hidden md:inline-flex items-center gap-1 ml-1.5 text-[11px] font-semibold hover:underline cursor-pointer"
                  style={{ color: palette.primary }}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{minimalLinks ? `(Show All ${totalLinksCount})` : `(Show Minimal)`}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-50/95 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 shadow-md backdrop-blur-md text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="max-w-[200px] sm:max-w-md truncate">
                {language === 'kha'
                  ? 'Ngim don jingtip shaphang ka jait jong phi, phi don jingtip?'
                  : 'No results found for your surname, do you have information?'}
              </span>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                style={{ backgroundColor: palette.primary }}
                className="ml-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1 shadow-xs hover:brightness-110"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'kha' ? 'Ai Jingtip' : 'Submit Form'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Surname Badge / Active Inline Search (Centered on Mobile even when closed, Top-Right on Desktop) */}
        {!showSearchBar ? (
          <div className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 md:static md:top-auto md:left-auto md:translate-x-0 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setShowSearchBar(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/95 dark:bg-[#111a16]/95 border border-slate-200 dark:border-[#1f352c] shadow-md backdrop-blur-md text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#1a2a24] transition cursor-pointer text-xs sm:text-sm font-semibold whitespace-nowrap"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: palette.origin }}
              />
              <span className="font-serif font-bold text-slate-900 dark:text-slate-100">{query}</span>
              <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          </div>
        ) : (
          <div
            ref={searchContainerRef}
            className="fixed top-4 inset-x-3 max-w-md mx-auto md:static md:top-auto md:inset-x-auto md:max-w-none md:mx-0 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <form
              onSubmit={handleInlineSearch}
              className="flex items-center gap-2 bg-white/98 dark:bg-[#111a16]/98 backdrop-blur-md rounded-full shadow-2xl border border-slate-300 dark:border-[#1f352c] p-1.5 w-full ring-2 ring-emerald-500/20"
            >
              <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={inlineSearch}
                onChange={e => setInlineSearch(e.target.value)}
                placeholder={language === 'kha' ? "Thoh ka jait..." : "Enter surname..."}
                className="flex-1 px-2 py-1.5 text-base md:text-sm text-slate-900 dark:text-slate-100 focus:outline-none font-medium bg-transparent min-w-0"
                autoFocus={!isIOS}
              />
              <button
                type="submit"
                style={{ backgroundColor: palette.primary }}
                className="px-3.5 py-1.5 rounded-full text-white text-xs font-semibold cursor-pointer hover:brightness-110 active:brightness-90 transition shrink-0 shadow-xs flex items-center gap-1"
              >
                <span>{language === 'kha' ? 'Wad' : 'Search'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSearchBar(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f352c] transition cursor-pointer shrink-0"
                title="Cancel search"
                aria-label="Cancel search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Control Dock: Below the Search button area */}
      <div className="absolute top-18 right-4 flex flex-col items-center gap-2 z-20 pointer-events-auto">
        {/* 1. Table/Graph View Toggle */}
        <div className="bg-white/95 dark:bg-[#111a16]/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-[#1f352c]">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'graph' ? 'table' : 'graph')}
            style={viewMode === 'table' ? { backgroundColor: palette.primary } : undefined}
            className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${viewMode === 'table'
              ? 'text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24]'
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

        {/* 2. Share WhatsApp Icon Button: Shares graph image directly to WhatsApp */}
        <div className="bg-white/95 dark:bg-[#111a16]/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-[#1f352c]">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={isSharingWhatsApp}
            className="p-2.5 rounded-xl text-[#25D366] hover:bg-emerald-50 dark:hover:bg-[#1a2a24] transition cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50"
            title="Share Graph on WhatsApp"
            aria-label="Share Graph on WhatsApp"
          >
            {isSharingWhatsApp ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#25D366]" />
            ) : (
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            )}
          </button>
        </div>

        {/* 3. General Share & Export Button (PNG / PDF) */}
        <div className="bg-white/95 dark:bg-[#111a16]/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-[#1f352c]">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer flex items-center justify-center"
            title="Share as Image or PDF"
            aria-label="Share current view"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Zoom & Reset Controls: Placed AFTER download button. Zoom In/Out hidden on mobile */}
        {viewMode === 'graph' && (
          <div className="flex flex-col items-center bg-white/95 dark:bg-[#111a16]/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-[#1f352c] gap-1">
            {/* Zoom In: Hidden on mobile (users pinch to zoom) */}
            <button
              type="button"
              onClick={() => handleZoom(1.3)}
              className="hidden sm:flex p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer items-center justify-center"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {/* Zoom Out: Hidden on mobile */}
            <button
              type="button"
              onClick={() => handleZoom(0.7)}
              className="hidden sm:flex p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer items-center justify-center"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {/* Divider: Hidden on mobile */}
            <div className="hidden sm:block w-4 h-[1px] bg-slate-200 dark:bg-[#1f352c]" />
            {/* Reset View: Visible on all devices */}
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
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2a24] transition cursor-pointer flex items-center justify-center"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Center: Ki Kyrdan Kur Details Trigger with safe bottom clearance on mobile & single-line full width */}
      <div className="fixed sm:absolute bottom-6 inset-x-3 sm:inset-x-auto  sm:-translate-x-1/2 z-20 pointer-events-auto pb-[max(16px,env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={() => setIsKyrdanModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#111a16]/95 border border-slate-200 dark:border-[#1f352c] shadow-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#1a2a24] transition cursor-pointer backdrop-blur-md active:scale-[0.98]"
        >
          <Layers className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
          <span className="whitespace-nowrap truncate">
            {language === 'kha' ? 'Ki Kyrdan Kur (Legends Details)' : 'Kinship Tiers (Legends)'}
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1"
            style={{
              backgroundColor: `${palette.primary}15`,
              color: palette.primary,
              border: `1px solid ${palette.primary}30`
            }}
          >
            {visibleNodes.length}
          </span>
        </button>
      </div>

      {/* Interactive Tooltip Pop-up for Node or Edge */}
      {(hoveredNode || activeEdgeInfo) && !selectedNode && viewMode === 'graph' && (
        <div
          className="pointer-events-auto absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#111a16]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1f352c] text-xs z-30 max-w-xs sm:max-w-sm transition-all duration-150 text-center animate-in fade-in zoom-in-95"
        >
          {activeEdgeInfo ? (
            /* Edge Kinship Connection Pop-up (Triggered on mobile by pressing the edge) */
            <div>
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <span>{activeEdgeInfo.source.label}</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>{activeEdgeInfo.target.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEdgeInfo(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: (palette as any)[activeEdgeInfo.tier] || palette.primary }}
                />
                <span
                  className="font-semibold text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${(palette as any)[activeEdgeInfo.tier] || palette.primary}18`,
                    color: (palette as any)[activeEdgeInfo.tier] || palette.primary
                  }}
                >
                  {activeEdgeInfo.tier === 'kpoh'
                    ? (language === 'kha' ? 'Ka juh ka kpoh' : 'Direct Bloodline')
                    : activeEdgeInfo.tier === 'shikur'
                      ? (language === 'kha' ? 'Ba ia dei kur (Shikur)' : 'Sister Clan (Shikur)')
                      : activeEdgeInfo.tier === 'tehkur'
                        ? (language === 'kha' ? 'Ba ia teh kur (Teh Kur)' : 'Treaty Bound (Teh Kur)')
                        : (language === 'kha' ? 'Ba don jingiadei' : 'Distant Alliance')}
                </span>
              </div>
              {(activeEdgeInfo.relationshipPath?.khasi || activeEdgeInfo.relationshipPath?.english) && (
                <div className="text-slate-600 dark:text-slate-300 mt-1.5 text-[11px] leading-relaxed">
                  {language === 'kha'
                    ? activeEdgeInfo.relationshipPath?.khasi || activeEdgeInfo.relationshipPath?.english
                    : activeEdgeInfo.relationshipPath?.english || activeEdgeInfo.relationshipPath?.khasi}
                </div>
              )}
            </div>
          ) : hoveredNode?.tier === 'origin' ? (
            /* Searched Surname Origin Pop-up (Triggered on mobile by double-tapping origin circle, or desktop hover) */
            <div>
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block shrink-0 ring-2 ring-emerald-500/30"
                    style={{ backgroundColor: palette.origin }}
                  />
                  <span className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                    {hoveredNode.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHoveredNode(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer md:hidden"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="inline-block text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                {language === 'kha' ? 'Ka Jait ba la wad (Origin)' : 'Searched Clan Origin'}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                {language === 'kha'
                  ? `Lap ${directLinksCount} tylli ki kur, ${indirectLinksCount} ki jait ba teh kur`
                  : `Found ${directLinksCount} direct links, ${indirectLinksCount} indirect links`}
              </p>
            </div>
          ) : hoveredNode ? (
            /* Related Clan Pop-up (Shows how clan is related to searched surname) */
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: (palette as any)[hoveredNode.tier] || hoveredNode.color }}
                />
                <span className="font-serif font-bold text-sm">{hoveredNode.label}</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${(palette as any)[hoveredNode.tier] || palette.primary}20`,
                    color: (palette as any)[hoveredNode.tier] || palette.primary
                  }}
                >
                  {hoveredNode.tier.toUpperCase()}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 leading-relaxed">
                {hoveredNode.relationshipPath?.khasi || hoveredNode.relationshipPath?.english || (
                  hoveredNode.tier === 'kpoh'
                    ? (language === 'kha' ? 'Ka juh ka kpoh' : 'Direct Bloodline')
                    : hoveredNode.tier === 'shikur'
                      ? (language === 'kha' ? 'Ba ia dei kur' : 'Sister Clan')
                      : hoveredNode.tier === 'tehkur'
                        ? (language === 'kha' ? 'Ba ia teh kur' : 'Treaty Bound')
                        : (language === 'kha' ? 'Ba don jingiadei' : 'Distant Alliance')
                )}
              </div>
            </div>
          ) : null}
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
