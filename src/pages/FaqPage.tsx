import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../router.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const FaqPage: React.FC = () => {
  const { navigate } = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Comment se passe le paiement à la livraison ?',
      a: 'Zéro risque pour vous ! Vous commandez en 30 secondes sans sortir votre carte bancaire. Lorsque le livreur arrive à votre domicile ou bureau, vous ouvrez le carton, vérifiez l’état des articles et réglez ensuite en espèces ou par Mobile Money (Wave, Orange Money, MTN).',
    },
    {
      q: 'Est-ce difficile à installer seul ?',
      a: 'Absolument pas ! Tous nos packs et guirlandes sont conçus pour une pose express en 15 à 20 minutes maximum. Des pastilles de fixation double face transparentes (qui ne laissent aucune trace sur les murs peints) et toutes les piles nécessaires sont incluses.',
    },
    {
      q: 'Quels sont les délais de livraison garantis avant le 31 ?',
      a: 'Nous assurons une livraison en 24h à 48h ouvrées sur Abidjan, Dakar, Cotonou et Lomé. Pour toute commande passée avant 16h, le départ de notre entrepôt local est garanti le jour même.',
    },
    {
      q: 'Et si un article ne fonctionne pas ou ne me plaît pas ?',
      a: 'Vous bénéficiez de notre garantie satisfait ou intégralement remboursé pendant 14 jours. De plus, nos livreurs effectuent un test visuel avec vous lors de la remise en mains propres.',
    },
    {
      q: 'Les guirlandes et bougies LED sont-elles sûres pour les enfants ?',
      a: 'Oui, à 100%. Nos décorations utilisent des micro-LEDs basse tension qui restent totalement froides au toucher même après 12 heures d’allumage ininterrompu. Zéro risque de brûlure ou d’incendie.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Foire Aux Questions (FAQ) | Éclat Express"
        description="Toutes les réponses à vos questions sur les délais de livraison garantis, l'installation express et le paiement en mains propres."
        canonicalPath="/faq"
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-2">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Aide &amp; Réponses
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33]">
            Foire Aux Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B]">
            Toutes les réponses à vos questions sur les commandes, la livraison express et le paiement en mains propres.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBECEF] divide-y divide-[#EBECEF] shadow-card overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 sm:p-5">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0B1B33]"
              >
                <span>{faq.q}</span>
                <motion.i
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`fa-solid fa-chevron-down text-xs ${
                    openIndex === idx ? 'text-[#0B1B33]' : 'text-[#46536B]'
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-xs text-[#46536B] leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="bg-[#D9C2A3]/25 border border-[#D9C2A3]/40 rounded-2xl p-6 text-center space-y-3">
          <p className="text-xs font-bold text-[#0B1B33]">Une autre question avant de commander ?</p>
          <a
            href="https://wa.me/2250700000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1fb355] transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-base"></i>
            <span>Discuter avec un conseiller sur WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
};
