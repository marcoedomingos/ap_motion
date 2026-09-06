import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [serviceType, setServiceType] = useState('Vídeo Comercial / Promocional');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const services = [
    'Vídeo Comercial / Promocional',
    'Motion Design & Animação',
    'Flyer Digital / Design Gráfico',
    'Identidade Visual & Vinheta',
  ];

  const generateWhatsAppLink = () => {
    const text = `Olá AP Motion! Meu nome é ${name || 'um cliente'}.\n• Serviço: ${serviceType}\n• Telefone: ${phone || 'Não informado'}\n• Detalhes do projeto: ${details || 'Gostaria de agendar uma conversa para orçamento.'}`;
    return `https://wa.me/244950723170?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.open(generateWhatsAppLink(), '_blank');
  };

  const contactCards = [
    {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp Direto',
      value: '+244 950 723 170',
      sub: 'Resposta em minutos',
      href: 'https://wa.me/244950723170?text=Ol%C3%A1%20AP%20Motion%2C%20gostaria%20de%20um%20or%C3%A7amento.',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'contato@apmotion.ao',
      sub: 'Briefings e propostas',
      href: 'mailto:contato@apmotion.ao',
    },
  ];

  return (
    <section id="contacto" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-[1240px] mx-auto text-white bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Contacto &amp; Briefing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Inicie uma colaboração com o nosso estúdio.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
              Discuta o seu projeto diretamente connosco pelo WhatsApp ou envie um briefing detalhado através do formulário.
            </p>
          </div>

          <div className="space-y-3">
            {contactCards.map((card, i) => (
              <a
                key={i}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/30 shadow-xs transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-white/10">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400 font-medium">{card.label}</div>
                    <div className="text-sm font-bold text-white">{card.value}</div>
                    <div className="text-xs text-zinc-500">{card.sub}</div>
                  </div>
                </div>
                <span className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all text-base font-bold">↗</span>
              </a>
            ))}

            {/* Location */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-950 border border-white/10 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 border border-white/10">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[11px] text-zinc-400 font-medium">Localização</div>
                <div className="text-sm font-bold text-white">Luanda, Angola</div>
                <div className="text-xs text-zinc-500">Atendimento presencial &amp; remoto</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Solicitar Orçamento
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Selecione o serviço e envie a solicitação diretamente para o nosso WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Tipo de Serviço
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((s) => {
                    const isSelected = serviceType === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setServiceType(s)}
                        className={`text-left text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-xs font-bold'
                            : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-850 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nome / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Manuel Silva"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-zinc-850 focus:border-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +244 9..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-zinc-850 focus:border-white transition-all"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Detalhes do Projeto
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Descreva o formato, objetivo e prazo estimado do projeto..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-zinc-850 focus:border-white transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm tracking-tight transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle size={16} className="fill-black text-black" />
                <span>Enviar Solicitação via WhatsApp</span>
                <Send size={13} />
              </button>

              {submitted && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/20 text-white text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>Mensagem preparada! Abrindo WhatsApp...</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
