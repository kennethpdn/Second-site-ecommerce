import React from 'react';
import { useRouter } from '../router.tsx';
import { useStore } from '../context/StoreContext.tsx';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { avis } = useStore();

  const validatedAvisCount = avis.filter((a) => a.valide).length;

  return (
    <footer className="bg-[#F5F7FA] pt-8 sm:pt-14">
      {/* Main Curved Dark Footer Container */}
      <div className="relative bg-[#0C1420] text-white rounded-t-[36px] sm:rounded-t-[54px] border-t border-white/10 px-5 sm:px-8 lg:px-12 pt-8 pb-10 sm:pb-12 overflow-hidden shadow-2xl">
        {/* Subtle Topographic Background Contour Texture */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="footerTopo" width="800" height="500" patternUnits="userSpaceOnUse">
              <path
                d="M0,100 C150,150 250,50 400,100 C550,150 650,50 800,100"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <path
                d="M0,200 C180,260 260,160 400,220 C560,280 660,160 800,220"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <path
                d="M0,320 C140,380 280,280 420,340 C580,400 680,280 800,340"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <path
                d="M0,420 C200,480 320,380 460,440 C600,500 700,380 800,440"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerTopo)" />
        </svg>

        {/* Top Center Emblem (Asterisk / Starburst with Topographic Waves) */}
        <div className="relative -mt-14 sm:-mt-16 flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#070D16] p-2.5 border border-white/15 shadow-2xl flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 sm:w-16 sm:h-16 group-hover:rotate-12 transition-transform duration-500"
            >
              <defs>
                <linearGradient id="asteriskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="45%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <clipPath id="asteriskLobeClip">
                  <g>
                    <rect x="16" y="42" width="68" height="16" rx="8" />
                    <rect x="16" y="42" width="68" height="16" rx="8" transform="rotate(60 50 50)" />
                    <rect x="16" y="42" width="68" height="16" rx="8" transform="rotate(120 50 50)" />
                  </g>
                </clipPath>
              </defs>
              {/* 6-point rounded asterisk */}
              <g fill="url(#asteriskGrad)">
                <rect x="16" y="42" width="68" height="16" rx="8" />
                <rect x="16" y="42" width="68" height="16" rx="8" transform="rotate(60 50 50)" />
                <rect x="16" y="42" width="68" height="16" rx="8" transform="rotate(120 50 50)" />
              </g>
              {/* Organic contour waves */}
              <g stroke="#033F28" strokeWidth="2.2" fill="none" opacity="0.85" clipPath="url(#asteriskLobeClip)">
                <path d="M 0 20 Q 30 45 50 20 T 100 20" />
                <path d="M 0 32 Q 30 57 50 32 T 100 32" />
                <path d="M 0 44 Q 30 69 50 44 T 100 44" />
                <path d="M 0 56 Q 30 81 50 56 T 100 56" />
                <path d="M 0 68 Q 30 93 50 68 T 100 68" />
                <path d="M 0 80 Q 30 105 50 80 T 100 80" />
              </g>
            </svg>
          </div>
        </div>

        {/* Center Brand Header & Action Pills (Awwwards design) */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Éclat Express
          </h2>
          <p className="font-signature italic text-lg sm:text-xl text-[#D9C2A3]">
            L'art d'illuminer le 31 décembre sans stress
          </p>

          {/* Two Pill CTA Buttons with arrows */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/packs')}
              className="h-11 px-6 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#052115] font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Voir les packs réveillon</span>
              <span className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center text-[10px]">
                →
              </span>
            </button>

            <button
              onClick={() => navigate('/boutique')}
              className="h-11 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 border border-white/15 transition-all active:scale-95 cursor-pointer"
            >
              <span>Boutique complète</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          {/* Left Column: Contact & Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Contact
            </h3>
            <div className="space-y-1.5 text-xs text-[#A0AEC0] leading-relaxed">
              <p className="font-semibold text-white/90">
                Éclat Express — Décors Réveillon 31 Décembre
              </p>
              <p>Abidjan (Cocody, Plateau, Marcory) • Dakar • Cotonou • Lomé</p>
              <p>Infoline &amp; WhatsApp : +225 07 00 00 00 00</p>
              <p>Email direct : contact@eclatexpress.ci</p>
            </div>

            {/* Social Links with diagonal arrows */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#D9C2A3]">
              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>WhatsApp</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Instagram</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>TikTok</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Facebook</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>

            {/* Score & Payment Pills */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#10B981] text-[#061F14] text-[11px] font-black px-2 py-0.5 rounded-md">
                  4.9
                </span>
                <span className="text-xs text-[#CBD5E1] font-semibold">
                  Avis clients certifiés (100% retours vérifiés)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#94A3B8]">
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white/90">
                  Wave
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white/90">
                  Orange Money
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white/90">
                  MTN MoMo
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white/90">
                  Espèces à la livraison
                </span>
              </div>
            </div>
          </div>

          {/* Center Space / Column spacer (1 col on desktop) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Right Column: Navigation (Snel naar) (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Navigation
            </h3>

            {/* 2 Sub-Columns of Links */}
            <div className="grid grid-cols-2 gap-6 text-xs text-[#A0AEC0]">
              <div className="space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#D9C2A3]">
                  Rayons de fête
                </p>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => navigate('/packs')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Packs réveillon 2027
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/boutique?cat=guirlandes')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Guirlandes &amp; Rideaux LED
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/boutique?cat=table-bougies')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Table &amp; Bougies de gala
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/boutique?cat=compte-a-rebours')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Compte à rebours &amp; Confettis
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/promos')}
                      className="hover:text-white transition-colors text-left text-[#D9C2A3] font-bold flex items-center gap-1.5"
                    >
                      <span>Ventes Flash &amp; Promos</span>
                      <span className="bg-[#C1121F] text-white text-[9px] px-1 rounded">
                        -%
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#D9C2A3]">
                  Services &amp; Garanties
                </p>
                <ul className="space-y-2">
                  {validatedAvisCount > 0 && (
                    <li>
                      <button
                        onClick={() => navigate('/avis-clients')}
                        className="hover:text-white transition-colors text-left"
                      >
                        Salons de nos clients
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => navigate('/livraison-garantie')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Livraison garantie 24h-48h
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/livraison-paiement')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Paiement à réception
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/faq')}
                      className="hover:text-white transition-colors text-left"
                    >
                      FAQ &amp; Guide d'installation
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/professionnels')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Espace Professionnels (B2B)
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Right Floating Pill Badge matching Awwwards design */}
            <div className="pt-6 flex justify-start lg:justify-end">
              <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-[#FAF7EE] text-[#0B1B33] px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold shadow-lg">
                <button
                  onClick={() => navigate('/cookies')}
                  className="hover:underline cursor-pointer"
                >
                  Cookies policy
                </button>
                <span className="text-[#D9C2A3]">•</span>
                <button
                  onClick={() => navigate('/confidentialite')}
                  className="hover:underline cursor-pointer"
                >
                  Privacy policy
                </button>
                <span className="text-[#D9C2A3]">•</span>
                <button
                  onClick={() => navigate('/cgv')}
                  className="hover:underline cursor-pointer"
                >
                  CGV
                </button>
                <span className="text-[#D9C2A3]">•</span>
                <span>©2027</span>
                <span className="text-[#D9C2A3]">•</span>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-[#46536B] hover:text-[#0B1B33] transition-colors cursor-pointer"
                  title="Administration"
                >
                  <i className="fa-solid fa-shield-halved"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
