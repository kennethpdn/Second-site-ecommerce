import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../router.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { PackCard } from '../components/PackCard.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { FreeShippingBar } from '../components/FreeShippingBar.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { categories, packs, produits, avis, setQuizVibe } = useStore();
  const [selectedVibe, setSelectedVibe] = useState<'chic' | 'festif' | 'famille'>('chic');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Review Slider ref and controls
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 390;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Best-sellers list (filter by populaire == true or badge == 'best-seller')
  const bestSellers = produits.filter((p) => p.populaire || p.badge === 'best-seller').slice(0, 4);

  // Validated reviews
  const validatedAvis = avis.filter((a) => a.valide);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizVibe(selectedVibe);
    navigate('/boutique');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus({ type: 'error', message: 'Veuillez saisir une adresse email valide.' });
      return;
    }

    setNewsletterLoading(true);
    setNewsletterStatus(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus({ type: 'success', message: data.message });
        setNewsletterEmail('');
      } else {
        setNewsletterStatus({ type: 'error', message: data.error || 'Erreur lors de l’inscription.' });
      }
    } catch (err) {
      setNewsletterStatus({ type: 'error', message: 'Erreur réseau. Veuillez réessayer.' });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Éclat Express | Décorations Réveillon 31 Décembre"
        description="Boutique en ligne festive pour le réveillon du 31 décembre : packs prêts à poser, guirlandes et bougies LED avec livraison express 24h-48h."
      />

      <div className="space-y-12 pb-16">
        {/* =====================================================================
            HERO SECTION (Desktop & Mobile Responsive, 1200px container)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-[1200px] mx-auto bg-white rounded-2xl border border-[#EBECEF] shadow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Image banner: 7 cols on desktop, full width on mobile */}
              <div className="lg:col-span-7 relative aspect-16/9 lg:aspect-4/3 w-full bg-[#0B1B33] overflow-hidden order-1 lg:order-2">
                <img
                  src="https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1400&q=80"
                  alt="Salon illuminé et décoré pour le réveillon du 31 décembre"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="badge-champagne text-xs">
                    Collection Réveillon 2027
                  </span>
                </div>
              </div>

              {/* Text content: 5 cols on desktop */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="lg:col-span-5 p-6 sm:p-10 space-y-5 order-2 lg:order-1"
              >
                <span className="text-xs font-black text-[#D9C2A3] uppercase tracking-widest block">
                  Édition Saint-Sylvestre
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-[#0B1B33] tracking-tight leading-tight">
                  Décorez le 31 décembre en une soirée.
                </h1>

                <p className="text-sm sm:text-base text-[#46536B] leading-relaxed">
                  Packs prêts à poser, livrés avant le réveillon sans stress. Tout ce qu'il faut dans un seul carton pour une fête éblouissante.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/packs')}
                    className="h-13 px-8 bg-[#0B1B33] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#162a4a] transition-colors shadow-md"
                  >
                    <span>Voir les packs réveillon</span>
                    <i className="fa-solid fa-arrow-down text-xs text-[#D9C2A3]"></i>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/boutique')}
                    className="h-13 px-6 bg-[#F5F7FA] text-[#0B1B33] font-bold text-xs sm:text-sm rounded-xl border border-[#EBECEF] hover:bg-[#EBECEF] transition-colors"
                  >
                    Boutique complète
                  </motion.button>
                </div>

                {/* 3 Trust points */}
                <div className="pt-4 border-t border-[#EBECEF] flex flex-wrap items-center justify-between gap-3 text-xs text-[#46536B]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0B1B33]">
                    <i className="fa-solid fa-truck text-[#0B1B33]"></i>
                    <span>Livraison 24h-48h</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#0B1B33]">
                    <i className="fa-solid fa-wallet text-[#0B1B33]"></i>
                    <span>Paiement à réception</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#0B1B33]">
                    <i className="fa-solid fa-rotate-left text-[#0B1B33]"></i>
                    <span>Retour 14 jours</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SHOP BY CATEGORY (ADAPTED TO USER REFERENCE DESIGN)
        ====================================================================== */}
        {(() => {
          const categoryStyleMap: Record<
            string,
            { label: string; gradient: string; textColor: string; image: string }
          > = {
            'guirlandes': {
              label: 'Guirlandes LED',
              gradient: 'from-[#74BCF7] to-[#A2D9FA]',
              textColor: '#0F2942',
              image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80',
            },
            'packs': {
              label: 'Packs Complets',
              gradient: 'from-[#FBA252] to-[#FDC187]',
              textColor: '#3A1F0B',
              image: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=400&q=80',
            },
            'table-bougies': {
              label: 'Table & Bougies',
              gradient: 'from-[#78D3C2] to-[#A4E8DC]',
              textColor: '#10352E',
              image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80',
            },
            'compte-a-rebours': {
              label: 'Compte à Rebours',
              gradient: 'from-[#EE7F76] to-[#F7AAA4]',
              textColor: '#3A1412',
              image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=400&q=80',
            },
            'exterieur': {
              label: 'Extérieur & Balcon',
              gradient: 'from-[#AF9EF3] to-[#CCAFF7]',
              textColor: '#231846',
              image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
            },
            'petits-prix': {
              label: 'Petits Prix & Accessoires',
              gradient: 'from-[#F9B988] to-[#FCD5B5]',
              textColor: '#3A2312',
              image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=400&q=80',
            },
          };

          // Priority ordering matching the reference image layout:
          // Top-Left: Blue (Guirlandes) | Top-Right: Orange (Packs)
          // Bottom-Left: Teal (Table)  | Bottom-Right: Coral (Compte à Rebours)
          const prioritySlugs = [
            'guirlandes',
            'packs',
            'table-bougies',
            'compte-a-rebours',
            'exterieur',
            'petits-prix',
          ];

          const sortedCats = [...categories].sort((a, b) => {
            const indexA = prioritySlugs.indexOf(a.slug);
            const indexB = prioritySlugs.indexOf(b.slug);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
          });

          return (
            <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
              <div className="bg-white rounded-3xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-6">
                {/* Header matching the reference card */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B1B33] tracking-tight">
                    Shop By Category
                  </h2>
                  <button
                    onClick={() => navigate('/boutique')}
                    className="text-sm sm:text-base font-bold text-[#E07A5F] hover:text-[#C45E44] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View All</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>

                {/* 2-Column Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {sortedCats.map((cat, idx) => {
                    const style = categoryStyleMap[cat.slug] || {
                      label: cat.nom,
                      gradient: 'from-[#74BCF7] to-[#A2D9FA]',
                      textColor: '#0F2942',
                      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80',
                    };

                    return (
                      <motion.button
                        key={cat.id || cat.slug}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/boutique?cat=${cat.slug}`)}
                        className={`relative h-[115px] sm:h-[130px] rounded-2xl overflow-hidden flex items-center justify-between px-6 py-4 cursor-pointer shadow-xs transition-all group bg-gradient-to-r ${style.gradient} text-left`}
                      >
                        {/* Category Name */}
                        <span
                          className="font-extrabold text-base sm:text-lg leading-snug max-w-[55%] z-10 group-hover:translate-x-1 transition-transform"
                          style={{ color: style.textColor }}
                        >
                          {style.label || cat.nom}
                        </span>

                        {/* Diagonal Accent Overlay matching reference */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to left, rgba(255,255,255,0.4), rgba(255,255,255,0.06))',
                            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
                          }}
                        />

                        {/* Category Product Image */}
                        <div className="relative z-10 w-24 sm:w-28 h-20 sm:h-24 flex items-center justify-center shrink-0">
                          <img
                            src={style.image}
                            alt={cat.nom}
                            className="w-full h-full object-cover rounded-xl shadow-xs border border-white/60 group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}

        {/* =====================================================================
            PACKS PRÊTS À POSER
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EBECEF] pb-4">
            <div>
              <p className="font-signature text-xl sm:text-2xl text-[#0B1B33]">
                L'art de recevoir sans stress
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33] tracking-tight">
                Packs prêts à poser
              </h2>
            </div>
            <button
              onClick={() => navigate('/packs')}
              className="text-xs font-bold text-[#0B1B33] hover:underline flex items-center gap-1.5"
            >
              <span>Découvrir les 4 configurations</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packs.slice(0, 2).map((pack) => (
              <PackCard key={pack.id} pack={pack} featured />
            ))}
          </div>
        </section>

        {/* =====================================================================
            BEST-SELLERS (MULTI-COLUMN GRID 4 COLS DESKTOP)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#EBECEF] pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33] tracking-tight">
                Best-sellers
              </h2>
              <p className="text-xs text-[#46536B]">Validés pour illuminer la fête du réveillon</p>
            </div>
            <button
              onClick={() => navigate('/boutique')}
              className="text-xs font-bold text-[#0B1B33] hover:underline flex items-center gap-1"
            >
              <span>Tout le catalogue</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} produit={prod} />
            ))}
          </div>
        </section>

        {/* =====================================================================
            FREE SHIPPING BAR (1200px container)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <FreeShippingBar />
        </section>

        {/* =====================================================================
            ACHETEZ EN TOUTE SÉRÉNITÉ (4 GARANTIES)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33] tracking-tight">
              Achetez en toute sérénité
            </h2>
            <p className="text-xs sm:text-sm text-[#46536B]">Notre engagement de service avant le grand soir du 31</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: 'fa-truck-fast',
                title: 'Livraison suivie 24h-48h',
                desc: 'Envoi sécurisé avec alertes SMS et WhatsApp.',
                link: '/livraison-garantie',
              },
              {
                icon: 'fa-wallet',
                title: 'Paiement à la livraison',
                desc: 'Réglez en cash ou Mobile Money (Wave, OM) au livreur.',
                link: '/livraison-paiement',
              },
              {
                icon: 'fa-shield-heart',
                title: 'Retour garanti 14 jours',
                desc: 'Garanti satisfait ou intégralement remboursé sans tracasseries.',
                link: '/faq',
              },
              {
                icon: 'fa-headset',
                title: 'Conseil WhatsApp 7j/7',
                desc: 'Commandes et échanges en direct avec notre équipe.',
                link: '/contact',
              },
            ].map((item, idx) => {
              const isBackInDown = idx === 0 || idx === 2;
              const isBackInLeft = idx === 1 || idx === 3;

              const motionConfig = isBackInDown
                ? {
                    initial: { opacity: 0.7, y: -600, scale: 0.7 },
                    whileInView: {
                      opacity: [0.7, 0.7, 1],
                      y: [-600, 0, 0],
                      scale: [0.7, 0.7, 1],
                    },
                    animationClass: 'backInDown animate-backInDown',
                  }
                : isBackInLeft
                ? {
                    initial: { opacity: 0.7, x: -600, scale: 0.7 },
                    whileInView: {
                      opacity: [0.7, 0.7, 1],
                      x: [-600, 0, 0],
                      scale: [0.7, 0.7, 1],
                    },
                    animationClass: 'backInLeft animate-backInLeft',
                  }
                : null;

              return (
                <motion.div
                  key={idx}
                  initial={motionConfig?.initial}
                  whileInView={motionConfig?.whileInView}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    times: [0, 0.8, 1],
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.link)}
                  className={`bg-white p-5 rounded-2xl border border-[#EBECEF] shadow-card space-y-2 hover:border-[#0B1B33] transition-all cursor-pointer group ${
                    motionConfig?.animationClass || ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] text-[#0B1B33] group-hover:bg-[#0B1B33] group-hover:text-white transition-colors flex items-center justify-center text-sm">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0B1B33]">{item.title}</h3>
                  <p className="text-xs text-[#46536B] leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            CE QUE DISENT NOS CLIENTS (TESTIMONIALS SLIDER WITH PASTEL PALETTE)
        ====================================================================== */}
        {(() => {
          const row1Cards = [
            {
              id: 'rev-1',
              bg: '#FFB4A2',
              textColor: '#2D1414',
              subColor: '#5C3333',
              quote:
                validatedAvis[0]?.texte ||
                "J'ai essayé d'innombrables décorations auparavant, mais rien ne se compare à l'éclat et la qualité de ce pack. Notre salon est devenu féerique en 20 minutes sans électricien !",
              author: validatedAvis[0]?.auteur || 'Aïcha Koné',
              location: validatedAvis[0]?.ville || 'Abidjan, Cocody Riviera',
              avatar:
                validatedAvis[0]?.photoUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-2',
              bg: '#FED2A4',
              textColor: '#2A180C',
              subColor: '#593B23',
              quote:
                validatedAvis[1]?.texte ||
                "En tant que passionnée de réveillon, j'apprécie la richesse des nuances et la sécurité des bougies LED. Tout s'allume en un clic avec la télécommande, un vrai bonheur !",
              author: validatedAvis[1]?.auteur || 'Sophie Mensah',
              location: validatedAvis[1]?.ville || 'Abidjan, Marcory Zone 4',
              avatar:
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-3',
              bg: '#FEE58F',
              textColor: '#2A240C',
              subColor: '#5B4F1F',
              quote:
                validatedAvis[2]?.texte ||
                "Je ne savais pas qu'une décoration livrée en 24h pouvait être aussi élégante ! Les lumières sont si pures et apaisantes. Et le packaging complet avec piles est parfait.",
              author: validatedAvis[2]?.auteur || 'Mamadou Diallo',
              location: validatedAvis[2]?.ville || 'Dakar, Almadies',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-4-extra',
              bg: '#FFB4A2',
              textColor: '#2D1414',
              subColor: '#5C3333',
              quote:
                "Paiement Wave sécurisé à la livraison après inspection du carton avec le livreur. Très rassurant pour commander en toute tranquillité avant le grand soir du 31 !",
              author: 'Marc-Antoine B.',
              location: 'Abidjan, Plateau',
              avatar:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            },
          ];

          const row2Cards = [
            {
              id: 'rev-4',
              bg: '#B7F4C8',
              textColor: '#122D1B',
              subColor: '#2B5738',
              quote:
                "Les pastilles de fixation n'ont laissé aucune trace sur ma peinture blanche au démontage le 2 janvier. Un gain de temps inestimable et des invités émerveillés !",
              author: 'Aminata Traoré',
              location: 'Yamoussoukro, Résidentiel',
              avatar:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-5',
              bg: '#BAE6FD',
              textColor: '#0E2638',
              subColor: '#2B4E6A',
              quote:
                "La variété des kits est bluffante ! Que l'on veuille illuminer une table de 6 personnes ou tout un salon pour 20 convives, Éclat Express a tout prévu. Je recommande !",
              author: 'Fatou Sow',
              location: 'Dakar, Plateau',
              avatar:
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-6',
              bg: '#D7C7FF',
              textColor: '#211836',
              subColor: '#4C3B6F',
              quote:
                "Cette sélection a métamorphosé notre réveillon ! Le rideau cascade 3x3m donne un arrière-plan spectaculaire pour toutes nos photos de fête. Les enfants étaient fascinés.",
              author: 'Priya Deshmukh',
              location: 'Abidjan, Riviera Golf',
              avatar:
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
            },
            {
              id: 'rev-7',
              bg: '#FFB3DC',
              textColor: '#2E1222',
              subColor: '#6B2B50',
              quote:
                "Complètement conquise par la finesse des micro-guirlandes cuivrées. Elles ne chauffent pas, restent allumées toute la nuit et créent une ambiance dorée sublime.",
              author: 'Sarah & David K.',
              location: 'Abidjan, Deux Plateaux',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
            },
          ];

          return (
            <section className="px-4 sm:px-6 lg:px-8 max-w-[1300px] mx-auto space-y-6">
              {/* Centered Header matching reference design */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1B33] tracking-tight">
                  Ce que disent nos clients ?
                </h2>
                <p className="text-xs sm:text-sm text-[#46536B] leading-relaxed">
                  Ne nous croyez pas sur parole — découvrez ce que nos clients disent de leur expérience !
                </p>
              </div>

              {/* Slider Controls Bar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B33]">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span>Avis vérifiés &amp; retours d'expérience</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollSlider('left')}
                    className="w-10 h-10 rounded-full bg-white border border-[#EBECEF] hover:bg-[#0B1B33] hover:text-white hover:border-[#0B1B33] text-[#0B1B33] transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                    aria-label="Avis précédents"
                  >
                    <i className="fa-solid fa-arrow-left text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSlider('right')}
                    className="w-10 h-10 rounded-full bg-white border border-[#EBECEF] hover:bg-[#0B1B33] hover:text-white hover:border-[#0B1B33] text-[#0B1B33] transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                    aria-label="Avis suivants"
                  >
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                  <button
                    onClick={() => navigate('/avis-clients')}
                    className="text-xs font-bold text-[#0B1B33] hover:underline ml-2 hidden sm:inline-flex items-center gap-1"
                  >
                    <span>Tous les avis</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>

              {/* Slider Container with 2 Staggered Rows */}
              <div
                ref={sliderRef}
                className="overflow-x-auto no-scrollbar space-y-4 py-2 cursor-grab active:cursor-grabbing scroll-smooth select-none"
              >
                {/* Row 1 (Peach, Apricot, Yellow, Peach) */}
                <div className="flex gap-4 sm:gap-6 min-w-max">
                  {row1Cards.map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      style={{ backgroundColor: card.bg }}
                      className="w-[300px] sm:w-[360px] md:w-[390px] shrink-0 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-shadow"
                    >
                      <p
                        className="text-xs sm:text-[13px] leading-relaxed font-medium"
                        style={{ color: card.textColor }}
                      >
                        "{card.quote}"
                      </p>
                      <div className="flex items-center gap-3.5 pt-5">
                        <img
                          src={card.avatar}
                          alt={card.author}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <h3
                            className="font-bold text-sm sm:text-base leading-tight"
                            style={{ color: card.textColor }}
                          >
                            {card.author}
                          </h3>
                          <p
                            className="text-xs font-normal"
                            style={{ color: card.subColor }}
                          >
                            {card.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Row 2 (Mint, Sky Blue, Lavender, Bubblegum Pink) with left offset */}
                <div className="flex gap-4 sm:gap-6 min-w-max pl-8 sm:pl-16">
                  {row2Cards.map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      style={{ backgroundColor: card.bg }}
                      className="w-[300px] sm:w-[360px] md:w-[390px] shrink-0 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-shadow"
                    >
                      <p
                        className="text-xs sm:text-[13px] leading-relaxed font-medium"
                        style={{ color: card.textColor }}
                      >
                        "{card.quote}"
                      </p>
                      <div className="flex items-center gap-3.5 pt-5">
                        <img
                          src={card.avatar}
                          alt={card.author}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <h3
                            className="font-bold text-sm sm:text-base leading-tight"
                            style={{ color: card.textColor }}
                          >
                            {card.author}
                          </h3>
                          <p
                            className="text-xs font-normal"
                            style={{ color: card.subColor }}
                          >
                            {card.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* =====================================================================
            QUIZ & B2B (2-COLUMN GRID ON DESKTOP)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quiz Card */}
            <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#D9C2A3] text-xl">✦</span>
                  <h2 className="text-xl font-extrabold text-[#0B1B33]">
                    Quelle ambiance pour votre soirée ?
                  </h2>
                </div>
                <p className="text-xs text-[#46536B]">
                  Répondez en 1 clic pour filtrer immédiatement vos packs et guirlandes compatibles.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {[
                    { id: 'chic', label: 'Chic & Épuré' },
                    { id: 'festif', label: 'Festive & Éclatante' },
                    { id: 'famille', label: 'Familiale & Chaleureuse' },
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedVibe(option.id as any)}
                      className={`p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-colors ${
                        selectedVibe === option.id
                          ? 'bg-[#0B1B33] text-white border-[#0B1B33] shadow-xs'
                          : 'bg-[#F5F7FA] text-[#0B1B33] border-[#EBECEF] hover:bg-[#EBECEF]'
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedVibe === option.id && <i className="fa-solid fa-check text-xs text-[#D9C2A3]"></i>}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuizSubmit}
                className="w-full h-12 bg-[#0B1B33] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#162a4a] transition-colors shadow-sm"
              >
                <span>Trouver ma sélection sur mesure</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </motion.button>
            </div>

            {/* B2B Devis Card */}
            <div className="bg-[#EBECEF]/40 border border-[#EBECEF] rounded-2xl p-6 sm:p-8 shadow-card space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white text-[#0B1B33] flex items-center justify-center text-xl shadow-xs">
                  <i className="fa-solid fa-building"></i>
                </div>
                <h2 className="text-xl font-extrabold text-[#0B1B33]">
                  Restaurants, Bars, Hôtels : Devis en Gros
                </h2>
                <p className="text-xs text-[#46536B] leading-relaxed">
                  Tarifs dégressifs immédiats, volumes disponibles et livraison groupée pour illuminer vos réveillons professionnels et salles de banquet.
                </p>
              </div>

              <button
                onClick={() => navigate('/professionnels')}
                className="w-full h-12 bg-white text-[#0B1B33] border border-[#C7CCD1] hover:bg-[#F5F7FA] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <i className="fa-solid fa-file-invoice"></i>
                <span>Demander un devis B2B gratuit</span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            NEWSLETTER (1200px container)
        ====================================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <div className="bg-[#D9C2A3]/25 border border-[#D9C2A3]/40 rounded-2xl p-6 sm:p-10 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B33] uppercase tracking-wider">
                <i className="fa-solid fa-envelope-open-text text-[#0B1B33]"></i>
                <span>Nos meilleures idées pour le 31</span>
              </div>
              <p className="text-xs sm:text-sm text-[#46536B]">
                Recevez directement nos guides de décoration express et alertes de stocks prioritaires avant la rupture.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email (ex: amina@gmail.com)"
                required
                className="flex-1 h-12 px-4 rounded-xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-[#0B1B33] placeholder-[#46536B] focus:outline-none focus:border-[#0B1B33]"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="h-12 px-8 bg-[#0B1B33] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#162a4a] transition-all shrink-0 disabled:opacity-50"
              >
                {newsletterLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Rejoindre</span>}
              </button>
            </form>

            {newsletterStatus && (
              <p
                className={`text-xs font-bold ${
                  newsletterStatus.type === 'success' ? 'text-[#0B1B33]' : 'text-[#C1121F]'
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
