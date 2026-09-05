import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { APLogo } from './APLogo';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', id: 'inicio' },
    { label: 'Reels (9:16)', id: 'reels' },
    { label: 'Flyers', id: 'flyers' },
    { label: 'Contacto', id: 'contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-3 sm:px-6 md:px-8 py-3 ${
        isScrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <div
        className={`max-w-[1240px] mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between rounded-2xl sm:rounded-full transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-lg shadow-slate-200/50'
            : 'bg-white/75 backdrop-blur-md border border-slate-200/70 shadow-sm'
        }`}
      >
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <APLogo size={28} animated={false} glow={false} className="text-zinc-950" />
          <div>
            <div className="font-display font-bold text-sm sm:text-base tracking-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
              AP MOTION
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              Luanda • Motion &amp; 3D
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-zinc-950 group-hover:w-full transition-all duration-200" />
            </button>
          ))}
        </nav>

        {/* Right CTA Cluster */}
        <div className="flex items-center gap-2.5">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/244943703425?text=Ol%C3%A1%20AP%20Motion%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200/80 text-xs font-semibold transition-all"
          >
            <span>WhatsApp</span>
          </a>

          {/* Pedir Orçamento */}
          <button
            onClick={() => onNavigate('contacto')}
            className="bg-zinc-950 hover:bg-black text-white flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-tight transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Orçamento</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-[1240px] mx-auto bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm font-semibold text-zinc-700 hover:text-zinc-950 py-2 border-b border-zinc-100 last:border-none"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('contacto');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center cursor-pointer mt-1"
          >
            Pedir Orçamento
          </button>
        </div>
      )}
    </header>
  );
};
