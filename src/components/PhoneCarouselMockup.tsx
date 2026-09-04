import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star, ChevronLeft, ChevronRight, Film, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import artistAvatar from '../assets/images/motion_artist_avatar.jpg';

interface PhoneCarouselMockupProps {
  projects: Project[];
  onPlayVideo: (project: Project) => void;
  onOpenDetail: (project: Project) => void;
}

export const PhoneCarouselMockup: React.FC<PhoneCarouselMockupProps> = ({
  projects,
  onPlayVideo,
  onOpenDetail,
}) => {
  // Use projects with video or strong visuals
  const showcaseProjects = projects.filter(
    (p) => p.aspectRatio === '9:16' || p.category === 'edited-videos' || p.category === 'motion-design'
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const total = showcaseProjects.length;
  const currentProject = showcaseProjects[activeIndex] || showcaseProjects[0];

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const prevProject = showcaseProjects[prevIndex];
  const nextProject = showcaseProjects[nextIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(nextIndex);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prevIndex);
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Soft ambient backlight glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-400/20 rounded-[50px] blur-2xl -z-10 pointer-events-none" />

      {/* ── PHONE CHASSIS ── */}
      <div className="relative bg-white rounded-[44px] p-4 sm:p-5 shadow-[0_24px_70px_rgba(30,41,59,0.14)] border border-slate-200/80">
        
        {/* Dynamic Island / Speaker Pill */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-indigo-900/60" />
          </div>
        </div>

        {/* ── PHONE SCREEN HEADER ── */}
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-serif text-slate-800 tracking-tight">
            Favourites
          </h2>
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/30">
            <img
              src={artistAvatar}
              alt="Profile"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
        </div>

        {/* ── 3D COVER-FLOW CAROUSEL ── */}
        <div className="relative h-[310px] flex items-center justify-center overflow-visible perspective-1000 my-2">
          
          {/* LEFT PREVIEW CARD (Angled / Scaled) */}
          <div
            onClick={handlePrev}
            className="absolute left-[-15px] sm:left-[-10px] w-[140px] sm:w-[155px] h-[240px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 ease-out z-10 opacity-75 hover:opacity-100"
            style={{
              transform: 'rotateY(20deg) scale(0.88) translateX(-15px)',
              transformOrigin: 'right center',
            }}
          >
            <img
              src={prevProject.posterUrl || prevProject.thumbnailUrl || prevProject.imageUrl}
              alt={prevProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <span className="text-[9px] font-mono text-white/80 line-clamp-1">
                {prevProject.title}
              </span>
            </div>
          </div>

          {/* CENTER ACTIVE CARD */}
          <motion.div
            key={currentProject.id}
            initial={{ scale: 0.92, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => {
              if (currentProject.mediaType === 'video') {
                onPlayVideo(currentProject);
              } else {
                onOpenDetail(currentProject);
              }
            }}
            className="relative w-[185px] sm:w-[205px] h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-2 border-white/60 cursor-pointer z-20 group"
          >
            <img
              src={currentProject.posterUrl || currentProject.thumbnailUrl || currentProject.imageUrl}
              alt={currentProject.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:bg-[#6366F1] transition-all duration-300">
                <Play size={20} className="fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Client Pill */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white border border-white/15">
                {currentProject.client || 'AP Motion'}
              </span>
            </div>

            {/* Title at bottom of card */}
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
              <span className="text-[10px] font-semibold text-[#A5B4FC] uppercase tracking-wider block">
                {currentProject.highlight || 'Featured Reel'}
              </span>
              <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 leading-snug">
                {currentProject.title}
              </h3>
            </div>
          </motion.div>

          {/* RIGHT PREVIEW CARD (Angled / Scaled) */}
          <div
            onClick={handleNext}
            className="absolute right-[-15px] sm:right-[-10px] w-[140px] sm:w-[155px] h-[240px] rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 ease-out z-10 opacity-75 hover:opacity-100"
            style={{
              transform: 'rotateY(-20deg) scale(0.88) translateX(15px)',
              transformOrigin: 'left center',
            }}
          >
            <img
              src={nextProject.posterUrl || nextProject.thumbnailUrl || nextProject.imageUrl}
              alt={nextProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <span className="text-[9px] font-mono text-white/80 line-clamp-1">
                {nextProject.title}
              </span>
            </div>
          </div>

          {/* Navigation Arrow Overlays */}
          <button
            onClick={handlePrev}
            aria-label="Anterior"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próximo"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── BOTTOM INFO SHEET (LIKE IN THE REFERENCE IMAGE) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 mt-2"
          >
            {/* Title & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                {currentProject.title.split('—')[0].trim()}
              </h4>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                <span>5.0</span>
                <Star size={11} className="fill-amber-400 text-amber-400" />
              </div>
            </div>

            {/* Synopsis / Description snippet */}
            <p className="text-slate-600 text-[11px] sm:text-xs line-clamp-2 leading-relaxed mb-3">
              {currentProject.description || currentProject.subtitle}
            </p>

            {/* Action CTA Button inside phone */}
            <button
              onClick={() => {
                if (currentProject.mediaType === 'video') {
                  onPlayVideo(currentProject);
                } else {
                  onOpenDetail(currentProject);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-300/80 hover:border-indigo-400 text-slate-900 text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer group"
            >
              <Film size={14} className="text-indigo-600" />
              <span>Watch on AP Motion</span>
              <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};
