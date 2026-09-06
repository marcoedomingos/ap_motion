import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Project } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  allProjects: Project[];
  onSelectProject: (project: Project) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  project,
  allProjects,
  onSelectProject,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playFeedback, setPlayFeedback] = useState<'play' | 'pause' | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimer = useRef<number | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  // Filter video projects for the playlist
  const videoProjects = useMemo(
    () => allProjects.filter((p) => p.mediaType === 'video'),
    [allProjects]
  );

  const currentProject =
    project && project.mediaType === 'video'
      ? project
      : videoProjects[0] || project;

  const currentIndex = videoProjects.findIndex((p) => p.id === currentProject?.id);
  const prevVideo = videoProjects[(currentIndex - 1 + videoProjects.length) % videoProjects.length];
  const nextVideo = videoProjects[(currentIndex + 1) % videoProjects.length];

  // Reset video playback on project change or modal open
  useEffect(() => {
    if (!isOpen || !currentProject) return;

    setCurrentTime(0);
    setIsBuffering(true);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = isMuted;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(() => {
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsBuffering(false);
              })
              .catch(() => {
                setIsPlaying(false);
                setIsBuffering(false);
              });
          });
      }
    }
  }, [isOpen, currentProject?.id]);

  // Keyboard navigation & playback controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          onSelectProject(prevVideo);
        } else {
          seekRelative(-5);
        }
      } else if (e.key === 'ArrowRight') {
        if (e.shiftKey) {
          onSelectProject(nextVideo);
        } else {
          seekRelative(5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isMuted, currentIndex]);

  const triggerFeedback = (type: 'play' | 'pause') => {
    setPlayFeedback(type);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => {
      setPlayFeedback(null);
    }, 400);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          triggerFeedback('play');
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => {
            setIsPlaying(true);
            triggerFeedback('play');
          });
        });
    } else {
      video.pause();
      setIsPlaying(false);
      triggerFeedback('pause');
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true));
  };

  const seekRelative = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
  };

  const toggleFullscreen = () => {
    const container = playerFrameRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2200);
  };

  if (!isOpen || !currentProject) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVertical = currentProject.aspectRatio === '9:16' || currentProject.dimensions?.includes('9:16');

  const whatsappMessage = encodeURIComponent(
    `Olá AP Motion! Assisti ao projeto "${currentProject.title}" (${currentProject.client}) no vosso estúdio e gostaria de solicitar um orçamento para um projeto semelhante.`
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
          aria-label="Fechar player"
          title="Fechar (ESC)"
        >
          <X size={15} />
          <span className="hidden sm:inline font-sans font-medium">Fechar</span>
          <kbd className="text-[10px] text-zinc-400">ESC</kbd>
        </button>

        {/* Floating Desktop Next/Prev Arrow Keys on Sides */}
        {videoProjects.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(prevVideo);
              }}
              className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer z-40 group"
              aria-label="Vídeo anterior"
              title="Vídeo anterior (Shift + ←)"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(nextVideo);
              }}
              className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer z-40 group"
              aria-label="Próximo vídeo"
              title="Próximo vídeo (Shift + →)"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MAIN CONTAINER:
            TAKES MORE OF HORIZONTAL SIZE (w-full max-w-4xl / max-w-5xl)
            1. TOP: CINEMATIC VIDEO PLAYER (EXPANDED HORIZONTAL CANVAS)
            2. BOTTOM: SPACIOUS INFORMATION & ACTION ROW BELOW THE VIDEO
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center my-auto w-full max-w-4xl lg:max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ══════════════════════════════════════════════════════════════
              1. THE VIDEO PLAYER STAGE (MORE HORIZONTAL PRESENCE)
          ══════════════════════════════════════════════════════════════ */}
          <div
            ref={playerFrameRef}
            onMouseMove={handleMouseMove}
            onClick={togglePlay}
            className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-black/90 border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isVertical
                ? 'h-[50vh] sm:h-[54vh] md:h-[58vh] max-h-[560px]'
                : 'aspect-video max-h-[58vh]'
            }`}
          >
            {/* The Video Element */}
            <video
              ref={videoRef}
              src={currentProject.videoUrl}
              poster={currentProject.posterUrl}
              playsInline
              preload="auto"
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 0);
              }}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              className="w-full h-full object-contain"
            />

            {/* Play/Pause Transient Icon Feedback */}
            <AnimatePresence>
              {playFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.28 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
                >
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    {playFeedback === 'play' ? (
                      <Play size={26} className="translate-x-0.5 fill-white" />
                    ) : (
                      <Pause size={26} className="fill-white" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Paused Ambient Play Button */}
            {!isPlaying && !playFeedback && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
                <div className="w-16 h-16 rounded-full bg-white/95 text-zinc-950 shadow-2xl flex items-center justify-center">
                  <Play size={24} className="translate-x-0.5 fill-zinc-950" />
                </div>
              </div>
            )}

            {/* Buffering Spinner */}
            {isBuffering && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 z-30">
                <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            )}

            {/* Audio Toggle (Top-Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md text-xs font-mono transition-all cursor-pointer"
              title={isMuted ? 'Ativar som (M)' : 'Silenciar (M)'}
            >
              {isMuted ? (
                <>
                  <VolumeX size={13} className="text-zinc-400" />
                  <span>Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 size={13} className="text-white" />
                  <span>Som</span>
                </>
              )}
            </button>

            {/* Format Tag (Top-Left) */}
            <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-white/80 border border-white/10">
                {currentProject.dimensions || (isVertical ? '1080 x 1920 (9:16)' : 'HD Video')}
              </span>
            </div>

            {/* ── AUTO-FADING VIDEO CONTROLS BAR ── */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute inset-x-3 bottom-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 z-20 transition-all duration-300 text-white ${
                showControls || !isPlaying
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              {/* Timeline Scrubber */}
              <div
                className="group/scrub relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full overflow-hidden cursor-pointer transition-all mb-2"
                onClick={handleTimelineClick}
              >
                <div
                  className="h-full bg-white rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Scrubber Controls */}
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 rounded hover:bg-white/15 text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="fill-white" />}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-1 rounded hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Reiniciar vídeo"
                  >
                    <RotateCcw size={13} />
                  </button>

                  <span className="text-[11px] font-mono text-zinc-300 select-none">
                    {formatTime(currentTime)} <span className="text-zinc-500">/</span> {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-1 rounded hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Ecrã inteiro (F)"
                >
                  {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              2. INFORMATION SECTION BELOW THE VIDEO
                 SPACIOUS, ELEGANT ARCHITECTURAL STUDIO DOSSIER
          ══════════════════════════════════════════════════════════════ */}
          <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-[#0E0F14] border border-white/[0.10] shadow-xl text-white flex flex-col gap-3">
            {/* Top Row: Client & Year on left | Actions on right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              {/* Client & Year */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-0.5">
                  <span className="font-semibold text-white">{currentProject.client}</span>
                  <span>•</span>
                  <span>{currentProject.year}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline text-zinc-500">{currentProject.category}</span>
                </div>
                <h2 className="text-base sm:text-xl font-display font-bold text-white tracking-tight leading-snug">
                  {currentProject.title}
                </h2>
              </div>

              {/* Actions: Direct WhatsApp CTA + Stepper */}
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

                {videoProjects.length > 1 && (
                  <div className="flex items-center gap-1 pl-1">
                    <button
                      onClick={() => onSelectProject(prevVideo)}
                      className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                      title="Vídeo anterior (Shift + ←)"
                      aria-label="Vídeo anterior"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-xs font-mono text-zinc-400 px-1.5 min-w-[45px] text-center">
                      {currentIndex + 1}/{videoProjects.length}
                    </span>
                    <button
                      onClick={() => onSelectProject(nextVideo)}
                      className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                      title="Próximo vídeo (Shift + →)"
                      aria-label="Próximo vídeo"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Synopsis, Voiceover Text & Technical Tags */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs text-zinc-300">
              {/* Synopsis / Description */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {currentProject.description && (
                  <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                    {currentProject.description}
                  </p>
                )}
                {currentProject.voiceoverText && (
                  <p className="text-zinc-400 italic text-[11px] border-l-2 border-white/40 pl-2 mt-1">
                    "{currentProject.voiceoverText}"
                  </p>
                )}
              </div>

              {/* Tags & Deliverables */}
              {currentProject.tags && currentProject.tags.length > 0 && (
                <div className="flex flex-wrap md:justify-end gap-1.5 shrink-0 max-w-sm">
                  {currentProject.tags.map((tag) => (
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





