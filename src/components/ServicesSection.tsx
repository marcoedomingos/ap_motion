import React from 'react';
import { motion } from 'motion/react';
import { Video, Sparkles, Image as ImageIcon, Layers, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/projects';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const getServiceConfig = (index: number) => {
    const configs = [
      {
        icon: <Video size={22} />,
        iconBg: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
        iconColor: '#ef4444',
        borderColor: 'rgba(239,68,68,0.25)',
        numColor: 'rgba(239,68,68,0.08)',
      },
      {
        icon: <Sparkles size={22} />,
        iconBg: 'linear-gradient(135deg, rgba(245,183,49,0.2), rgba(245,183,49,0.05))',
        iconColor: '#F5B731',
        borderColor: 'rgba(245,183,49,0.25)',
        numColor: 'rgba(245,183,49,0.08)',
      },
      {
        icon: <ImageIcon size={22} />,
        iconBg: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.05))',
        iconColor: '#6C63FF',
        borderColor: 'rgba(108,99,255,0.25)',
        numColor: 'rgba(108,99,255,0.08)',
      },
      {
        icon: <Layers size={22} />,
        iconBg: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(0,245,255,0.05))',
        iconColor: '#00F5FF',
        borderColor: 'rgba(0,245,255,0.25)',
        numColor: 'rgba(0,245,255,0.08)',
      },
    ];
    return configs[index] ?? configs[0];
  };

  return (
    <section id="servicos" className="py-16 sm:py-24 px-3 sm:px-6 md:px-8 max-w-[1240px] mx-auto">
      <div className="divider-gradient mb-16" />

      <div className="max-w-xl mb-14">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">
          <span className="w-4 h-px bg-[#6C63FF]" />
          <span>Especialidades &amp; Soluções</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tighter">
          O que
          <span className="block text-gradient-static">Criamos.</span>
        </h2>
        <p className="text-[#6B7A99] text-sm mt-3 leading-relaxed">
          Unimos criatividade e estratégia para entregar conteúdos visuais que geram autoridade e aceleram o crescimento do seu negócio.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {SERVICES.map((service, idx) => {
          const config = getServiceConfig(idx);
          const num = String(idx + 1).padStart(2, '0');
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => onSelectService(service.title)}
              className="group relative rounded-[28px] bg-[#0F1420] border border-white/[0.07] p-7 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                '--hover-border': config.borderColor,
              } as React.CSSProperties}
              whileHover={{
                y: -5,
                boxShadow: `0 0 0 1px ${config.borderColor}, 0 24px 60px rgba(0,0,0,0.4)`,
                borderColor: config.borderColor,
                transition: { duration: 0.2 },
              }}
            >
              {/* Faded background number */}
              <div
                className="absolute -top-4 -right-2 font-display font-extrabold text-[100px] leading-none select-none pointer-events-none transition-colors duration-300"
                style={{ color: config.numColor }}
              >
                {num}
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: config.iconBg, color: config.iconColor }}
                  >
                    {config.icon}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: config.iconColor,
                    }}
                  >
                    ↗
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-white transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B7A99] leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 text-xs text-[#6B7A99] bg-[#161D2E] p-3 rounded-xl border border-white/[0.06]">
                  <span className="font-semibold" style={{ color: config.iconColor }}>Formato de Entrega: </span>
                  {service.deliverable}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between relative z-10">
                <div className="flex flex-wrap gap-1.5">
                  {service.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-[#161D2E] text-[10px] font-medium text-[#6B7A99] border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span
                  className="text-xs font-semibold flex items-center gap-1 transition-colors"
                  style={{ color: config.iconColor }}
                >
                  Pedir Proposta
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
