import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ReelsCarouselProps {
  projects: Project[];
  onPlayVideo: (project: Project) => void;
  onOpenDetail: (project: Project) => void;
}

export const ReelsCarousel: React.FC<ReelsCarouselProps> = ({
  projects,
  onPlayVideo,
  onOpenDetail,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter 9:16 projects and prioritize video projects
  const verticalProjects = projects.filter(
    (p) => p.aspectRatio === '9:16' || p.category === 'edited-videos' || p.category === 'motion-design'
  );

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [verticalProjects]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="reels" className="relative py-10 sm:py-14 overflow-hidden border-b border-zinc-200/80 bg-[#F7F8FA] text-zinc-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>Reels &amp; Formatos Verticais</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 tracking-tight">
              Trabalhos em 9:16
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
              Conteúdos verticais concebidos para alta retenção em campanhas comerciais e redes sociais.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Rolar para esquerda"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300 shadow-xs active:scale-95'
                  : 'border-zinc-200/60 bg-zinc-100 text-zinc-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Rolar para direita"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300 shadow-xs active:scale-95'
                  : 'border-zinc-200/60 bg-zinc-100 text-zinc-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── 9:16 HORIZONTAL TRACK ── */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {verticalProjects.map((project) => {
            const isHovered = hoveredId === project.id;

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (project.mediaType === 'video') {
                    onPlayVideo(project);
                  } else {
                    onOpenDetail(project);
                  }
                }}
                className="flex flex-col gap-2.5 shrink-0 snap-start cursor-pointer group"
              >
                {/* ── 100% CLEAN VIDEO CARD ── */}
                <div
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative w-[210px] sm:w-[240px] md:w-[250px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-zinc-200 group-hover:border-zinc-950 transition-all duration-300 shadow-sm group-hover:shadow-xl"
                >
                  {project.videoUrl && isHovered ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={project.posterUrl || project.thumbnailUrl || project.images?.[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Play icon indicator only on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-black/20">
                    <div className="w-11 h-11 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-zinc-950 shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={18} className="fill-zinc-950 translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* ── LABELS LOCATED CLEANLY BELOW THE CARD ── */}
                <div className="w-[210px] sm:w-[240px] md:w-[250px] px-0.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-0.5 font-mono">
                    <span className="font-medium text-zinc-600 truncate">{project.client || 'AP Motion'}</span>
                    {project.duration && (
                      <span className="text-[11px] shrink-0">{project.duration}</span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
