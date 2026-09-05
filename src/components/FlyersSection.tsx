import React, { useState } from 'react';
import { Maximize2, Sparkles, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface FlyersSectionProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
}

export const FlyersSection: React.FC<FlyersSectionProps> = ({ projects, onOpenDetail }) => {
  // Filter flyers and image-based graphical works
  const flyers = projects.filter(
    (p) => p.category === 'flyers' || (p.mediaType === 'image' && p.category !== 'motion-design') || p.id.includes('flyer') || p.id.includes('setembro-amarelo') || p.id.includes('coral-maanaim') || p.id.includes('dicas') || p.id.includes('fussion-paixao-mimo')
  );

  // De-duplicate in case of multiple matches
  const uniqueFlyers = Array.from(new Map(flyers.map((item) => [item.id, item])).values());

  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filterTags = [
    { label: 'Todos os Flyers', value: 'all' },
    { label: 'Campanhas', value: 'campanha' },
    { label: 'Comercial & Vendas', value: 'comercial' },
    { label: 'Institucional', value: 'institucional' },
  ];

  const filteredFlyers = uniqueFlyers.filter((flyer) => {
    if (selectedTag === 'all') return true;
    if (selectedTag === 'campanha') {
      return flyer.id.includes('setembro') || flyer.tags.some(t => t.toLowerCase().includes('campanha') || t.toLowerCase().includes('conscientização'));
    }
    if (selectedTag === 'comercial') {
      return flyer.id.includes('fussion') || flyer.id.includes('imobiliaria') || flyer.id.includes('dicas');
    }
    if (selectedTag === 'institucional') {
      return flyer.id.includes('coral') || flyer.id.includes('identidade') || flyer.tags.some(t => t.toLowerCase().includes('oficial'));
    }
    return true;
  });

  return (
    <section id="flyers" className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto text-zinc-950 border-b border-zinc-200/80">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            <span>Flyers &amp; Design Gráfico</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
            Flyers Comerciais &amp; Cartazes
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Peças publicitárias, campanhas de impacto e artes digitais concebidas com tipografia cuidada e alta autoridade visual.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start sm:self-auto scrollbar-none">
          {filterTags.map((tab) => {
            const isActive = selectedTag === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedTag(tab.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RESPONSIVE EDITORIAL GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {filteredFlyers.map((flyer) => {
          const imgSrc = flyer.imageUrl || flyer.posterUrl || flyer.fallbackSvg;

          return (
            <div
              key={flyer.id}
              onClick={() => onOpenDetail(flyer)}
              className="group flex flex-col gap-3 cursor-pointer select-none"
            >
              {/* Card Media Wrapper */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 group-hover:border-zinc-950 transition-all duration-300 shadow-sm group-hover:shadow-xl">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={flyer.title}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to SVG if jpg fails to load
                      if (flyer.fallbackSvg && (e.currentTarget.src !== flyer.fallbackSvg)) {
                        e.currentTarget.src = flyer.fallbackSvg;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                    Sem imagem
                  </div>
                )}

                {/* Floating Tag Overlay */}
                {flyer.highlight && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-medium text-white shadow-xs">
                    {flyer.highlight}
                  </div>
                )}

                {/* Hover Expand Action Button */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                  <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md text-zinc-950 font-bold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 size={13} />
                    <span>Ver Arte Completa</span>
                  </div>
                </div>
              </div>

              {/* Card Metadata */}
              <div className="px-0.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                  <span className="font-medium text-zinc-600 truncate">{flyer.client}</span>
                  <span>{flyer.year}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
                  {flyer.title}
                </h3>
                {flyer.subtitle && (
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                    {flyer.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
