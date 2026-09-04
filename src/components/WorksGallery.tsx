import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, CategoryType } from '../types';
import { ProjectCard } from './ProjectCard';
import { Video, Image as ImageIcon, Sparkles, Film, Zap, Layers, Grid } from 'lucide-react';

interface WorksGalleryProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
  onPlayVideo: (project: Project) => void;
}

export const WorksGallery: React.FC<WorksGalleryProps> = ({
  projects,
  onOpenDetail,
  onPlayVideo,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  // Count items per category
  const motionCount = projects.filter((p) => p.category === 'motion-design').length;
  const editedCount = projects.filter((p) => p.category === 'edited-videos').length;
  const flyersCount = projects.filter((p) => p.category === 'flyers').length;

  const categories: {
    label: string;
    value: CategoryType;
    icon: React.ReactNode;
    count: number;
    accentColor: string;
  }[] = [
    {
      label: 'Todos',
      value: 'all',
      icon: <Grid size={13} />,
      count: projects.length,
      accentColor: '#6C63FF',
    },
    {
      label: 'Motion Design',
      value: 'motion-design',
      icon: <Zap size={13} />,
      count: motionCount,
      accentColor: '#6C63FF',
    },
    {
      label: 'Edited Videos',
      value: 'edited-videos',
      icon: <Film size={13} />,
      count: editedCount,
      accentColor: '#ef4444',
    },
    {
      label: 'Flyers',
      value: 'flyers',
      icon: <ImageIcon size={13} />,
      count: flyersCount,
      accentColor: '#00F5FF',
    },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="trabalhos" className="py-16 sm:py-24 px-3 sm:px-6 md:px-8 max-w-[1400px] mx-auto">
      <div className="divider-gradient mb-14" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-2.5">
            <span className="w-5 h-px bg-[#6C63FF]" />
            <span>Pinterest Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
            Galeria em <span className="text-gradient">Movimento.</span>
          </h2>
          <p className="text-[#6B7A99] text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
            Explore trabalhos organizados por especialidade. Passe o cursor para pré-visualizar o vídeo ou clique para assistir no player completo.
          </p>
        </div>

        {/* Pinterest Filter Bar */}
        <div className="flex items-center gap-2 bg-[#0F1420] border border-white/[0.08] p-1.5 rounded-2xl sm:rounded-full overflow-x-auto self-start md:self-auto shrink-0 shadow-lg">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/40'
                    : 'text-[#6B7A99] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-zinc-400'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-zinc-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PINTEREST MASONRY GRID (STAGGERED COLUMNS)
      ═══════════════════════════════════════════════ */}
      <motion.div
        layout
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 [column-fill:_balance]"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onOpenDetail={onOpenDetail}
              onPlayVideo={onPlayVideo}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
