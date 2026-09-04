import React from 'react';
import { motion } from 'motion/react';
import { APLogo } from './APLogo';
import { CheckCircle2, Clock, Zap, Globe } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const clients = [
    { name: 'Heetch Angola', category: 'Mobilidade Urbana' },
    { name: 'Yango Angola', category: 'Transporte & Entregas' },
    { name: 'Deliplus Cosméticos', category: 'Beleza & Cuidados' },
    { name: 'Herbíssimo', category: 'Produtos Naturais' },
    { name: 'Ao Ponto', category: 'Gastronomia' },
    { name: 'Fussion & Paixão', category: 'Cosmética' },
  ];

  const stats = [
    { value: '100%', label: 'Dedicação', color: '#6C63FF' },
    { value: 'Rápido', label: 'Atendimento', color: '#00F5FF' },
    { value: '4K/HD', label: 'Qualidade', color: '#F5B731' },
  ];

  const advantages = [
    {
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      title: 'Comunicação Directa',
      desc: 'Alinhamento contínuo pelo WhatsApp para aprovações ágeis e sem burocracia.',
    },
    {
      icon: <Clock size={16} className="text-[#6C63FF]" />,
      title: 'Pontualidade',
      desc: 'Prazos rigorosamente cumpridos com ficheiros exportados nas medidas exactas.',
    },
    {
      icon: <Zap size={16} className="text-[#F5B731]" />,
      title: 'Alta Qualidade',
      desc: 'Produções em 4K e HD com motion design profissional de nível internacional.',
    },
    {
      icon: <Globe size={16} className="text-[#00F5FF]" />,
      title: 'Atendimento Global',
      desc: 'Servimos Angola e clientes internacionais com entrega remota completa.',
    },
  ];

  return (
    <section id="sobre" className="py-16 sm:py-24 px-3 sm:px-6 md:px-8 max-w-[1240px] mx-auto">
      <div className="divider-gradient mb-16" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

        {/* Left Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4 flex flex-col"
        >
          <div className="h-full rounded-[28px] bg-[#0F1420] border border-white/[0.07] p-7 sm:p-8 flex flex-col items-center justify-between text-center shadow-sm">
            <div className="flex flex-col items-center">
              {/* Logo with glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-[#6C63FF]/20 blur-2xl scale-150 pointer-events-none" />
                <div className="relative w-20 h-20 rounded-3xl bg-[#161D2E] border border-white/[0.08] flex items-center justify-center">
                  <APLogo size={52} animated={false} glow={false} className="text-[#6C63FF]" />
                </div>
              </div>

              <h3 className="text-xl font-bold font-display text-white">AP MOTION STUDIO</h3>
              <div className="text-xs font-semibold text-[#6C63FF] mt-0.5">Das ideias às soluções</div>

              <p className="text-xs text-[#6B7A99] mt-3 leading-relaxed max-w-xs">
                Estúdio especializado em motion design, edição de vídeos comerciais e identidades visuais dinâmicas em Luanda, Angola.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] w-full grid grid-cols-3 gap-2 text-center">
              {stats.map((s, i) => (
                <div key={i} className={i === 1 ? 'border-x border-white/[0.05] px-1' : ''}>
                  <div className="text-lg font-extrabold font-display" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] font-medium text-[#6B7A99] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Narrative Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8 flex flex-col justify-between rounded-[28px] bg-[#0F1420] border border-white/[0.07] p-7 sm:p-9 shadow-sm space-y-7"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] uppercase tracking-widest">
              <span className="w-4 h-px bg-[#6C63FF]" />
              <span>Sobre o Estúdio &amp; Visão</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tighter leading-snug">
              Vídeos e artes pensados para
              <span className="text-gradient-static"> destacar marcas</span> e gerar resultados reais.
            </h2>

            <p className="text-sm text-[#6B7A99] leading-relaxed">
              Na AP Motion, acreditamos que um bom design em movimento faz toda a diferença entre ser ignorado no feed e prender a atenção do cliente. Criamos animações que explicam produtos com clareza, vídeos promocionais que aumentam as conversões e flyers digitais de alto padrão estético.
            </p>

            <p className="text-sm text-[#6B7A99] leading-relaxed">
              Atendemos empresas e marcas em Angola e internacionalmente — desde startups, imobiliárias e gastronomia a marcas consolidadas como Heetch e Yango.
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#161D2E] border border-white/[0.05]">
                <div className="mt-0.5 shrink-0">{adv.icon}</div>
                <div className="text-xs">
                  <span className="font-bold text-white">{adv.title}: </span>
                  <span className="text-[#6B7A99]">{adv.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Clients Strip */}
          <div className="pt-5 border-t border-white/[0.06]">
            <span className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-wider block mb-3">
              Marcas que confiam na AP Motion:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {clients.map((c) => (
                <span
                  key={c.name}
                  className="px-3 py-1 rounded-full bg-[#161D2E] text-[#B0BDDA] text-xs font-semibold border border-white/[0.06] hover:border-[#6C63FF]/30 hover:text-white transition-all cursor-default"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
