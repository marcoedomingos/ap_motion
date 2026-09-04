import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Eye, ArrowUpRight, Volume2, VolumeX, Sparkles, Film, Image as ImageIcon, Zap } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onOpenDetail: (project: Project) => void;
  onPlayVideo: (project: Project) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetail,
  onPlayVideo,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCardMuted, setIsCardMuted] = useState(true);
  const [imageSrc, setImageSrc] = useState(project.imageUrl || project.fallbackSvg);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync image source
  useEffect(() => {
    setImageSrc(project.imageUrl || project.fallbackSvg);
  }, [project.imageUrl, project.fallbackSvg]);

  // Video hover preview
  useEffect(() => {
    if (!videoRef.current || !project.videoUrl) return;

    if (isHovered) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, project.videoUrl]);

  const handleCardClick = () => {
    if (project.mediaType === 'video') {
      onPlayVideo(project);
    } else {
      onOpenDetail(project);
    }
  };

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsCardMuted(nextMuted);
    }
  };

  const getAspectRatioClass = () => {
    switch (project.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
        return 'aspect-[1/1]';
      case '16:9':
        return 'aspect-[16/9]';
      case '4:5':
      default:
        return 'aspect-[4/5]';
    }
  };

  const getCategoryBadge = () => {
    switch (project.category) {
      case 'motion-design':
        return {
          label: 'Motion Design',
          color: '#6C63FF',
          bg: 'rgba(108,99,255,0.15)',
          border: 'rgba(108,99,255,0.3)',
          icon: <Zap size={11} className="text-[#A78BFF]" />,
        };
      case 'edited-videos':
        return {
          label: 'Edited Video',
          color: '#ef4444',
          bg: 'rgba(239,68,68,0.15)',
          border: 'rgba(239,68,68,0.3)',
          icon: <Film size={11} className="text-red-400" />,
        };
      case 'flyers':
      default:
        return {
          label: 'Flyer',
          color: '#00F5FF',
          bg: 'rgba(0,245,255,0.12)',
          border: 'rgba(0,245,255,0.25)',
          icon: <ImageIcon size={11} className="text-[#00F5FF]" />,
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        delay: Math.min((index % 4) * 0.05, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="break-inside-avoid mb-4 sm:mb-5"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsCardMuted(true);
          }
        }}
        onClick={handleCardClick}
        className="group relative rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#0F1420] border border-white/[0.07] hover:border-[#6C63FF]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#6C63FF]/15"
      >
        {/* ═══════════════════════════════════════════════
            PIN MEDIA CONTAINER (VARIABLE ASPECT RATIO)
        ═══════════════════════════════════════════════ */}
        <div className={`relative w-full ${getAspectRatioClass()} bg-[#080B11] overflow-hidden`}>
          {project.mediaType === 'video' ? (
            <>
              {/* Video Element */}
              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.posterUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transform group-hover:scale-110 group-hover:bg-[#6C63FF] group-hover:border-[#6C63FF] transition-all shadow-xl">
                  <Play size={22} className="translate-x-0.5 fill-white" />
                </div>
              </div>

              {/* Sound Toggle (Pinterest Style in-pin audio preview) */}
              <button
                onClick={handleAudioToggle}
                className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-md"
                title={isCardMuted ? 'Ouvir prévia' : 'Silenciar'}
              >
                {isCardMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#00F5FF]" />}
              </button>
            </>
          ) : (
            <>
              {/* Image Element */}
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={project.title}
                  loading="lazy"
                  onError={() => {
                    if (project.fallbackSvg && imageSrc !== project.fallbackSvg) {
                      setImageSrc(project.fallbackSvg);
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <ImageIcon size={32} />
                </div>
              )}

              {/* Image hover center indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl">
                  <Eye size={20} />
                </div>
              </div>
            </>
          )}

          {/* Top Left Badge: Category Tag */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-semibold text-white shadow-md"
            style={{
              background: badge.bg,
              border: `1px solid ${badge.border}`,
              color: badge.color,
            }}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          {/* Top Right Pinterest Action Button on Hover */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <span className="btn-gradient px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight shadow-lg flex items-center gap-1">
              <span>{project.mediaType === 'video' ? 'Assistir' : 'Ver Arte'}</span>
              <ArrowUpRight size={12} />
            </span>
          </div>

          {/* Bottom scrim gradient for readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F1420] via-[#0F1420]/70 to-transparent pointer-events-none" />
        </div>

        {/* ═══════════════════════════════════════════════
            PIN FOOTER / DETAILS
        ═══════════════════════════════════════════════ */}
        <div className="p-4 pt-1 bg-[#0F1420] space-y-2">
          {/* Client & Duration row */}
          <div className="flex items-center justify-between text-[11px] text-[#6B7A99]">
            <span className="font-mono truncate max-w-[150px] font-medium text-[#B0BDDA]">
              {project.client}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              {project.duration || project.dimensions}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[#A78BFF] transition-colors">
            {project.title}
          </h3>

          {/* Subtitle or Description snippet */}
          {project.subtitle && (
            <p className="text-[11px] text-[#6B7A99] line-clamp-1 leading-relaxed">
              {project.subtitle}
            </p>
          )}

          {/* Tags */}
          <div className="pt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-[#161D2E] text-[10px] text-[#6B7A99] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
