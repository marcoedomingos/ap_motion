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
  // 5 high-definition landscape items matching the reference screenshot aesthetics
  const defaultItems: CarouselItem[] = [
    {
      id: 'item-1',
      title: 'Alpine Vista & Pine Peaks',
      category: 'Landscape 01',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'item-2',
      title: 'Emerald Lake & Winter Pines',
      category: 'Landscape 02',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'item-3',
      title: 'Torres del Paine Sunset Ridge',
      category: 'Landscape 03',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'item-4',
      title: 'Misty Alpine Ridge & Fog',
      category: 'Landscape 04',
      imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 'item-5',
      title: 'Golden Hour Dawn Mountain Peaks',
      category: 'Landscape 05',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  // Merge with real projects if available
  const items: CarouselItem[] = defaultItems.map((item, idx) => {
    if (projects[idx]) {
      return {
        ...item,
        title: projects[idx].title,
        category: projects[idx].client || item.category,
        imageUrl: projects[idx].imageUrl || projects[idx].posterUrl || item.imageUrl,
        videoUrl: projects[idx].videoUrl,
        project: projects[idx],
      };
    }
    return item;
  });

  const [currentIndex, setCurrentIndex] = useState(2); // Center on item 3 like reference
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
    <section id="inicio" className="relative w-full bg-white text-zinc-950 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden select-none border-b border-zinc-200/80">
      <div className="max-w-[1300px] mx-auto flex flex-col items-center">
        
        {/* Editorial Location / Status Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono font-medium text-zinc-600 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
          <span>Luanda, AO • Estúdio disponível para projetos</span>
        </div>

        {/* ── HEADER ── */}
        <div className="text-center mb-6 sm:mb-8 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 font-display mb-2">
            Motion Design &amp; 3D
          </h1>
          
          <p className="text-xs sm:text-sm text-zinc-500 font-normal max-w-lg mx-auto leading-relaxed">
            Filmes comerciais, animação 2D/3D e identidades visuais em movimento.
          </p>
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
                className={`absolute w-[290px] sm:w-[480px] md:w-[620px] lg:w-[680px] aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-zinc-200/80 transition-[box-shadow,border-color] duration-200 ${
                  isCenter
                    ? 'shadow-2xl shadow-zinc-900/15 ring-1 ring-black/5 active:cursor-grabbing'
                    : 'shadow-md shadow-zinc-900/5 hover:opacity-100'
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
                    <div className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-zinc-950 shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-zinc-950 translate-x-0.5" />
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
            className="text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-zinc-100 active:scale-95"
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
                    ? 'w-6 h-1.5 bg-zinc-950'
                    : 'w-1.5 h-1.5 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Próximo slide"
            className="text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-zinc-100 active:scale-95"
          >
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
