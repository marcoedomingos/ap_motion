import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { RotatingStamp } from './RotatingStamp';
import { SparkleIcon } from './SparkleIcon';
import { PhoneCarouselMockup } from './PhoneCarouselMockup';
import { PROJECTS } from '../data/projects';

interface HeroSectionProps {
  featuredProject: Project;
  onSelectProject: (project: Project) => void;
  onExploreWorks: () => void;
  onNavigate?: (id: string) => void;
  allProjects?: Project[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProject,
  onSelectProject,
  onExploreWorks,
  onNavigate,
  allProjects = PROJECTS,
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 px-4 sm:px-6 md:px-10 overflow-hidden bg-[#F3F5FA] bg-dot-grid-reference text-slate-900">
      
      {/* ── AMBIENT GRADIENT LIGHTING ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft violet glow top left */}
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl" />
        {/* Soft cyan glow bottom right */}
        <div className="absolute -bottom-[15%] -right-[5%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-3xl" />
        {/* Subtle center illumination */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-white/70 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ═══════════════════════════════════════════════
              LEFT COLUMN: EXACT REFERENCE COMPOSITION
          ═══════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 max-w-xl">
            
            {/* Top row: Rotating Stamp + Availability status */}
            <div className="flex items-center gap-6">
              <RotatingStamp
                size={110}
                text="• AP MOTION STUDIO • DAS IDEIAS ÀS SOLUÇÕES "
                className="shrink-0"
              />
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Luanda, AO • Disponível para briefings</span>
              </div>
            </div>

            {/* Squircle Brand Logo Box (Matching the 'P' purple icon in reference) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200/80 shadow-[0_10px_25px_rgba(124,58,237,0.15)] flex items-center justify-center p-2.5 group hover:scale-105 transition-transform"
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#D946EF] flex items-center justify-center shadow-inner">
                {/* Stylized 'P' / 'AP' glyph matching reference logo aesthetic */}
                <svg viewBox="0 0 40 40" width="26" height="26" fill="white">
                  <path d="M14 8C10.686 8 8 10.686 8 14V32H14V22H21C26.523 22 31 17.523 31 12C31 9.79 29.21 8 27 8H14ZM14 14H21C22.105 14 23 14.895 23 16C23 17.105 22.105 18 21 18H14V14Z" />
                  <circle cx="28" cy="28" r="4" fill="#A3E635" />
                </svg>
              </div>
            </motion.div>

            {/* ── HEADLINE (MATCHING THE REFERENCE TYPOGRAPHY) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-0.5"
            >
              <h1 className="font-serif text-slate-900 leading-[1.02] tracking-tight">
                <span className="block text-[clamp(2.8rem,5.8vw,4.8rem)] font-normal text-slate-900">
                  Carousel
                </span>
                <span className="block text-[clamp(2.8rem,5.8vw,4.8rem)] font-normal text-slate-900">
                  Animation
                </span>
                <span className="block text-[clamp(2.8rem,5.8vw,4.8rem)] font-bold text-gradient-indigo">
                  que Converte
                </span>
              </h1>
            </motion.div>

            {/* ── CHAPTER 5 PILL BADGE (EXACT REFERENCE ELEMENT) ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="pt-1"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-mono font-bold text-xs tracking-[0.2em] uppercase shadow-lg shadow-black/10">
                <span className="text-[10px] text-white/70">✦</span>
                <span>CHAPTER 5 • DESTAQUES</span>
                <span className="text-[10px] text-white/70">✦</span>
              </div>
            </motion.div>

            {/* Sub-text explanation */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
              Motion design comercial, animações 2D/3D e vídeos verticais para marcas que precisam prender a atenção nos primeiros segundos.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://wa.me/244943703425?text=Ol%C3%A1%20AP%20Motion%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20motion%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-slate-900 hover:bg-black text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageCircle size={16} className="text-[#A3E635]" />
                <span>Falar no WhatsApp</span>
                <ArrowUpRight size={14} />
              </a>

              <button
                onClick={onExploreWorks}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Ver Portfólio</span>
              </button>
            </div>

            {/* ── SPARKLES AT BOTTOM LEFT (EXACT REFERENCE ELEMENT) ── */}
            <div className="flex items-center gap-8 pt-4 select-none">
              <SparkleIcon variant="8-point" size={42} className="text-slate-900" />
              <SparkleIcon variant="4-point" size={38} className="text-slate-900" />
            </div>

          </div>

          {/* ═══════════════════════════════════════════════
              RIGHT COLUMN: 3D PHONE COVER-FLOW CAROUSEL
          ═══════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <PhoneCarouselMockup
                projects={allProjects}
                onPlayVideo={onSelectProject}
                onOpenDetail={onSelectProject}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
