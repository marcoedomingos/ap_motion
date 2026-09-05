import React from 'react';
import { APLogo } from './APLogo';
import { ArrowUp, MessageCircle, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { label: 'Início', id: 'inicio' },
    { label: 'Reels (9:16)', id: 'reels' },
    { label: 'Flyers', id: 'flyers' },
    { label: 'Contacto', id: 'contacto' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="px-4 sm:px-6 md:px-8 max-w-[1240px] mx-auto pt-8 pb-12 text-zinc-950 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row gap-8 justify-between">

        {/* Brand block */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2.5">
            <APLogo size={26} animated={false} glow={false} className="text-zinc-950" />
            <div className="font-display font-bold text-sm tracking-tight text-zinc-950">AP MOTION</div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Estúdio independente de motion design e animação 3D em Luanda, Angola.
          </p>
          <div className="text-[11px] font-mono text-zinc-400">
            © {new Date().getFullYear()} AP Motion Studio • Luanda, AO
          </div>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">Navegação</div>
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors text-left cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">Contacto</div>
          <a href="mailto:contato@apmotion.ao" className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors">
            contato@apmotion.ao
          </a>
          <a href="https://wa.me/244943703425" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors">
            +244 943 703 425
          </a>
          <div className="text-[11px] text-zinc-400">Luanda, Angola</div>
        </div>

        {/* Back to top */}
        <div className="flex items-start md:items-end">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-all cursor-pointer active:scale-95"
          >
            <ArrowUp size={13} />
            <span>Topo</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
