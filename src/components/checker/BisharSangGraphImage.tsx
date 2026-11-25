import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Download, Share2, Check, ZoomIn, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export interface BisharSangGraphImageProps {
  person1Clan: string;
  person2Clan: string;
  status: 'sang' | 'cleared';
  level: 1 | 2 | 3 | 4;
  matchingClan?: string;
  matchingRelation?: string;
  cluster?: string;
  className?: string;
}

export const BisharSangGraphImage: React.FC<BisharSangGraphImageProps> = ({
  person1Clan,
  person2Clan,
  status,
  level,
  matchingClan,
  matchingRelation,
  cluster,
  className = ''
}) => {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Draw the high-resolution graph onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 860;
    const height = 480;
    const dpr = 2; // high-DPI scaling

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    ctx.save();
    ctx.scale(dpr, dpr);

    const isDark = resolvedTheme === 'dark';

    // 1. Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (isDark) {
      bgGrad.addColorStop(0, '#0c1511');
      bgGrad.addColorStop(1, '#060a08');
    } else {
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#f8fafc');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle border
    ctx.strokeStyle = isDark ? '#1f352c' : '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Subtle background grid dots
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    for (let gx = 40; gx < width; gx += 40) {
      for (let gy = 80; gy < height - 60; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Header Area
    // Title: Bishar ia ka Sang
    ctx.textAlign = 'center';
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 24px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText('Bishar ia ka Sang', width / 2, 42);

    // Subtitle badge / status
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    if (status === 'sang') {
      ctx.fillStyle = '#ef4444';
      const levelLabel =
        level === 1
          ? 'KYRDAN 1 • MATERNAL CLAN TABOO (KA SANG)'
          : level === 2
            ? 'KYRDAN 2 • PATERNAL CLAN TABOO (KUR U KPA)'
            : 'KYRDAN 3 • COUSIN RELATION TABOO (SOHPET-PARAKHA)';
      ctx.fillText(levelLabel, width / 2, 64);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.fillText('YM DON JINGÏADEI SANG • LEVELS 1, 2 & 3 CLEARED (DISTINCT)', width / 2, 64);
    }

    // Header divider line
    ctx.strokeStyle = isDark ? '#1f352c' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 78);
    ctx.lineTo(width - 40, 78);
    ctx.stroke();

    // Helper: Draw Node
    const drawNode = (
      x: number,
      y: number,
      label: string,
      sublabel: string,
      role: 'p1' | 'p2' | 'intermediate',
      colorType: 'emerald' | 'crimson' | 'amber' | 'teal'
    ) => {
      const radius = role === 'intermediate' ? 44 : 50;

      // Glow halo
      const haloGrad = ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius * 1.5);
      if (colorType === 'crimson') {
        haloGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        haloGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else if (colorType === 'amber') {
        haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      } else if (colorType === 'teal') {
        haloGrad.addColorStop(0, 'rgba(13, 148, 136, 0.25)');
        haloGrad.addColorStop(1, 'rgba(13, 148, 136, 0)');
      } else {
        haloGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        haloGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Main Circle Gradient
      const circleGrad = ctx.createLinearGradient(x, y - radius, x, y + radius);
      if (colorType === 'crimson') {
        circleGrad.addColorStop(0, '#dc2626');
        circleGrad.addColorStop(1, '#991b1b');
      } else if (colorType === 'amber') {
        circleGrad.addColorStop(0, '#d97706');
        circleGrad.addColorStop(1, '#92400e');
      } else if (colorType === 'teal') {
        circleGrad.addColorStop(0, '#0d9488');
        circleGrad.addColorStop(1, '#115e59');
      } else {
        circleGrad.addColorStop(0, '#059669');
        circleGrad.addColorStop(1, '#065f46');
      }

      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Border ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text inside Circle (Surname initial or short)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Cinzel", "Playfair Display", Georgia, serif';
      const initial = label ? label.charAt(0).toUpperCase() : '?';
      ctx.fillText(initial, x, y + 7);

      // Label below circle (Surname)
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = 'bold 16px "Cinzel", "Playfair Display", Georgia, serif';
      ctx.fillText(label, x, y + radius + 22);

      // Sublabel below surname
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(sublabel, x, y + radius + 38);
    };

    // Helper: Draw Pill on edge
    const drawEdgePill = (
      x: number,
      y: number,
      title: string,
      subtitle: string,
      isSangPill: boolean
    ) => {
      const pillWidth = 240;
      const pillHeight = 44;
      const px = x - pillWidth / 2;
      const py = y - pillHeight / 2;

      ctx.fillStyle = isSangPill
        ? isDark ? '#450a0a' : '#fef2f2'
        : isDark ? '#064e3b' : '#ecfdf5';
      ctx.strokeStyle = isSangPill ? '#ef4444' : '#10b981';
      ctx.lineWidth = 1.5;

      // Rounded rectangle
      ctx.beginPath();
      ctx.roundRect(px, py, pillWidth, pillHeight, 12);
      ctx.fill();
      ctx.stroke();

      // Pill Text
      ctx.textAlign = 'center';
      ctx.fillStyle = isSangPill ? '#ef4444' : '#059669';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(title, x, y - 4);

      ctx.fillStyle = isDark ? '#e2e8f0' : '#334155';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(subtitle, x, y + 12);
    };

    // Helper: Draw Edge Line
    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      isSangLine: boolean,
      isDashed = false
    ) => {
      ctx.save();
      ctx.strokeStyle = isSangLine ? '#ef4444' : isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = isSangLine ? 3.5 : 2;
      if (isDashed) {
        ctx.setLineDash([6, 6]);
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    const centerY = 235;

    // 3. Layout Rendering based on scenario
    if (status === 'cleared') {
      // NO LINK FOUND: Simply show the two main nodes side by side with NO connecting link
      const p1X = 230;
      const p2X = 630;

      // Draw Person 1 Node
      drawNode(p1X, centerY, person1Clan, '1st Person’s Surname', 'p1', 'emerald');

      // Draw Person 2 Node
      drawNode(p2X, centerY, person2Clan, '2nd Person’s Surname', 'p2', 'emerald');

      // Center Distinct Badge (NO LINK)
      const centerX = width / 2;
      drawEdgePill(
        centerX,
        centerY,
        'YM DON JINGÏADEI (DISTINCT)',
        'No kinship or taboo link found',
        false
      );

      // Subtle dashed barrier indicating clan separation
      ctx.save();
      ctx.strokeStyle = isDark ? '#1f352c' : '#e2e8f0';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 65);
      ctx.lineTo(centerX, centerY - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 30);
      ctx.lineTo(centerX, centerY + 65);
      ctx.stroke();
      ctx.restore();
    } else if (level === 1) {
      // LEVEL 1 SANG: Direct Maternal Clan Match between Person 1 & Person 2
      const p1X = 220;
      const p2X = 640;

      // Connecting Sang Line
      drawLine(p1X + 50, centerY, p2X - 50, centerY, true);

      // Draw Nodes
      drawNode(p1X, centerY, person1Clan, '1st Person (Maternal)', 'p1', 'crimson');
      drawNode(p2X, centerY, person2Clan, '2nd Person (Matching)', 'p2', 'crimson');

      // Edge Pill
      const relationText = matchingRelation || cluster || 'Ka Juh ka Kpoh / Ba ïadei Kur';
      drawEdgePill(
        (p1X + p2X) / 2,
        centerY,
        'KA SANG (PROHIBITED)',
        relationText,
        true
      );
    } else if (level === 2) {
      // LEVEL 2 SANG: Father's Clan matches Person 2
      // Person 1 -> Father (Kur u Kpa) ===[SANG]===> Person 2
      const p1X = 160;
      const fatherX = 430;
      const p2X = 700;

      const fClan = matchingClan || 'Father Clan';

      // Line 1: Person 1 to Father (Paternal Lineage)
      drawLine(p1X + 50, centerY, fatherX - 44, centerY, false, true);

      // Line 2: Father to Person 2 (SANG LINK)
      drawLine(fatherX + 44, centerY, p2X - 50, centerY, true);

      // Draw Nodes
      drawNode(p1X, centerY, person1Clan, '1st Person’s Surname', 'p1', 'emerald');
      drawNode(fatherX, centerY, fClan, 'U Kpa (Father / Kur u Kpa)', 'intermediate', 'amber');
      drawNode(p2X, centerY, person2Clan, '2nd Person (Matching)', 'p2', 'crimson');

      // Label on Line 1
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Kur u Kpa', (p1X + fatherX) / 2, centerY - 14);

      // Pill on Line 2 (Matching with Person 2)
      drawEdgePill(
        (fatherX + p2X) / 2,
        centerY,
        'SANG (KUR U KPA)',
        `${fClan} matches ${person2Clan}`,
        true
      );
    } else {
      // LEVEL 3 SANG: Uncle's Children (Khun u Kñii / Sohpet-Parakha) matches Person 2
      // Person 1 -> Uncle's Child ===[SANG]===> Person 2
      const p1X = 160;
      const uncleX = 430;
      const p2X = 700;

      const uClan = matchingClan || 'Uncle Clan';

      // Line 1: Person 1 to Uncle's Child
      drawLine(p1X + 50, centerY, uncleX - 44, centerY, false, true);

      // Line 2: Uncle's Child to Person 2 (SANG LINK)
      drawLine(uncleX + 44, centerY, p2X - 50, centerY, true);

      // Draw Nodes
      drawNode(p1X, centerY, person1Clan, '1st Person’s Surname', 'p1', 'emerald');
      drawNode(uncleX, centerY, uClan, 'Khun u Kñii (Uncle’s Child)', 'intermediate', 'teal');
      drawNode(p2X, centerY, person2Clan, '2nd Person (Matching)', 'p2', 'crimson');

      // Label on Line 1
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Khun u Kñii', (p1X + uncleX) / 2, centerY - 14);

      // Pill on Line 2 (Matching with Person 2)
      drawEdgePill(
        (uncleX + p2X) / 2,
        centerY,
        'SANG (SOHPET-PARAKHA)',
        `${uClan} matches ${person2Clan}`,
        true
      );
    }

    // 4. Footer Banner
    ctx.strokeStyle = isDark ? '#1f352c' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, height - 52);
    ctx.lineTo(width - 40, height - 52);
    ctx.stroke();

    // Bottom Watermark & Notes
    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Tipkur Tipkha • kur.kyrshan.com', 42, height - 26);

    ctx.textAlign = 'right';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('(Generated by Kur Web App)', width - 42, height - 26);

    ctx.restore();

    // Export DataURL for sharing/preview
    try {
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    } catch (e) {
      console.warn('Canvas toDataURL failed:', e);
    }
  }, [person1Clan, person2Clan, status, level, matchingClan, matchingRelation, cluster, resolvedTheme]);

  // Download graph image PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const fileName = `bishar-sang-${person1Clan.toLowerCase()}-${person2Clan.toLowerCase()}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  // Copy or share graph image
  const handleCopyOrShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const fileName = `bishar-sang-${person1Clan.toLowerCase()}-${person2Clan.toLowerCase()}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Bishar ia ka Sang — Graph Linking',
            text: `Bishar ia ka Sang: ${person1Clan} & ${person2Clan}`
          });
        } else if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else {
          handleDownload();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Share/Clipboard error:', err);
      handleDownload();
    }
  };

  return (
    <div className={`space-y-3 pt-2 ${className}`}>
      {/* Top Card Title & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {status === 'sang' ? (
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
            {language === 'kha' ? 'Dur Batai ia ka Jingiadei Kur (Graph Linking)' : 'Clan Linkage Graph (Bishar ia ka Sang)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyOrShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2822] dark:hover:bg-[#23382f] text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="Share or Copy Graph Image"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? (language === 'kha' ? 'La Copy!' : 'Copied!') : (language === 'kha' ? 'Sam' : 'Share')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
            title="Download Graph Image (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'kha' ? 'Download' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* Rendered Graph Canvas / Image Container */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1f352c] bg-white dark:bg-[#0c1511] shadow-md cursor-pointer transition-transform hover:scale-[1.005]"
      >
        <canvas ref={canvasRef} className="block w-full h-auto" />

        {/* Zoom In Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
          <ZoomIn className="w-4 h-4" />
          <span>{language === 'kha' ? 'Khnjot ban peit heh' : 'Click to zoom graph image'}</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && dataUrl && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={dataUrl}
              alt="Bishar ia ka Sang Graph Linking"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

