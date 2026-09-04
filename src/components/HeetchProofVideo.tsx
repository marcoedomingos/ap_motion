import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeetchProofVideoProps {
  autoPlay?: boolean;
  isInteractive?: boolean;
  className?: string;
  showChrome?: boolean;
  onOpenModal?: () => void;
}

export const HeetchProofVideo: React.FC<HeetchProofVideoProps> = ({
  autoPlay = true,
  isInteractive = true,
  className = '',
  onOpenModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(8.5);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [autoPlay]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`relative select-none overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl flex flex-col font-sans ${className}`}
      onClick={onOpenModal}
    >
      {/* Proof of Product Badge */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-lg">
        <Sparkles size={12} className="text-pink-400" />
        <span>Prova de Produto Oficial</span>
      </div>

      {/* Main Video Viewport */}
      <div className="relative w-full aspect-[9/14] sm:aspect-[9/13] max-h-[520px] bg-black flex items-center justify-center overflow-hidden cursor-pointer group">
        <video
          ref={videoRef}
          src="/assets/videos/heetch-destaque-motion.mp4"
          poster="/assets/videos/posters/heetch-destaque-motion.jpg"
          playsInline
          muted={isMuted}
          loop
          autoPlay={autoPlay}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              setDuration(videoRef.current.duration || 8.5);
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 8.5);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
        />

        {/* Play Overlay button when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <Play size={28} className="translate-x-0.5 fill-white" />
            </div>
          </div>
        )}

        {/* Floating audio prompt if muted */}
        {isMuted && isPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs text-white hover:bg-black transition-all shadow-lg cursor-pointer"
          >
            <VolumeX size={13} className="text-pink-400" />
            <span>Activar Áudio</span>
          </button>
        )}
      </div>

      {/* Scrubber & Interactive Controls Bar */}
      {isInteractive && (
        <div className="px-4 py-2.5 bg-[#12151c] border-t border-white/10 flex flex-col gap-2">
          {/* Progress bar */}
          <div
            className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              if (videoRef.current && duration > 0) {
                videoRef.current.currentTime = ratio * duration;
                setCurrentTime(ratio * duration);
              }
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-sky-400 transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Reiniciar"
              >
                <RotateCcw size={13} />
              </button>

              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-lg transition-colors ${
                  !isMuted ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-zinc-800 text-zinc-400'
                }`}
                title={isMuted ? 'Ativar Áudio Oficial' : 'Silenciar'}
              >
                {!isMuted ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>

              <span className="text-[11px] text-zinc-400 font-mono pl-1">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>

            {/* Direct CTA */}
            <a
              href={`https://wa.me/244943703425?text=${encodeURIComponent(
                'Olá AP Motion! Assisti ao vídeo comercial da Heetch Angola ("Precisa de destaque? Motion designs é a solução") e gostaria de solicitar um orçamento para a minha marca.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shadow-xs"
            >
              <span>Pedir Vídeo Similar</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
