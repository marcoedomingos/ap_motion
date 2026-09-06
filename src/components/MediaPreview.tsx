import React, { useRef, useEffect, useState } from 'react';
import { Play, Eye, Image as ImageIcon, Video } from 'lucide-react';
import { Project } from '../types';

interface MediaPreviewProps {
  project: Project;
  isHovered?: boolean;
  className?: string;
  showControlsOverlay?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  project,
  isHovered = false,
  className = '',
  showControlsOverlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [imageSrc, setImageSrc] = useState(project.imageUrl || project.fallbackSvg);
  const [isSelfHovered, setIsSelfHovered] = useState(false);

  useEffect(() => {
    setImageSrc(project.imageUrl || project.fallbackSvg);
  }, [project.imageUrl, project.fallbackSvg]);

  // Video hover preview playback
  useEffect(() => {
    if (!videoRef.current || !project.videoUrl) return;
    const shouldPlay = isHovered || isSelfHovered;
    if (shouldPlay) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isSelfHovered, project.videoUrl]);

  // If it's a video without real videoUrl, render smooth animated canvas preview
  useEffect(() => {
    if (project.mediaType !== 'video' || project.videoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;
      timeRef.current += 0.025;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Render based on videoType
      switch (project.videoType) {
        case 'setembro-promo':
          drawSetembroPromoPreview(ctx, w, h, t);
          break;
        case 'yango':
          drawYangoPreview(ctx, w, h, t);
          break;
        case 'heetch':
          drawHeetchPreview(ctx, w, h, t);
          break;
        case 'fussion':
          drawFussionPreview(ctx, w, h, t);
          break;
        case 'imobiliaria':
          drawImobiliariaPreview(ctx, w, h, t);
          break;
        case 'matchbox':
          drawMatchboxPreview(ctx, w, h, t);
          break;
        case 'ao-ponto':
          drawAoPontoPreview(ctx, w, h, t);
          break;
        case 'ap-intro':
        default:
          drawApIntroPreview(ctx, w, h, t);
          break;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [project]);

  // If it's an IMAGE, display the image directly!
  if (project.mediaType === 'image') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-zinc-950 ${className}`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => {
              if (project.fallbackSvg && imageSrc !== project.fallbackSvg) {
                setImageSrc(project.fallbackSvg);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
            <ImageIcon size={36} />
          </div>
        )}

        {/* Discreet Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-medium text-white border border-white/10 shadow-sm">
          <ImageIcon size={12} className={project.isUploadedWork ? 'text-amber-400' : 'text-sky-400'} />
          <span>{project.isUploadedWork ? 'Trabalho Anterior' : 'Flyer / Imagem'}</span>
        </div>

        {/* Hover overlay */}
        {showControlsOverlay && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
            <div className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <Eye size={14} />
              <span>Ver Imagem Ampliada</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If it's a VIDEO
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseLeave={() => setIsSelfHovered(false)}
    >
      {project.videoUrl ? (
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={640}
          height={420}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Discreet Video Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-[11px] font-medium text-white border border-white/10 shadow-sm">
        <Video size={12} className="text-red-400" />
        <span>{project.videoUrl ? 'Vídeo Real' : 'Vídeo'} • {project.duration || 'Motion'}</span>
      </div>

      {/* Center Play Icon on Hover */}
      {showControlsOverlay && (
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={20} className="translate-x-0.5 fill-black" />
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// CLEAN MOTION DRAWING ROUTINES (True to the user's uploaded videos)
// -------------------------------------------------------------

function drawSetembroPromoPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.9) % 12.0;

  if (cycle < 2.8) {
    // Scene 1: "Cansado de conteúdo fraco que não gera resultados pro teu negócio?"
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Blue glow circle at bottom
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 1.05, w * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText('Cansado de', w * 0.5, h * 0.28);

    ctx.fillStyle = '#3b82f6';
    ctx.font = '900 28px "Outfit", sans-serif';
    ctx.fillText('CONTEÚDO FRACO', w * 0.5, h * 0.42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Que não gera resultados para o teu', w * 0.5, h * 0.56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('NEGÓCIO?', w * 0.5, h * 0.68);
  } else if (cycle >= 2.8 && cycle < 5.6) {
    // Scene 2: WhatsApp chat popup + "GRÁTIS"
    ctx.fillStyle = '#05070e';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'italic bold 18px serif';
    ctx.fillText('Este Setembro', w * 0.5, h * 0.16);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.fillText('Tens uma Oportunidade Única', w * 0.5, h * 0.26);

    // Chat card
    const chatX = w * 0.12;
    const chatW = w * 0.76;
    ctx.fillStyle = '#141a24';
    ctx.beginPath();
    ctx.roundRect(chatX, h * 0.33, chatW, 110, [12]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bubble 1
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(chatX + 10, h * 0.36, chatW - 60, 24, [6]);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Olá, preciso de um vídeo', chatX + 16, h * 0.36 + 16);

    // Bubble 2
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.roundRect(chatX + 50, h * 0.44, chatW - 60, 24, [6]);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.fillText('Missão dada é cumprida! ✓✓', chatX + 56, h * 0.44 + 16);

    // Free banner
    ctx.textAlign = 'center';
    ctx.fillStyle = '#3b82f6';
    ctx.font = '900 36px "Outfit", sans-serif';
    ctx.fillText('FLYERS GRÁTIS', w * 0.5, h * 0.78);
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Na contratação de qualquer vídeo', w * 0.5, h * 0.88);
  } else if (cycle >= 5.6 && cycle < 8.8) {
    // Scene 3: Niches (Imobiliária, Restaurante, Escola, Stand de Carros)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Outfit", sans-serif';
    ctx.fillText('És dono de algum destes negócios?', w * 0.5, h * 0.2);

    const niches = [
      { name: 'Imobiliária', icon: '🏢' },
      { name: 'Restaurante', icon: '🍽️' },
      { name: 'Escola', icon: '🏫' },
      { name: 'Stand Carros', icon: '🚗' },
    ];

    const boxW = (w - 50) / 4;
    niches.forEach((item, i) => {
      const bx = 16 + i * (boxW + 6);
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, h * 0.32, boxW, 80, [10]);
      ctx.fill();
      ctx.stroke();

      ctx.font = '22px sans-serif';
      ctx.fillText(item.icon, bx + boxW / 2, h * 0.32 + 36);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item.name, bx + boxW / 2, h * 0.32 + 62);
    });

    // Social icons
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Instagram • Facebook • YouTube • TikTok', w * 0.5, h * 0.72);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Vídeos que prendem a atenção e convertem', w * 0.5, h * 0.82);
  } else {
    // Scene 4: Urgency & AP Signature ("5 Vagas Limitadas • Promoção até fim de Setembro")
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    // Cyan counter 5
    ctx.textAlign = 'center';
    ctx.fillStyle = '#06b6d4';
    ctx.font = '900 48px "Outfit", sans-serif';
    ctx.fillText('5', w * 0.5, h * 0.34);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('VAGAS LIMITADAS', w * 0.5, h * 0.48);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Promoção só até ao fim de Setembro', w * 0.5, h * 0.6);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillText('AP — Das ideias às soluções', w * 0.5, h * 0.82);
  }
}

function drawYangoPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.9) % 7.5;

  // Background: Clean white like the original video
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  if (cycle < 2.0) {
    // Scene 1: Red circle expanding into pill button + cursor click
    const isClicked = cycle >= 1.2;
    const btnW = 160;
    const btnH = 50;
    const btnX = (w - btnW) / 2;
    const btnY = (h - btnH) / 2;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, [25]);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 24px "Outfit", sans-serif';
    ctx.fillText('YANGO', w * 0.5, h * 0.5 + 8);

    // Hand pointer icon clicking
    if (cycle >= 0.8) {
      const handX = w * 0.5 + (isClicked ? 15 : 25);
      const handY = h * 0.5 + (isClicked ? 12 : 20);
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(handX, handY, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (cycle >= 2.0 && cycle < 5.5) {
    // Scene 2: Motorbike delivery & sedan car split with "Para onde? >"
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'italic 900 24px "Outfit", sans-serif';
    ctx.fillText('YANGO', 20, 36);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('A tua localização >', 110, 34);

    const cardW = (w - 48) / 2;
    const cardY = 56;
    const cardH = h - 130;

    // Left card: Motorbike with red delivery box
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.roundRect(16, cardY, cardW, cardH, [10]);
    ctx.fill();

    // Delivery Box (Red with smiley)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(26, cardY + cardH * 0.35, 45, 45, [6]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☺', 26 + 22.5, cardY + cardH * 0.35 + 28);

    // Motorbike wheel simulation
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(26 + 55, cardY + cardH * 0.7, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(26 + 55, cardY + cardH * 0.7, 8, 0, Math.PI * 2);
    ctx.fill();

    // Right card: White sedan with red diagonal livery
    const rightX = 16 + cardW + 16;
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.roundRect(rightX, cardY, cardW, cardH, [10]);
    ctx.fill();

    // Car silhouette
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 10, cardY + cardH * 0.4, cardW - 20, 35, [8]);
    ctx.fill();
    ctx.stroke();

    // Red diagonal stripe on car door
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(rightX + cardW * 0.45, cardY + cardH * 0.4);
    ctx.lineTo(rightX + cardW * 0.65, cardY + cardH * 0.4);
    ctx.lineTo(rightX + cardW * 0.55, cardY + cardH * 0.4 + 35);
    ctx.lineTo(rightX + cardW * 0.35, cardY + cardH * 0.4 + 35);
    ctx.fill();

    // Pill Button: "Para onde? >"
    const pillW = w - 48;
    const pillY = h - 56;
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.roundRect(24, pillY, pillW, 40, [20]);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillText('Para onde?', 44, pillY + 25);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(24 + pillW - 24, pillY + 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('>', 24 + pillW - 20, pillY + 24);
  } else {
    // Scene 3: AP signature outro
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // AP lines animation
    ctx.save();
    ctx.translate(w * 0.35, h * 0.48);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-25, 25);
    ctx.lineTo(0, -25);
    ctx.lineTo(12, 0);
    ctx.lineTo(25, 0);
    ctx.arc(25, 12, 12, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(12, 24);
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Das ideias', w * 0.52, h * 0.45);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Aos Resultados', w * 0.52, h * 0.56);
  }
}

function drawHeetchPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.9) % 8.0;

  // Background: Dark canvas
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, w, h);

  // Top header text from video
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Outfit", sans-serif';
  ctx.fillText('Precisa de destaque?', 16, 24);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Motion designs é a solução', 16, 38);

  // Center video stage
  const stageX = 16;
  const stageY = 48;
  const stageW = w - 32;
  const stageH = h - 100;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(stageX, stageY, stageW, stageH, [10]);
  ctx.clip();

  // Stage background
  if (cycle < 2.8) {
    // Purple / magenta vignette
    const bg = ctx.createRadialGradient(stageX + stageW / 2, stageY + stageH / 2, 10, stageX + stageW / 2, stageY + stageH / 2, stageW * 0.6);
    bg.addColorStop(0, '#9d174d');
    bg.addColorStop(0.5, '#4c0519');
    bg.addColorStop(1, '#090111');
    ctx.fillStyle = bg;
    ctx.fillRect(stageX, stageY, stageW, stageH);

    // Center icon
    const isPink = cycle >= 1.0;
    const isClick = cycle >= 2.0 && cycle <= 2.5;
    const iconSize = isClick ? 50 : 56;
    const iconX = stageX + (stageW - iconSize) / 2;
    const iconY = stageY + (stageH - iconSize) / 2;

    ctx.fillStyle = isPink ? '#e2007a' : '#111115';
    ctx.beginPath();
    ctx.roundRect(iconX, iconY, iconSize, iconSize, [14]);
    ctx.fill();

    if (isPink) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Outfit", sans-serif';
      ctx.fillText('H.', stageX + stageW / 2, stageY + stageH / 2 + 9);
    }

    // Hand cursor
    if (cycle >= 1.5 && cycle <= 2.7) {
      const handX = stageX + stageW / 2 + (isClick ? 8 : 14);
      const handY = stageY + stageH / 2 + (isClick ? 10 : 16);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(handX, handY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (cycle >= 2.8 && cycle < 4.4) {
    // Full magenta background with HEETCH. bold black logo
    ctx.fillStyle = '#e2007a';
    ctx.fillRect(stageX, stageY, stageW, stageH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.font = '900 32px "Outfit", sans-serif';
    ctx.fillText('HEETCH.', stageX + stageW / 2, stageY + stageH / 2 + 10);
  } else {
    // Split layout (4.4s to 8.0s)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(stageX, stageY, stageW, stageH);

    const cardW = (stageW - 12) / 2;
    const cardH = stageH - 12;

    // Left card: Magenta
    ctx.fillStyle = '#e2007a';
    ctx.beginPath();
    ctx.roundRect(stageX + 4, stageY + 6, cardW, cardH, [8]);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillText('O melhor transporte', stageX + 12, stageY + cardH * 0.45);

    ctx.fillStyle = '#000000';
    ctx.font = 'italic bold 13px serif';
    ctx.fillText('No melhor Conforto', stageX + 12, stageY + cardH * 0.68);

    // Right card: White map simulation
    const rightX = stageX + 4 + cardW + 4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(rightX, stageY + 6, cardW, cardH, [8]);
    ctx.fill();

    // Map streets
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX + 6, stageY + 20);
    ctx.lineTo(rightX + cardW - 6, stageY + 35);
    ctx.moveTo(rightX + 12, stageY + 50);
    ctx.lineTo(rightX + cardW - 12, stageY + 15);
    ctx.stroke();

    // Route line
    ctx.strokeStyle = '#e2007a';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(rightX + 12, stageY + 15);
    ctx.quadraticCurveTo(rightX + cardW * 0.5, stageY + 45, rightX + cardW - 14, stageY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ride option label
    ctx.fillStyle = '#090d16';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Heetch Viagens', rightX + 8, stageY + cardH - 10);
  }
  ctx.restore();

  // Bottom footer text from video
  ctx.textAlign = 'left';
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('✓ Mais autoridade', 16, h - 36);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('✓ Mais atenção', 16, h - 22);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('✓ Mais destaque', 16, h - 8);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('Comente "Motion"', w - 16, h - 24);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('para agendar o seu', w - 16, h - 10);
}

function drawFussionPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.8) % 6.0;

  // Warm cream & amber background
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#fef9f3');
  bg.addColorStop(0.6, '#fde68a');
  bg.addColorStop(1, '#f59e0b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Soft light radial glow in the center
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.6);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Kinetic Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#78350f';
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Cuidado pessoal é o mínimo,', w * 0.5, 34);

  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText('MAS ESTES PRODUTOS', w * 0.5, 60);
  ctx.fillStyle = '#b45309';
  ctx.fillText('SÃO UM MIMO.', w * 0.5, 84);

  // Draw product packshot simulation
  const stageY = h * 0.44;

  // 1. Fussion Cream & Oil yellow tube (left)
  ctx.save();
  ctx.translate(w * 0.22, stageY);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.roundRect(-16, -45, 32, 75, [8, 8, 4, 4]);
  ctx.fill();
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 7px sans-serif';
  ctx.fillText('FUSSION', 0, -10);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-10, 30, 20, 10); // cap
  ctx.restore();

  // 2. Six Loção Paixão ruby red bottles (center)
  const bottleColors = ['#991b1b', '#b91c1c', '#dc2626', '#b91c1c', '#991b1b'];
  bottleColors.forEach((color, i) => {
    const bx = w * 0.38 + i * 14;
    const by = stageY + (i % 2 === 0 ? 4 : 0);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(bx - 6, by - 36, 12, 58, [4, 4, 2, 2]);
    ctx.fill();
    // Gold cap
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bx - 4, by - 44, 8, 8);
  });

  // 3. Herbíssimo jars (right)
  ctx.save();
  ctx.translate(w * 0.8, stageY + 10);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-16, -20, 32, 35, [6]);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#15803d';
  ctx.fillRect(-14, -8, 28, 10);
  ctx.restore();

  // Call to action banner at bottom
  const bannerW = w * 0.88;
  const bannerH = 46;
  const bannerX = (w - bannerW) / 2;
  const bannerY = h - 64;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerW, bannerH, [12]);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#52525b';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('PEÇA JÁ O SEU', w * 0.5, bannerY + 18);

  ctx.fillStyle = '#000000';
  ctx.font = '900 15px "Outfit", sans-serif';
  ctx.fillText('📞 950 723 170', w * 0.5, bannerY + 36);
}

function drawImobiliariaPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.6) % 10.0;

  if (cycle < 2.5) {
    // Scene 1: Drone aerial shot of crystal turquoise swimming pool with swimmer
    const poolBg = ctx.createLinearGradient(0, 0, w, h);
    poolBg.addColorStop(0, '#0284c7');
    poolBg.addColorStop(0.5, '#0ea5e9');
    poolBg.addColorStop(1, '#38bdf8');
    ctx.fillStyle = poolBg;
    ctx.fillRect(0, 0, w, h);

    // Pool water caustic waves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const wy = h * 0.15 + i * (h * 0.16) + Math.sin(t * 2 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.bezierCurveTo(w * 0.3, wy - 10, w * 0.7, wy + 10, w - 10, wy);
      ctx.stroke();
    }

    // Swimmer silhouette floating peacefully
    const swimX = w * 0.5;
    const swimY = h * 0.45;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(swimX, swimY, 8, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(swimX - 5, swimY + 8, 10, 22, [4]); // torso
    ctx.fill();
    // Arms outstretched
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(swimX - 18, swimY + 12);
    ctx.lineTo(swimX + 18, swimY + 12);
    ctx.stroke();
  } else if (cycle >= 2.5 && cycle < 5.0) {
    // Scene 2: Kitchen & dining area with warm lighting
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);

    // Warm ceiling light cone
    const lamp = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, h * 0.4, w * 0.7);
    lamp.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    lamp.addColorStop(1, 'rgba(28, 25, 23, 0)');
    ctx.fillStyle = lamp;
    ctx.fillRect(0, 0, w, h);

    // Wooden table silhouette
    ctx.fillStyle = '#78350f';
    ctx.fillRect(w * 0.15, h * 0.45, w * 0.7, 18);
    // Table legs
    ctx.fillRect(w * 0.2, h * 0.45 + 18, 8, 60);
    ctx.fillRect(w * 0.75, h * 0.45 + 18, 8, 60);

    // Bottles on table
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(w * 0.45, h * 0.45 - 28, 10, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(w * 0.52, h * 0.45 - 34, 12, 34);
  } else if (cycle >= 5.0 && cycle < 7.5) {
    // Scene 3: Black and white checkerboard luxury bathroom & oval mirror
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Checkered floor
    const checkSize = 18;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < Math.ceil(w / checkSize); col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? '#1e293b' : '#f8fafc';
        ctx.fillRect(col * checkSize, h * 0.5 + row * checkSize, checkSize, checkSize);
      }
    }

    // Oval mirror with soft backlight
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.28, 30, 45, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Deep soaking bathtub
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(w * 0.25, h * 0.44, w * 0.5, 34, [16, 16, 8, 8]);
    ctx.fill();
  } else {
    // Scene 4: Architectural living space
    ctx.fillStyle = '#0b132b';
    ctx.fillRect(0, 0, w, h);

    // Chandelier glow
    const ch = ctx.createRadialGradient(w * 0.5, 30, 5, w * 0.5, 30, 100);
    ch.addColorStop(0, 'rgba(253, 230, 138, 0.6)');
    ch.addColorStop(1, 'rgba(11, 19, 43, 0)');
    ctx.fillStyle = ch;
    ctx.fillRect(0, 0, w, h);

    // Sofa silhouette
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(w * 0.2, h * 0.42, w * 0.6, 40, [10]);
    ctx.fill();
  }

  // Persistent elegant typography overlay (blur glass container)
  const barH = 74;
  const barY = h - barH - 12;
  const barW = w * 0.92;
  const barX = (w - barW) / 2;

  ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, [12]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "Outfit", sans-serif';
  ctx.fillText('SEU NEGÓCIO PRECISA DISSO:', w * 0.5, barY + 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Mostrar imobiliária, restaurante ou produto', w * 0.5, barY + 38);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Comente "vídeo" para agendar ou saber mais', w * 0.5, barY + 56);
}

function drawMatchboxPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.9) % 5.5;

  if (cycle < 2.8) {
    // Scene 1: Clean white background + cobalt blue circle + "Motion design Destaca?"
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Cobalt blue circle
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.4, w * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Typography
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText('Motion design', w * 0.5, h * 0.36);

    ctx.fillStyle = '#93c5fd';
    ctx.font = 'italic 900 24px serif';
    ctx.fillText('Destaca?', w * 0.5, h * 0.47);

    // Matchbox representation sliding open
    const slide = Math.min(1, cycle / 2.0);
    const boxX = w * 0.5 - 40;
    const boxY = h * 0.7;

    // Outer sleeve
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, 80, 44);
    ctx.fillRect(boxX, boxY, 80, 44);

    // Sliding drawer
    ctx.fillStyle = '#334155';
    ctx.fillRect(boxX - slide * 25, boxY + 4, 76, 36);

    // Blue match head popping up
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(boxX - slide * 25 + 14, boxY + 12 - slide * 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxX - slide * 25 + 14, boxY + 12 - slide * 14 + 5);
    ctx.lineTo(boxX - slide * 25 + 14, boxY + 36);
    ctx.stroke();
  } else {
    // Scene 2: Dark background with desk lamp spotlight beam
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, w, h);

    // White desk lamp in top right corner
    const lampX = w * 0.85;
    const lampY = 40;

    // Vibrant blue light cone
    ctx.save();
    const beam = ctx.createRadialGradient(lampX, lampY, 15, w * 0.3, h * 0.65, w * 0.7);
    beam.addColorStop(0, 'rgba(37, 99, 235, 0.7)');
    beam.addColorStop(0.5, 'rgba(29, 78, 216, 0.35)');
    beam.addColorStop(1, 'rgba(6, 8, 14, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(lampX - 10, lampY + 10);
    ctx.lineTo(10, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Lamp head
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lampX, lampY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Lamp stem
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lampX, lampY);
    ctx.lineTo(w * 0.94, 15);
    ctx.lineTo(w * 0.98, 70);
    ctx.stroke();

    // Text illuminated in spotlight
    ctx.textAlign = 'left';
    ctx.fillStyle = '#93c5fd';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Para descobrir:', 28, h * 0.52);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.fillText('COMENTE,', 28, h * 0.62);
    ctx.fillText('SIGA E CURTA', 28, h * 0.72);

    // Interactive badges
    ctx.font = '16px sans-serif';
    ctx.fillText('💬  ❤️  ↗️', 28, h * 0.84);
  }
}

function drawAoPontoPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cycle = (t * 0.8) % 7.5;

  if (cycle < 3.8) {
    // Scene 1: Pitch black background + neon search bar
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillText('O SEGREDO PARA A SUA MARCA,', w * 0.5, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('VENDAS E CANAL SE DESTACAREM', w * 0.5, 54);

    // Google search bar with neon border
    const barX = 20;
    const barW = w - 40;
    const barY = 82;
    const barH = 46;

    // Glowing RGB rainbow stroke
    const hue = (t * 120) % 360;
    ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
    ctx.lineWidth = 2.5;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, [23]);
    ctx.fill();
    ctx.stroke();

    // Search query text simulation
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    const query = 'O que é o Ao Ponto?';
    const chars = Math.floor(Math.min(query.length, (cycle - 0.5) * 10));
    ctx.fillText(chars > 0 ? query.slice(0, chars) : '', barX + 18, barY + 28);

    // Search result snippet card
    if (cycle > 2.0) {
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.roundRect(barX, barY + barH + 16, barW, 90, [10]);
      ctx.fill();
      ctx.strokeStyle = '#1f2937';
      ctx.stroke();

      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Ao Ponto — Edição de Vídeos', barX + 14, barY + barH + 40);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Organização focada em elevar canais e marcas', barX + 14, barY + barH + 58);
      ctx.fillText('através de edições com alto dinamismo.', barX + 14, barY + barH + 72);

      // Ver mais pill
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(barX + barW - 74, barY + barH + 56, 60, 22, [11]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ver mais', barX + barW - 44, barY + barH + 70);
    }
  } else {
    // Scene 2: Dark blue vignette with suited man & red tie + gold branding
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    // Blue back-light spotlight
    const spot = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.6);
    spot.addColorStop(0, 'rgba(30, 58, 138, 0.6)');
    spot.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // Suited man silhouette
    const manX = w * 0.5;
    const manY = h * 0.42;

    // Head
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(manX, manY - 25, 16, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders / suit jacket
    ctx.beginPath();
    ctx.moveTo(manX - 45, manY + 45);
    ctx.lineTo(manX - 22, manY - 8);
    ctx.lineTo(manX + 22, manY - 8);
    ctx.lineTo(manX + 45, manY + 45);
    ctx.closePath();
    ctx.fill();

    // White shirt collar
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(manX - 10, manY - 8);
    ctx.lineTo(manX, manY + 12);
    ctx.lineTo(manX + 10, manY - 8);
    ctx.closePath();
    ctx.fill();

    // Vibrant Red Tie
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(manX - 5, manY - 5);
    ctx.lineTo(manX + 5, manY - 5);
    ctx.lineTo(manX + 7, manY + 28);
    ctx.lineTo(manX, manY + 36);
    ctx.lineTo(manX - 7, manY + 28);
    ctx.closePath();
    ctx.fill();

    // Gold signature typography
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Ao Ponto Produções', w * 0.5, h * 0.72);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Siga e leia a legenda', w * 0.5, h * 0.84);
  }
}

function drawApIntroPreview(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Minimal dark luxury canvas
  ctx.fillStyle = '#05070e';
  ctx.fillRect(0, 0, w, h);

  // Soft subtle pulse glow
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.42, 10, w * 0.5, h * 0.42, 90);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Center AP geometric line drawing
  ctx.save();
  ctx.translate(w * 0.5, h * 0.4);
  ctx.scale(1.4, 1.4);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  // 'A' left diagonal
  ctx.moveTo(-24, 24);
  ctx.lineTo(0, -26);
  // 'A' cross & 'P' transition
  ctx.lineTo(14, 0);
  ctx.lineTo(26, 0);
  // 'P' upper loop
  ctx.arc(26, 12, 12, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(14, 24);
  ctx.lineTo(14, 34);
  ctx.stroke();

  ctx.restore();

  // Branding Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText('AP MOTION', w * 0.5, h * 0.72);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Das ideias aos resultados', w * 0.5, h * 0.82);
}
