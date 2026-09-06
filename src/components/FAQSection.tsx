import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'processo' | 'prazos' | 'pagamento' | 'producao';
  question: string;
  answer: string;
  points?: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'tempo-producao',
    category: 'prazos',
    question: 'Quanto tempo demora para produzir um vídeo comercial ou animação?',
    answer:
      'O prazo médio varia de acordo com a complexidade e duração do projeto:',
    points: [
      'Vídeos comerciais para Reels / Redes Sociais: 3 a 7 dias úteis após validação do briefing.',
      'Edição de vídeo avançada, animações e vinhetas personalizadas: 1 a 2 semanas.',
      'Flyers digitais e peças estáticas para conversão: 24 a 48 horas.',
      'Trabalhos com prazo urgente (express) podem ser acordados diretamente via WhatsApp.',
    ],
  },
  {
    id: 'processo-criacao',
    category: 'processo',
    question: 'Como funciona o processo de criação de um projeto do zero?',
    answer:
      'Seguimos uma metodologia estruturada em 4 etapas para garantir máxima transparência e qualidade:',
    points: [
      '1. Briefing & Alinhamento: Entendemos o público-alvo, objetivo da campanha e a mensagem central.',
      '2. Roteiro & Direção Visual: Desenvolvemos o storyboard ou estilo estético antes da animação.',
      '3. Animação, Edição & Sonorização: Damos vida aos elementos com motion design, cortes de alta precisão e sonoplastia.',
      '4. Ajustes & Entrega: Realizamos as revisões acordadas e entregamos em alta definição (MP4 Full HD / 4K).',
    ],
  },
  {
    id: 'formas-pagamento',
    category: 'pagamento',
    question: 'Quais são as formas de pagamento disponíveis?',
    answer:
      'Trabalhamos com opções práticas e seguras para clientes individuais e empresas em Angola e no exterior:',
    points: [
      'Transferência bancária (IBAN nacional de Angola) e Multicaixa Express.',
      'Condição habitual: 50% de adiantamento no início e 50% na aprovação final antes da entrega sem marca de água.',
      'Emissão de fatura / recibo de prestação de serviços para empresas.',
      'Possibilidade de pagamentos internacionais sob consulta prévia.',
    ],
  },
  {
    id: 'locucao-trilha',
    category: 'producao',
    question: 'Vocês incluem locução profissional e sonoplastia nos vídeos?',
    answer:
      'Sim! Entregamos o vídeo completo e 100% pronto para veiculação nas suas plataformas:',
    points: [
      'Locução profissional (voz masculina ou feminina com dicção comercial envolvente).',
      'Sonoplastia e Sound Design exclusivo com efeitos de impacto (SFX).',
      'Trilha sonora licenciada e sincronizada ao ritmo das animações.',
    ],
  },
  {
    id: 'artes-estaticas-flyers',
    category: 'producao',
    question: 'Também criam peças estáticas ou apenas vídeos em movimento?',
    answer:
      'Além de motion design e edição de vídeo, produzimos uma linha completa de design publicitário estático:',
    points: [
      'Flyers digitais em alta resolução para WhatsApp, Instagram e Facebook.',
      'Packshots e encartes promocionais para produtos físicos e cosméticos.',
      'Carrosséis educativos e comerciais para aumento de retenção.',
      'Identidade visual e vinhetas dinâmicas para canais e redes.',
    ],
  },
  {
    id: 'revisoes-inclusas',
    category: 'processo',
    question: 'Quantas revisões estão incluídas no orçamento?',
    answer:
      'Para que o resultado fique exatamente alinhado com a visão da sua marca, incluímos rodadas de revisão transparentes:',
    points: [
      'Até 3 rodadas de ajustes pontuais (textos, cores, timings e transições) incluídas no valor contratado.',
      'As revisões são aplicadas com agilidade antes do render final.',
      'Alterações profundas de conceito ou roteiro após aprovação de etapas anteriores podem ser orçadas à parte.',
    ],
  },
  {
    id: 'formatos-entrega',
    category: 'producao',
    question: 'Em quais formatos e proporções os arquivos são entregues?',
    answer:
      'Entregamos os arquivos optimizados para as plataformas em que a sua marca mais converte:',
    points: [
      '9:16 Vertical: Ideal para Reels do Instagram, TikTok e WhatsApp Status.',
      '1:1 Quadrado: Formato clássico para Feed e catálogos.',
      '16:9 Horizontal: Excelente para YouTube, monitores de TV e apresentações institucionais.',
      'Formatos em MP4 codificados em H.264 / H.265 para carregar rápido sem perda de nitidez.',
    ],
  },
  {
    id: 'como-pedir-orcamento',
    category: 'pagamento',
    question: 'Como posso solicitar um orçamento para o meu projeto?',
    answer:
      'Basta entrar em contacto pelo WhatsApp direto (+244 950 723 170) ou preencher o formulário nesta página. Envie uma breve descrição da sua ideia ou referência, e apresentaremos uma proposta personalizada em menos de 2 horas úteis.',
  },
];

type CategoryFilter = 'todas' | 'prazos' | 'processo' | 'pagamento' | 'producao';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('tempo-producao');
  const [filter, setFilter] = useState<CategoryFilter>('todas');

  const filteredItems = FAQ_ITEMS.filter((item) => {
    if (filter === 'todas') return true;
    return item.category === filter;
  });

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'Todas as Dúvidas', value: 'todas' },
    { label: 'Prazos', value: 'prazos' },
    { label: 'Processo Criativo', value: 'processo' },
    { label: 'Pagamento & Orçamento', value: 'pagamento' },
    { label: 'Produção & Áudio', value: 'producao' },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 max-w-[1240px] mx-auto text-white bg-black">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-3">
          <HelpCircle size={13} className="text-white" />
          <span>Perguntas que normalmente fazem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
          Tire as suas dúvidas antes de começar.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
          Reunimos aqui as respostas para as perguntas mais comuns sobre o nosso método de trabalho, prazos, entregas e condições de pagamento.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === cat.value
                ? 'bg-white text-black shadow-sm font-bold'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-zinc-900 border-white/30 shadow-xl ring-1 ring-white/10'
                  : 'bg-zinc-950/80 hover:bg-zinc-900 border-white/10 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              >
                <span className="font-display font-bold text-sm sm:text-base text-white tracking-tight">
                  {item.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-white text-black rotate-180' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <ChevronDown size={15} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-zinc-300 text-xs sm:text-sm leading-relaxed border-t border-white/10">
                  <p className="text-zinc-300 font-medium">{item.answer}</p>
                  {item.points && item.points.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {item.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-white shrink-0 mt-0.5" />
                          <span className="text-zinc-300">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions CTA card - Black & White */}
      <div className="max-w-3xl mx-auto mt-10 p-5 sm:p-6 rounded-2xl bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-zinc-800">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-display font-bold text-sm sm:text-base">Tem outra pergunta ou dúvida específica?</div>
            <div className="text-xs text-zinc-400 mt-0.5">Fale diretamente com o nosso especialista pelo WhatsApp (+244 950 723 170).</div>
          </div>
        </div>
        <a
          href="https://wa.me/244950723170?text=Ol%C3%A1%20AP%20Motion%2C%20tenho%20uma%20pergunta%20sobre%20os%20vossos%20servi%C3%A7os."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
        >
          <MessageCircle size={15} className="fill-black text-black" />
          <span>Falar no WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
