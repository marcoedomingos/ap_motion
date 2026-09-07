import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageCircle,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
  onPlayVideo: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
  onPlayVideo,
}) => {
  if (!project) return null;

  const [modalImgSrc, setModalImgSrc] = useState(project.imageUrl || project.fallbackSvg);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
    setModalImgSrc(project.imageUrl || project.fallbackSvg);
  }, [project.imageUrl, project.fallbackSvg, project.id]);

  const hasMultipleSlides = Boolean(project.images && project.images.length > 1);
  const activeImgSrc = hasMultipleSlides
    ? project.images![slideIndex]
    : (modalImgSrc || project.imageUrl || project.fallbackSvg);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onSelectProject(prevProject);
      } else if (e.key === 'ArrowRight') {
        onSelectProject(nextProject);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project?.id]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const whatsappMessage = encodeURIComponent(
    `Olá AP Motion! Gostei da peça de design "${project.title}" (${project.client}) no vosso portfólio e gostaria de solicitar uma proposta.`
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-2xl p-3 sm:p-6 overflow-y-auto select-none"
        onClick={onClose}
      >
        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md text-xs font-mono transition-all cursor-pointer active:scale-95 shadow-xl"
          aria-label="Fechar visualizador"
          title="Fechar (ESC)"
        >
          <X size={15} />
          <span className="hidden sm:inline font-sans font-medium">Fechar</span>
          <kbd className="text-[10px] text-zinc-400">ESC</kbd>
        </button>

        {/* Floating Desktop Next/Prev Arrow Keys */}
        {allProjects.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(prevProject);
              }}
              className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer z-40 group"
              aria-label="Item anterior"
              title="Item anterior (←)"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(nextProject);
              }}
              className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer z-40 group"
              aria-label="Próximo item"
              title="Próximo item (→)"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MAIN CONTAINER:
            TAKES MORE OF HORIZONTAL SIZE (w-full max-w-4xl / max-w-5xl)
            1. TOP: ARTWORK SHOWCASE
            2. BOTTOM: INFORMATION SECTION BELOW THE ARTWORK
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center my-auto w-full max-w-4xl lg:max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Artwork Stage */}
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-black/90 border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex items-center justify-center h-[50vh] sm:h-[54vh] md:h-[58vh] max-h-[560px]">
            {project.mediaType === 'image' && activeImgSrc ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  key={activeImgSrc}
                  src={activeImgSrc}
                  alt={`${project.title}${hasMultipleSlides ? ` — Lâmina ${slideIndex + 1}` : ''}`}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (project.fallbackSvg && activeImgSrc !== project.fallbackSvg) {
                      setModalImgSrc(project.fallbackSvg);
                    }
                  }}
                  className="w-full h-full object-contain select-none"
                />

                {/* Carrossel Navigation Controls */}
                {hasMultipleSlides && project.images && (
                  <>
                    {/* Top Right Counter Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono font-semibold text-white shadow-lg pointer-events-none">
                      Lâmina {slideIndex + 1} de {project.images.length}
                    </div>

                    {/* Previous Slide Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                      aria-label="Lâmina anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Next Slide Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndex((prev) => (prev + 1) % project.images!.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 z-20"
                      aria-label="Próxima lâmina"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-lg z-20">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlideIndex(idx);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            idx === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
                          }`}
                          aria-label={`Ir para lâmina ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center group">
                {project.posterUrl && (
                  <img
                    src={project.posterUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                )}
                <button
                  onClick={() => onPlayVideo(project)}
                  className="relative z-10 w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Reproduzir vídeo"
                >
                  <Play size={24} className="translate-x-0.5 fill-zinc-950" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Information Section Below the Artwork */}
          <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-[#0E0F14] border border-white/[0.10] shadow-xl text-white flex flex-col gap-3">
            {/* Top Row: Client & Year on left | Actions on right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-0.5">
                  <span className="font-semibold text-white">{project.client}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline text-zinc-500">{project.category}</span>
                </div>
                <h2 className="text-base sm:text-xl font-display font-bold text-white tracking-tight leading-snug">
                  {project.title}
                </h2>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <a
                  href={`https://wa.me/244950723170?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={15} className="fill-zinc-950" />
                  <span>Pedir Orçamento</span>
                </a>

                {allProjects.length > 1 && (
                  <div className="flex items-center gap-1 pl-1">
                    <button
                      onClick={() => onSelectProject(prevProject)}
                      className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                      title="Item anterior"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-xs font-mono text-zinc-400 px-1.5 min-w-[45px] text-center">
                      {currentIndex + 1}/{allProjects.length}
                    </span>
                    <button
                      onClick={() => onSelectProject(nextProject)}
                      className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                      title="Próximo item"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Description & Tags */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs text-zinc-300">
              <div className="flex-1 min-w-0">
                {project.description && (
                  <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap md:justify-end gap-1.5 shrink-0 max-w-sm">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};




