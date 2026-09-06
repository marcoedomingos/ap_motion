import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
      {/* Refined WhatsApp Action - Secondary White Button on Primary Black */}
      <a
        href="https://wa.me/244950723170?text=Ol%C3%A1%20AP%20Motion%2C%20gostaria%20de%20conversar%20sobre%20um%20projecto%20de%20motion%20design."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Direto"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-tight shadow-2xl transition-all duration-200 active:scale-95"
      >
        <MessageCircle size={15} className="fill-black text-black shrink-0" />
        <span>WhatsApp</span>
      </a>

      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Fechar botão"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-zinc-900/40 text-white hover:bg-zinc-900 text-[10px] cursor-pointer"
      >
        <X size={11} />
      </button>
    </div>
  );
};
