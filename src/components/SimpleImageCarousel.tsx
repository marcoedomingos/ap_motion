import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Play, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface CarouselItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  project?: Project;
}

interface SimpleImageCarouselProps {
  onPlayVideo?: (project: Project) => void;
  onOpenDetail?: (project: Project) => void;
  projects?: Project[];
}

export const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({
  onPlayVideo,
  onOpenDetail,
  projects = [],
}) => {
  // Feature the studio's latest productions and workflow artwork
  const showcaseList = [
    projects.find((p) => p.id === 'talento-envolvido-destaca'),
    projects.find((p) => p.id === 'macas-vermelhas-kk5000'),
    projects.find((p) => p.id === 'ap-workflow-alight-capcut'),
    projects.find((p) => p.id === 'coral-maanaim-dia-de-accao'),
    projects.find((p) => p.id === '10-dicas-videos-super-editados'),
  ].filter(Boolean) as Project[];

  const items: CarouselItem[] = (showcaseList.length >= 5 ? showcaseList : projects.slice(0, 5)).map((proj, idx) => ({
    id: proj.id,
    title: proj.title,
    category: proj.client || `Projeto 0${idx + 1}`,
    imageUrl: proj.imageUrl || proj.posterUrl || '',
    videoUrl: proj.videoUrl,
    project: proj,
  }));

  const [currentIndex, setCurrentIndex] = useState(2); // Center on AP Motion Workflow project
  const [isDragging, setIsDragging] = useState(false);

  const total = items.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const getPosition = (index: number) => {
    let diff = (index - currentIndex + total) % total;
    if (diff > total / 2) diff -= total;
    return diff;
  };

  return (
    <section id="inicio" className="relative w-full bg-black text-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden select-none border-b border-white/10">
      <div className="max-w-[1300px] mx-auto flex flex-col items-center">
        
        {/* Editorial Location & Tagline */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-mono font-medium shadow-xs border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="tracking-wider uppercase">Das ideias aos resultados</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300">
            <span>Luanda, AO • Motion, Design &amp; Video Editing</span>
          </div>
        </div>

        {/* ── HEADER ── */}
        <div className="text-center mb-6 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display mb-2">
            Motion, Design and Video Editing
          </h1>
          
          <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed mb-6">
            Transformamos as suas ideias em resultados de alto impacto com motion design, design visual e edição de vídeo comercial.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onPlayVideo && (
              <button
                onClick={() => {
                  const main = projects.find((p) => p.isProofOfProduct || p.highlight === 'Vídeo Principal') || projects[0];
                  if (main) onPlayVideo(main);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold shadow-lg hover:bg-zinc-200 transition-all cursor-pointer active:scale-95"
              >
                <Play size={13} className="fill-black" />
                <span>Ver Reel Principal</span>
              </button>
            )}
            <a
              href="#reels"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium border border-white/10 transition-all cursor-pointer"
            >
              <span>Ver Portfólio 9:16</span>
            </a>
          </div>
        </div>

        {/* ── 5-CARD STACKED CAROUSEL CONTAINER ── */}
        <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] flex items-center justify-center overflow-visible">
          {items.map((item, index) => {
            const pos = getPosition(index);
            const isCenter = pos === 0;
            const isNearLeft = pos === -1;
            const isFarLeft = pos === -2;
            const isNearRight = pos === 1;
            const isFarRight = pos === 2;

            // Only render the 5 active positions
            if (Math.abs(pos) > 2) return null;

            // Compute precise horizontal offsets matching the reference screenshot
            let translateX = '0%';
            let scale = 1;
            let zIndex = 30;
            let opacity = 1;

            if (isCenter) {
              translateX = '0%';
              scale = 1;
              zIndex = 40;
              opacity = 1;
            } else if (isNearLeft) {
              translateX = '-42%';
              scale = 0.84;
              zIndex = 30;
              opacity = 0.88;
            } else if (isFarLeft) {
              translateX = '-78%';
              scale = 0.70;
              zIndex = 20;
              opacity = 0.65;
            } else if (isNearRight) {
              translateX = '42%';
              scale = 0.84;
              zIndex = 30;
              opacity = 0.88;
            } else if (isFarRight) {
              translateX = '78%';
              scale = 0.70;
              zIndex = 20;
              opacity = 0.65;
            }

            return (
              <motion.div
                key={item.id}
                animate={{
                  x: translateX,
                  scale,
                  zIndex,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 32,
                  mass: 0.85,
                }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setTimeout(() => setIsDragging(false), 50);
                  if (info.offset.x > 45 || info.velocity.x > 250) {
                    handlePrev();
                  } else if (info.offset.x < -45 || info.velocity.x < -250) {
                    handleNext();
                  }
                }}
                onClick={() => {
                  if (isDragging) return;
                  if (!isCenter) {
                    setCurrentIndex(index);
                  } else if (item.project) {
                    if (item.project.mediaType === 'video' && onPlayVideo) {
                      onPlayVideo(item.project);
                    } else if (onOpenDetail) {
                      onOpenDetail(item.project);
                    }
                  }
                }}
                className={`absolute w-[290px] sm:w-[480px] md:w-[620px] lg:w-[680px] aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/15 transition-[box-shadow,border-color] duration-200 ${
                  isCenter
                    ? 'shadow-2xl shadow-black ring-1 ring-white/20 active:cursor-grabbing'
                    : 'shadow-md shadow-black/60 hover:opacity-100'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />

                {/* Center play icon on hover for video projects without any text covering the card */}
                {isCenter && item.project?.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white translate-x-0.5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── CONTROLS ROW (ARROW KEYS + CLEAN ARCHITECTURAL PAGINATION) ── */}
        <div className="flex items-center justify-center gap-5 mt-6 sm:mt-8">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Slide anterior"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Dot Pagination */}
          <div className="flex items-center gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Próximo slide"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10 active:scale-95"
          >
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
